use rusqlite::{Connection, Row};
use serde::{Deserialize, Serialize};
use std::sync::{Arc, Mutex};
use tauri::{Manager, State};

#[derive(Debug, Serialize, Deserialize)]
pub struct DatabaseResult<T = serde_json::Value> {
    pub success: bool,
    pub data: Option<T>,
    pub error: Option<String>,
}

impl<T> DatabaseResult<T> {
    pub fn success(data: T) -> Self {
        Self {
            success: true,
            data: Some(data),
            error: None,
        }
    }

    #[allow(dead_code)]
    pub fn error(error: String) -> Self {
        Self {
            success: false,
            data: None,
            error: Some(error),
        }
    }
}

pub struct DatabaseState {
    pub conn: Arc<Mutex<Option<Connection>>>,
}

impl DatabaseState {
    pub fn new() -> Self {
        Self {
            conn: Arc::new(Mutex::new(None)),
        }
    }

    pub fn get_connection(
        &self,
        app: &tauri::AppHandle,
    ) -> Result<Arc<Mutex<Option<Connection>>>, String> {
        let mut conn_opt = self.conn.lock().unwrap();

        if conn_opt.is_none() {
            let app_data_dir = app
                .path()
                .app_data_dir()
                .map_err(|e| format!("Could not get app data directory: {}", e))?;

            std::fs::create_dir_all(&app_data_dir)
                .map_err(|e| format!("Could not create app data directory: {}", e))?;

            let db_path = app_data_dir.join("database.db");
            let conn = Connection::open(&db_path)
                .map_err(|e| format!("Could not open database: {}", e))?;

            // Enable WAL mode for better concurrency
            // PRAGMA journal_mode returns a value, so we need to use query_row
            let journal_mode: String = conn
                .query_row("PRAGMA journal_mode = WAL", [], |row| row.get(0))
                .map_err(|e| format!("Could not set WAL mode: {}", e))?;

            // Verify WAL mode was set (should return "wal")
            if journal_mode.to_lowercase() != "wal" {
                return Err(format!("Failed to set WAL mode, got: {}", journal_mode));
            }

            // Enable foreign keys
            // PRAGMA foreign_keys doesn't return a value, so execute is fine
            conn.execute("PRAGMA foreign_keys = ON", [])
                .map_err(|e| format!("Could not enable foreign keys: {}", e))?;

            // Optimización puntual para Windows: aumentar cache size
            // Esto mejora significativamente el rendimiento en Windows sin riesgos
            conn.execute("PRAGMA cache_size = -8192", [])
                .unwrap_or_default(); // Ignorar errores, no crítico

            *conn_opt = Some(conn);
        }

        // Return a clone of the Arc
        Ok(Arc::clone(&self.conn))
    }
}

// Helper to convert JSON value to rusqlite params
fn json_to_params(params: &[serde_json::Value]) -> Vec<Box<dyn rusqlite::ToSql + Send + Sync>> {
    params
        .iter()
        .map(|v| match v {
            serde_json::Value::Null => {
                Box::new(None::<String>) as Box<dyn rusqlite::ToSql + Send + Sync>
            }
            serde_json::Value::Bool(b) => Box::new(*b) as Box<dyn rusqlite::ToSql + Send + Sync>,
            serde_json::Value::Number(n) => {
                if n.is_i64() {
                    Box::new(n.as_i64().unwrap()) as Box<dyn rusqlite::ToSql + Send + Sync>
                } else if n.is_u64() {
                    Box::new(n.as_u64().unwrap() as i64) as Box<dyn rusqlite::ToSql + Send + Sync>
                } else {
                    Box::new(n.as_f64().unwrap()) as Box<dyn rusqlite::ToSql + Send + Sync>
                }
            }
            serde_json::Value::String(s) => {
                Box::new(s.clone()) as Box<dyn rusqlite::ToSql + Send + Sync>
            }
            serde_json::Value::Array(_) | serde_json::Value::Object(_) => {
                Box::new(serde_json::to_string(v).unwrap())
                    as Box<dyn rusqlite::ToSql + Send + Sync>
            }
        })
        .collect()
}

// Helper to convert a row to JSON
fn row_to_json(row: &Row, column_names: &[String]) -> Result<serde_json::Value, rusqlite::Error> {
    let mut map = serde_json::Map::new();
    for (idx, name) in column_names.iter().enumerate() {
        let value: rusqlite::types::Value = row.get(idx)?;
        let json_value = match value {
            rusqlite::types::Value::Null => serde_json::Value::Null,
            rusqlite::types::Value::Integer(i) => serde_json::Value::Number(i.into()),
            rusqlite::types::Value::Real(f) => {
                serde_json::Value::Number(serde_json::Number::from_f64(f).unwrap_or(0.into()))
            }
            rusqlite::types::Value::Text(s) => serde_json::Value::String(s),
            rusqlite::types::Value::Blob(b) => {
                serde_json::Value::String(format!("[BLOB:{} bytes]", b.len()))
            }
        };
        map.insert(name.clone(), json_value);
    }
    Ok(serde_json::Value::Object(map))
}

#[tauri::command]
pub async fn db_get_path(app: tauri::AppHandle) -> Result<String, String> {
    let app_data_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| format!("Could not get app data directory: {}", e))?;

    Ok(app_data_dir
        .join("database.db")
        .to_string_lossy()
        .to_string())
}

