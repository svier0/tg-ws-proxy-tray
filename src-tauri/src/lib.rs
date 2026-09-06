use simple_tauri::simple_tray;
use simple_tauri::simple_serve;

mod ipc;
mod config;
mod init;

#[cfg(windows)]
pub fn run() {
    // 互斥 只能启动一个实例
    simple_tauri::mutex!();
    // 初始化配置文件
    config::init();
    // 设置ipc函数 自动扫描设定的模块
    simple_tray::set_ipc_cmds![ipc];
    // 窗口列表 [id 标题 url 宽 高 有边框]
    simple_tray::set_window_list!(r#"[
            ["main", "设置","setting.html",null,null,false],
            ["load", "Loading","",380,280,false],
        ]"#);
    // 托盘菜单
    simple_tray::set_tray_menu!(r#"[
            ["show", "显示主界面"],
            ["toggle"],
            ["show-setting", "设置", "show_setting"],
            [],
            ["light"],
        ]"#);
    simple_tray::hooks!(init::on_tray_before, _, on_quit);
    simple_tray::run!();
}

// 点击"退出"时的回调
fn on_quit() -> Result<(), String> {
    simple_serve::stop();
    Ok(())
}

// 显示设置页面
fn show_setting() {
    simple_tray::show_window("main");
}