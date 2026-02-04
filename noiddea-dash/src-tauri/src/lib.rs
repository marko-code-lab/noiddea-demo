mod auth;
mod db;
#[derive(Clone, serde::Serialize)]
struct Payload {
    args: Vec<String>,
    cwd: String,
}

use tauri::{Manager, Emitter};
use db::{DatabaseState, db_get_path, db_exists, db_query, db_execute, db_exec, db_transaction};
use auth::{auth_hash_password, auth_verify_password, auth_generate_token};


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_single_instance::init(|app, argv, cwd| {
            println!("{}, {argv:?}, {cwd}", app.package_info().name);
            app.emit("single-instance", Payload { args: argv, cwd }).unwrap();
        }))
        .setup(|app| {
            // Initialize database state
            app.manage(DatabaseState::new());

            // Path functionality is built into Tauri v2, no plugin needed

            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            // Database commands
            db_get_path,
            db_exists,
            db_query,
            db_execute,
            db_exec,
            db_transaction,
            // Auth commands
            auth_hash_password,
            auth_verify_password,
            auth_generate_token,
            // App commands
            app_get_version,
            app_get_path,
            app_restart,
            // Platform command
            platform_get,
            // Window commands
            window_minimize,
            window_maximize,
            window_close,
            window_is_maximized,
            // Script commands
            script_reset_database,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
async fn app_get_version() -> Result<String, String> {
    Ok(env!("CARGO_PKG_VERSION").to_string())
}

#[tauri::command]
async fn app_get_path(name: String, app: tauri::AppHandle) -> Result<String, String> {
    let path = match name.as_str() {
        "appData" => app.path().app_data_dir(),
        "appConfig" => app.path().app_config_dir(),
        "appCache" => app.path().app_cache_dir(),
        "appLog" => app.path().app_log_dir(),
        "desktop" => app.path().desktop_dir(),
        "documents" => app.path().document_dir(),
        "downloads" => app.path().download_dir(),
        "home" => app.path().home_dir(),
        "music" => app.path().audio_dir(),
        "pictures" => app.path().picture_dir(),
        "public" => app.path().public_dir(),
        "temp" => app.path().temp_dir(),
        "videos" => app.path().video_dir(),
        _ => return Err(format!("Unknown path name: {}", name)),
    };

    Ok(path
        .map_err(|e| format!("Could not get path {}: {}", name, e))?
        .to_string_lossy()
        .to_string())
}

#[tauri::command]
async fn platform_get() -> Result<String, String> {
    Ok(std::env::consts::OS.to_string())
}

#[tauri::command]
async fn app_restart(app: tauri::AppHandle) -> Result<(), String> {
    use std::process::Command;
    use std::thread;
    use std::time::Duration;

    // Get the current executable path
    let exe_path =
        std::env::current_exe().map_err(|e| format!("Could not get executable path: {}", e))?;

    // Spawn a new instance of the application
    Command::new(&exe_path)
        .spawn()
        .map_err(|e| format!("Failed to restart application: {}", e))?;

    // Give the new process a moment to start, then exit
    thread::sleep(Duration::from_millis(500));

    // Exit the current application
    app.exit(0);

    Ok(())
}

#[tauri::command]
async fn window_minimize(window: tauri::Window) -> Result<(), String> {
    window.minimize().map_err(|e| e.to_string())
}

#[tauri::command]
async fn window_maximize(window: tauri::Window) -> Result<(), String> {
    window.maximize().map_err(|e| e.to_string())
}

#[tauri::command]
async fn window_close(window: tauri::Window) -> Result<(), String> {
    window.close().map_err(|e| e.to_string())
}

#[tauri::command]
async fn window_is_maximized(window: tauri::Window) -> Result<bool, String> {
    window.is_maximized().map_err(|e| e.to_string())
}

#[tauri::command]
async fn script_reset_database(app: tauri::AppHandle) -> Result<String, String> {
    use std::path::PathBuf;
    use std::process::Command;

    // Get the app's executable directory and navigate to project root
    let exe_path =
        std::env::current_exe().map_err(|e| format!("Could not get executable path: {}", e))?;

    // In development, the executable is in src-tauri/target/debug or src-tauri/target/release
    // We need to go up to the project root
    let project_root = if cfg!(debug_assertions) {
        // Development: go from src-tauri/target/debug/app to project root
        // Need to go up 4 levels: app -> debug/release -> target -> src-tauri -> project root
        exe_path
            .parent()
            .and_then(|p| p.parent()) // debug or release
            .and_then(|p| p.parent()) // target
            .and_then(|p| p.parent()) // src-tauri
            .map(|p| p.to_path_buf())
            .unwrap_or_else(|| PathBuf::from("."))
    } else {
        // Production: try to get resource dir or use executable dir
        app.path()
            .resource_dir()
            .map(|p| p.parent().unwrap_or(&p).to_path_buf())
            .unwrap_or_else(|_| {
                exe_path
                    .parent()
                    .map(|p| p.to_path_buf())
                    .unwrap_or_else(|| PathBuf::from("."))
            })
    };

    let script_path = project_root
        .join("src")
        .join("scripts")
        .join("reset-db.cjs");

    // Verify script exists
    if !script_path.exists() {
        return Err(format!("Script not found at: {}", script_path.display()));
    }

    // Try to find node in PATH
    let node_command = if cfg!(target_os = "windows") {
        "node.exe"
    } else {
        "node"
    };

    // Execute the script
    let output = Command::new(node_command)
        .arg(script_path.to_string_lossy().as_ref())
        .current_dir(&project_root)
        .output()
        .map_err(|e| {
            format!(
                "Failed to execute script: {}. Make sure Node.js is installed and in PATH.",
                e
            )
        })?;

    if output.status.success() {
        let stdout = String::from_utf8_lossy(&output.stdout);
        Ok(stdout.to_string())
    } else {
        let stderr = String::from_utf8_lossy(&output.stderr);
        Err(format!("Script execution failed: {}", stderr))
    }
}
