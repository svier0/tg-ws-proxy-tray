
use simple_tauri::simple_serve;
use simple_tauri::config;
use simple_tauri::simple_tray::ipc_result;

/// 获取本体版本号
#[tauri::command]
pub fn ipc_version() -> serde_json::Value {
    let r = env!("CARGO_PKG_VERSION");
    ipc_result!(0,"",r)
}

/// 获取服务端本号
#[tauri::command]
pub fn ipc_server_version() -> serde_json::Value {
    let r = simple_serve::get_local_ver();
    ipc_result!(0,"",r)
}

/// 获取最新版本号
#[tauri::command]
pub fn ipc_latest_ver() -> serde_json::Value {
    let r = simple_tauri::utils::get_latest_ver("github","svier0/tg-ws-proxy-tary");
    ipc_result!(0,"",r)
}

/// 获取服务端最新版本号
#[tauri::command]
pub fn ipc_server_latest_ver() -> serde_json::Value {
    ipc_result!(simple_serve::get_latest_ver())
}

/// 获取配置列表
#[tauri::command]
pub fn ipc_config() -> serde_json::Value {
    ipc_result!(0,"",config::all())
}

/// 设置单个配置 TODO:
#[tauri::command]
pub fn ipc_set_config(key: &str,val: &str) -> serde_json::Value {
    ipc_result!(config::set(key,val))
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
pub fn ipc_server_update() -> serde_json::Value {
    ipc_result!(simple_serve::check_update(config::get_bool("auto_update").expect("")))
}

/// 获取服务状态
#[tauri::command]
pub fn ipc_server_status() -> serde_json::Value {
    ipc_result!(0,"",simple_serve::is_running())
}

/// 设置服务状态
#[tauri::command]
pub fn ipc_server_action(action: &str) -> serde_json::Value {
    if action=="start" {
        let r = simple_serve::start()
            .map_err(|e| format!("服务器启动失败: {e}"));
        ipc_result!(r)
    }else{
        simple_serve::stop();
        ipc_result!(0,"")
    }
}

/// 读取服务日志 TODO:
#[tauri::command]
pub fn ipc_server_logs() {
}
