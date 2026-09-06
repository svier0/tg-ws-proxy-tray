const switchMap = [
    { id: "switch-auto-start",    key: "auto_start" },
    { id: "switch-auto-run",      key: "auto_run" },
    { id: "switch-silent-launch", key: "silent_launch" },
    { id: "switch-auto-update",   key: "auto_update" },
];

const textMap = [
    { id: "text-server-port",   key: "port"},
    { id: "text-server-secret", key: "secret"},
    { id: "text-server-domain", key: "domain"},
];

const invoke = (window.__TAURI__|| {core:{invoke:ipc=>new Promise((x,y)=>{y('请通过客户端运行')})}}).core.invoke

const pages_callback = {};

const menuItems = document.querySelectorAll(".menu-item");

const pageContents = document.querySelectorAll("main.content>section.page");

const saveConfigBtn = document.getElementById("btn-save-config");

const logsContent = document.getElementById("logs-content");

menuItems.forEach((item) => {
    item.addEventListener("click", () => {
        const page = item.dataset.page;
        if (typeof pages_callback[page] == "function") {
            pages_callback[page]();
        }
        let elpage = pageContents.getElementById(`page-${page}`);
        if (!elpage) return;

        menuItems.forEach((i) => i.classList.remove("active"));
        item.classList.add("active");

        pageContents.forEach((i) => i.hidden = i.id==`page-${page}`);
    });
});

switchMap.forEach(({ id, key }) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("change", async () => {
        try {
            await invoke("ipc_set_config", { key, val: el.checked });
        } catch (e) {
            console.error(`写入配置 ${key} 失败:`, e);
            el.checked = !el.checked;
        }
    });
});

if (saveConfigBtn) {
    saveConfigBtn.addEventListener("click", async () => {
        let configs = {};
        textMap.forEach(({ id, key }) => {
            const el = document.getElementById(id);
            if (!el) return;
            configs[key]=el.value;
        });
        try {
            await invoke("ipc_set_configs", configs);
        } catch (e) {
            console.error(`写入配置 ${key} 失败:`, e);
        }
    });
}

pages_callback["logs"] = () => {
    try {
        const logs = await invoke("ipc_server_logs");
        if (logsContent) {
            logsContent.textContent = logs || "暂无日志";
            logsContent.scrollTop = logsContent.scrollHeight;
        }
    } catch (e) {
        console.error("读取日志失败:", e);
    }
};

async function loadConfig() {
    try {
        const cfg = await invoke("ipc_config");
        switchMap.forEach(({ id, key }) => {
            const el = document.getElementById(id);
            if (el) el.checked = !!cfg[key];
        });
        textMap.forEach(({ id, key }) => {
            const el = document.getElementById(id);
            if (el) el.value = cfg[key];
        });
    } catch (e) {
        console.error("读取配置失败:", e);
    }
}

async function loadVersion() {
    try {
        const version = await invoke("ipc_version");
        const el = document.querySelector(".about-version");
        if (el) el.textContent = "v" + version;
    } catch (e) {
        console.error("读取版本失败:", e);
    }
}

async function refreshServerStatus() {
    try {
        const running = await invoke("ipc_server_status");
        if (serverSwitch) serverSwitch.checked = running;
    } catch (e) {
        console.error("读取服务状态失败:", e);
    }
}

const serverSwitch = document.getElementById("switch-server");

if (serverSwitch) {
    let serverLocked = false;
    serverSwitch.addEventListener("change", async () => {
        if (serverLocked) {
            serverSwitch.checked = !serverSwitch.checked;
            return;
        }
        serverLocked = true;
        serverSwitch.disabled = true;
        try {
            await invoke("ipc_server_action", { action: serverSwitch.checked?"start":"stop" });
        } catch (e) {
            console.error("切换代理状态失败:", e);
            refreshServerStatus();
        } finally {
            setTimeout(() => {
                serverLocked = false;
                serverSwitch.disabled = false;
            }, 1000);
        }
    });
}

loadConfig();
loadVersion();

refreshServerStatus();
setInterval(refreshServerStatus, 1000);
