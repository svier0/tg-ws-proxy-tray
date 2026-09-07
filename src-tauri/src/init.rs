use simple_tauri::simple_tray;
use simple_tauri::simple_serve;
use simple_tauri::utils::sh2rs::sh2rs;
// use simple_tauri::utils::sh2rs::try_quote;
use super::config;

fn show_load_tips(s: &str){
    let silent_launch = config::get_or!("silent_launch",false);
    if silent_launch { return; }
    simple_tray::runjs("load", &format!("document.querySelector('p.tips').innerHTML='{}'",s));
}

// 托盘创建前回调
pub(super) fn on_tray_before() -> Result<(), String> {
    // 设置参数
    let auto_run      = config::get_or!("auto_run",false);
    let silent_launch = config::get_or!("silent_launch",false);
    let auto_update   = config::get_or!("auto_update",false);
    let port          = config::get_or!("port",1443);
    let secret        = config::get_or!("secret","");
    let domain        = config::get_or!("domain","");
    // Telegram proxy link (use this on all devices):
    // let setproxyurl = format!("tg://proxy?...");

    // 包类型/包名 用于检测服务版本号
    simple_serve::set_pkg("github","valnesfjord/tg-ws-proxy-rs");
    // 启动服务时执行的命令
    simple_serve::set_start_cmd!("./tg-ws-proxy --port {port} --secret {secret} --cf-worker-domain {domain}");
    // 服务端的下载地址 加压提取目录
    simple_serve::set_download_url(
        |ver|format!("https://github.com/valnesfjord/tg-ws-proxy-rs/releases/download/v{}/{}"
            ,ver
            ,"tg-ws-proxy-x86_64-pc-windows-gnu.zip"),
        "");
    if auto_update { simple_serve::enable_auto_update(); }

    if !silent_launch {
        // 显示加载窗口
        simple_tray::show_window("load");
        sh2rs!("sleep 1").ok();
    }

    // 检查版本更新
    show_load_tips("检测本地服务版本");
    let _ = simple_serve::check_update(auto_update)?;

    if auto_run {
        // 启动服务
        show_load_tips("服务启动中 ...");
        simple_serve::start()
            .map_err(|e| format!("服务器启动失败: {e}"))?;
        show_load_tips("服务启动中 20%");
        sh2rs!("sleep 1").ok();
        show_load_tips("服务启动中 40%");
        sh2rs!("sleep 1").ok();
        show_load_tips("服务启动中 60%");
        sh2rs!("sleep 1").ok();
        show_load_tips("服务启动中 80%");
        sh2rs!("sleep 1").ok();
        show_load_tips("服务启动中 100%");
        sh2rs!("sleep 1").ok();
    }

    if !silent_launch {
        // 关闭加载窗口
        simple_tray::close_window("load");
        // 显示主窗口
        simple_tray::show_window("main");
    }
    Ok(())
}