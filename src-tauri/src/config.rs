
use simple_tauri::config;
pub use simple_tauri::config::get_or;

/// 默认配置（JSONC）
const DEFAULT: &str = r#"
{
	// 开机自启
    "auto_start": false,
    // 自动运行
    "auto_run": false,
    // 静默启动
    "silent_launch": false,
    // 自动更新
    "auto_update": false,
    // 端口
    "port": 1443,
    // 密钥
    "secret": "",
    // workers域名
    "domain": "",
}
"#;

const PATH: &str = "data/config.json";

/// 初始化配置文件
pub fn init(){
	config::set_default(DEFAULT);
	config::load(PATH).expect("");
    if config::get_or!("secret",String::new()).is_empty() {
        let secret = simple_tauri::utils::rand::nano(32);
        let _ = config::set("secret",secret);
    }
}