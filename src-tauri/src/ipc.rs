
use simple_tauri::simple_serve;
use simple_tauri::config;

/// 获取本体版本号
#[tauri::command]
pub fn ipc_version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}

/// 获取服务端本号
#[tauri::command]
pub fn ipc_server_version() -> String {
    simple_serve::get_local_ver()
}

/// 获取最新版本号
#[tauri::command]
pub fn ipc_latest_ver() -> String {
    simple_tauri::utils::get_latest_ver("github","svier0/tg-ws-proxy-tary").to_string()
}

/// 获取服务端最新版本号
#[tauri::command]
pub fn ipc_server_latest_ver() -> String {
    simple_serve::get_latest_ver().ok().expect("REASON")
}

/// 获取配置列表 TODO:
#[tauri::command]
pub fn ipc_config() {
}

/// 设置单个配置 TODO:
#[tauri::command]
pub fn ipc_set_config() {
}

/// 批量设置配置 TODO:
#[tauri::command]
pub fn ipc_set_configs() {
}

/// 更新本体 TODO:
#[tauri::command]
pub fn ipc_update() {
}

/// 更新服务端
#[tauri::command]
pub fn ipc_server_update() {
    simple_serve::check_update(config::get_bool("auto_update").expect("REASON")).ok();
}

/// 获取服务状态
#[tauri::command]
pub fn ipc_server_status() -> String {
    if simple_serve::is_running() { "true".to_string() } else { "false".to_string() }
}

/// 设置服务状态 TODO:
#[tauri::command]
pub fn ipc_server_action() {
}

/// 读取服务日志 TODO:
#[tauri::command]
pub fn ipc_server_logs() {
}
