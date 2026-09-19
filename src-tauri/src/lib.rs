use simple_tauri::simple_tray;
use simple_tauri::simple_serve;

mod ipc;
mod config;
mod init;

#[cfg(windows)]
pub fn run() {
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