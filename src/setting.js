const invoke = async(name,param) => {
    const notauri = {core:{invoke:ipc=>new Promise((x,y)=>{y('请通过客户端运行')})}};
    const invoke = (window.__TAURI__|| notauri).core.invoke;
    try{
        return await invoke(`ipc_${name}`, param);
    }catch(e){
        return {code:1,msg:e};
    }
};

const pages_callback = {};

const menuItems = document.querySelectorAll(".menu-item");

const pageContents = document.querySelectorAll("main.content>section.page");

const saveConfigBtn = document.getElementById("btn-save-config");

const logsContent = document.getElementById("logs-content");

const switchMap = [...document.querySelectorAll(".config-switch[data-key]")].map(el => ({
    key: el.dataset.key,
    el,
}));

const textMap = [...document.querySelectorAll(".config-text[data-key]")].map(el => ({
    key: el.dataset.key,
    el,
}));

menuItems.forEach((item) => {
    item.addEventListener("click", () => {
        const page = item.dataset.page;
        if (typeof pages_callback[page] == "function") {
            pages_callback[page]();
        }
        let elpage = document.getElementById(`page-${page}`);
        if (!elpage) return;

        menuItems.forEach((i) => i.classList.remove("active"));
        item.classList.add("active");

        pageContents.forEach((i) => i.hidden = i.id!=`page-${page}`);
    });
});

switchMap.forEach(({ key, el }) => {
    el.addEventListener("change", async () => {
        let r = await invoke("set_config", { key, val: el.checked });
        if (r.code>0) {
            console.error(`写入配置 ${key} 失败:`, r.msg);
            el.checked = !el.checked;
        }
    });
});

if (saveConfigBtn) {
    saveConfigBtn.addEventListener("click", async () => {
        let configs = {};
        textMap.forEach(({ key, el }) => {
            configs[key]=el.value;
        });
        let r = await invoke("set_configs", configs);
        if (r.code>0) {
            console.error("写入配置失败:", r.msg);
        }
    });
}

pages_callback["logs"] = async () => {
    let r = await invoke("server_logs");
    if (r.code>0) {
        console.error("读取日志失败:", r.msg);
        return;
    }
    const logs = r.data;
    if (logsContent) {
        logsContent.textContent = logs || "暂无日志";
        logsContent.scrollTop = logsContent.scrollHeight;
    }
};

async function loadConfig() {
    let r = await invoke("config");
    if (r.code>0) {
        console.error("读取配置失败:", r.msg);
        return;
    }
    const cfg = r.data;
    switchMap.forEach(({ key, el }) => {
        if (el) el.checked = !!cfg[key];
    });
    textMap.forEach(({ key, el }) => {
        if (el) el.value = cfg[key];
    });
}

async function loadVersion() {
    let r = await invoke("version");
    if (r.cdoe>0) {
        console.error("读取版本失败:", r.msg);
        return;
    }
    const version = r.data;
    const el = document.querySelector(".about-version");
    if (el) el.textContent = "v" + version;
}

async function refreshServerStatus() {
    let r = await invoke("server_status");
    if (r.code>0) {
        console.error("读取服务状态失败:", r.msg);
        return;
    }
    const running = r.data;
    if (serverSwitch) serverSwitch.checked = running;
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
        let r = await invoke("server_action", { action: serverSwitch.checked?"start":"stop" });
        if (r.code>0) {
            console.error("切换代理状态失败:", r.msg);
            refreshServerStatus();
        }
        setTimeout(() => {
            serverLocked = false;
            serverSwitch.disabled = false;
        }, 1000);
    });
}

loadConfig();
loadVersion();

refreshServerStatus();
setInterval(refreshServerStatus, 1000);