#[tauri::command]
pub async fn db_exists(app: tauri::AppHandle) -> Result<bool, String> {
    let db_path = db_get_path(app).await?;
    Ok(std::path::Path::new(&db_path).exists())
}

#[tauri::command]
pub async fn db_query(
    sql: String,
    params: Vec<serde_json::Value>,
    app: tauri::AppHandle,
    state: State<'_, DatabaseState>,
) -> Result<DatabaseResult<Vec<serde_json::Value>>, String> {
    let conn_arc = state.get_connection(&app)?;
    let conn = conn_arc.lock().unwrap();
    let conn = conn
        .as_ref()
        .ok_or_else(|| "Database connection not initialized".to_string())?;

    let mut stmt = conn
        .prepare(&sql)
        .map_err(|e| format!("SQL prepare error: {}", e))?;

    // Get column names from the statement
    let column_count = stmt.column_count();
    let column_names: Vec<String> = (0..column_count)
        .map(|i| stmt.column_name(i).unwrap_or("").to_string())
        .collect();

    let param_vec = json_to_params(&params);
    let rows = stmt
        .query_map(
            rusqlite::params_from_iter(param_vec.iter().map(|p| p.as_ref())),
            |row| row_to_json(row, &column_names),
        )
        .map_err(|e| format!("SQL query error: {}", e))?;

    let mut results = Vec::new();
    for row in rows {
        results.push(row.map_err(|e| format!("Row parsing error: {}", e))?);
    }

    Ok(DatabaseResult::success(results))
}

#[tauri::command]
pub async fn db_execute(
    sql: String,
    params: Vec<serde_json::Value>,
    app: tauri::AppHandle,
    state: State<'_, DatabaseState>,
) -> Result<DatabaseResult<serde_json::Value>, String> {
    let conn_arc = state.get_connection(&app)?;
    let conn = conn_arc.lock().unwrap();
    let conn = conn
        .as_ref()
        .ok_or_else(|| "Database connection not initialized".to_string())?;

    let mut stmt = conn
        .prepare(&sql)
        .map_err(|e| format!("SQL prepare error: {}", e))?;

    let param_vec = json_to_params(&params);
    let result = stmt
        .execute(rusqlite::params_from_iter(
            param_vec.iter().map(|p| p.as_ref()),
        ))
        .map_err(|e| format!("SQL execute error: {}", e))?;

    let changes = result;
    let last_insert_rowid = conn.last_insert_rowid();

    let result_data = serde_json::json!({
        "changes": changes,
        "lastInsertRowid": last_insert_rowid
    });

    Ok(DatabaseResult::success(result_data))
}

#[tauri::command]
pub async fn db_exec(
    sql: String,
    app: tauri::AppHandle,
    state: State<'_, DatabaseState>,
) -> Result<DatabaseResult<()>, String> {
    let conn_arc = state.get_connection(&app)?;
    let conn = conn_arc.lock().unwrap();
    let conn = conn
        .as_ref()
        .ok_or_else(|| "Database connection not initialized".to_string())?;

    conn.execute_batch(&sql)
        .map_err(|e| format!("SQL exec error: {}", e))?;
    Ok(DatabaseResult::success(()))
}

#[tauri::command]
pub async fn db_transaction(
    queries: Vec<serde_json::Value>,
    app: tauri::AppHandle,
    state: State<'_, DatabaseState>,
) -> Result<DatabaseResult<Vec<serde_json::Value>>, String> {
    let conn_arc = state.get_connection(&app)?;
    let mut conn_guard = conn_arc.lock().unwrap();
    let conn = conn_guard
        .as_mut()
        .ok_or_else(|| "Database connection not initialized".to_string())?;

    let tx = conn
        .transaction()
        .map_err(|e| format!("Transaction start error: {}", e))?;

    let mut results = Vec::new();

    for query_obj in queries {
        let sql = query_obj
            .get("sql")
            .and_then(|v| v.as_str())
            .ok_or_else(|| "Missing 'sql' in query object".to_string())?
            .to_string();

        let params = query_obj
            .get("params")
            .and_then(|v| v.as_array())
            .cloned()
            .unwrap_or_default();

        let mut stmt = tx
            .prepare(&sql)
            .map_err(|e| format!("SQL prepare error: {}", e))?;

        let param_vec = json_to_params(&params);

        // Check if it's a SELECT query
        let sql_upper = sql.trim_start().to_uppercase();
        if sql_upper.starts_with("SELECT") {
            // Get column names from the statement
            let column_count = stmt.column_count();
            let column_names: Vec<String> = (0..column_count)
                .map(|i| stmt.column_name(i).unwrap_or("").to_string())
                .collect();

            let rows = stmt
                .query_map(
                    rusqlite::params_from_iter(param_vec.iter().map(|p| p.as_ref())),
                    |row| row_to_json(row, &column_names),
                )
                .map_err(|e| format!("SQL query error: {}", e))?;

            let mut query_results = Vec::new();
            for row in rows {
                query_results.push(row.map_err(|e| format!("Row parsing error: {}", e))?);
            }
            results.push(serde_json::Value::Array(query_results));
        } else {
            stmt.execute(rusqlite::params_from_iter(
                param_vec.iter().map(|p| p.as_ref()),
            ))
            .map_err(|e| format!("SQL execute error: {}", e))?;
            results.push(serde_json::Value::Null);
        }
    }

    tx.commit()
        .map_err(|e| format!("Transaction commit error: {}", e))?;

    Ok(DatabaseResult::success(results))
}
