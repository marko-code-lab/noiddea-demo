use bcrypt::{hash, verify, DEFAULT_COST};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

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

    pub fn error(error: String) -> Self {
        Self {
            success: false,
            data: None,
            error: Some(error),
        }
    }
}

#[tauri::command]
pub async fn auth_hash_password(
    password: String,
) -> Result<DatabaseResult<serde_json::Value>, String> {
    match hash(password, DEFAULT_COST) {
        Ok(hash) => Ok(DatabaseResult::success(serde_json::json!({ "hash": hash }))),
        Err(e) => Ok(DatabaseResult::error(format!(
            "Password hashing error: {}",
            e
        ))),
    }
}

#[tauri::command]
pub async fn auth_verify_password(
    password: String,
    hash: String,
) -> Result<DatabaseResult<serde_json::Value>, String> {
    match verify(password, &hash) {
        Ok(is_valid) => Ok(DatabaseResult::success(
            serde_json::json!({ "isValid": is_valid }),
        )),
        Err(e) => Ok(DatabaseResult::error(format!(
            "Password verification error: {}",
            e
        ))),
    }
}

#[tauri::command]
pub async fn auth_generate_token(
    _user_id: String,
    _email: String,
) -> Result<DatabaseResult<serde_json::Value>, String> {
    // Generate a simple token (in production, use JWT or similar)
    let token = format!("{}-{}", Uuid::new_v4(), chrono::Utc::now().timestamp());
    Ok(DatabaseResult::success(
        serde_json::json!({ "token": token }),
    ))
}
