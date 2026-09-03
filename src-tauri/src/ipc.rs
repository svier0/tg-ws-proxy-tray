
/// 获取本体版本号
#[tauri::command]
pub fn ipc_version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}

/// 获取服务端本号
#[tauri::command]
pub fn ipc_server_version() -> String {
    "0.1.0-rc.6".to_string()
}

/// 获取最新版本号
#[tauri::command]
pub fn ipc_latest_ver() -> String {
    simple_tauri::utils::get_gh_latest_ver("@deepseek-ai/dsh").to_string()
}

/// 获取服务端最新版本号
#[tauri::command]
pub fn ipc_server_latest_ver() -> String {
    simple_tauri::utils::get_gh_latest_ver("@deepseek-ai/dsh").to_string()
}

/// 获取配置列表
#[tauri::command]
pub fn ipc_config() {
}

/// 设置单个配置
#[tauri::command]
pub fn ipc_set_config() {
}

/// 批量设置配置
#[tauri::command]
pub fn ipc_set_configs() {
}

/// 更新本体
#[tauri::command]
pub fn ipc_update() {
}

/// 更新服务端
#[tauri::command]
pub fn ipc_server_update() {
}

/// 获取服务状态
#[tauri::command]
pub fn ipc_server_status() {
}

/// 设置服务状态
#[tauri::command]
pub fn ipc_server_action() {
}

/// 读取服务日志
#[tauri::command]
pub fn ipc_server_logs() {
}
