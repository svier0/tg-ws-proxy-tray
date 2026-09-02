const invoke = (window.__TAURI__|| {core:{invoke:ipc=>new Promise((x,y)=>{y('请通过客户端运行')})}}).core.invoke

const pages = {
    general: "page-general",
    logs: "page-logs",
    about: "page-about",
};
const pages_callback = {};

const switchMap = [
    { id: "switch-autostart", key: "AUTOSTART" },
    { id: "switch-auto-run", key: "AUTO_RUN" },
    { id: "switch-silent-launch", key: "SILENT_LAUNCH" },
    { id: "switch-autoupdate", key: "AUTOUPDATE" },
];

const textMap = [
    { id: "text-server-port", key: "SERVER_PORT"},
    { id: "text-server-secret", key: "SERVER_SECRET"},
    { id: "text-server-domain", key: "SERVER_DOMAIN"},
];

const menuItems = document.querySelectorAll(".menu-item");

const saveConfigBtn = document.getElementById("btn-save-config");

const logsContent = document.getElementById("logs-content");

menuItems.forEach((item) => {
    item.addEventListener("click", () => {
        const page = item.dataset.page;
        if (!pages[page]) return;

        menuItems.forEach((i) => i.classList.remove("active"));
        item.classList.add("active");

        Object.entries(pages).forEach(([key, id]) => {
            document.getElementById(id).hidden = key !== page;
        });
        if (typeof pages_callback[page] == "function") {
            pages_callback[page]();
        }
    });
});

switchMap.forEach(({ id, key }) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("change", async () => {
        try {
            await invoke("ipc_set_config", { key, value: el.checked });
        } catch (e) {
            console.error(`写入配置 ${key} 失败:`, e);
            el.checked = !el.checked;
        }
    });
});

if (saveConfigBtn) {
    saveConfigBtn.addEventListener("click", async () => {
        textMap.forEach(({ id, key }) => {
            const el = document.getElementById(id);
            if (!el) return;
            try {
                await invoke("ipc_set_config", { key, value: el.value });
            } catch (e) {
                console.error(`写入配置 ${key} 失败:`, e);
            }
        });
    });
}

pages_callback["logs"] = () => {
    refreshLogs();
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
            if (el) el.value = !!cfg[key];
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
        console.error("读取代理状态失败:", e);
    }
}

async function refreshLogs() {
    try {
        const logs = await invoke("ipc_server_logs");
        if (logsContent) {
            logsContent.textContent = logs || "暂无日志";
            logsContent.scrollTop = logsContent.scrollHeight;
        }
    } catch (e) {
        console.error("读取日志失败:", e);
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
            await invoke("ipc_server_action", { running: serverSwitch.checked });
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
