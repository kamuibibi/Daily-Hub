/* =====================
   Daily Hub Pro v4.0
   Settings
===================== */

const SETTINGS_KEY =
"dailyhub_settings";

let settings = {

    tags:[
        "【AI】",
        "【仕事】",
        "【勉強】",
        "【買い物】"
    ],

    taskTags:[
        "【買い物タスク化】"
    ],

    theme:"dark",

    passcode:"",

    taskCompleteAction:"strikethrough",

    lang:"ja"

};

/* =====================
   読込
===================== */

function loadSettings(){

    const raw =
    localStorage.getItem(
        SETTINGS_KEY
    );

    if(!raw){

        return;
    }

    try{

        settings =
        JSON.parse(raw);

        if(!settings.taskTags){

            settings.taskTags = [];

        }

        if(!settings.tags){

            settings.tags = [];

        }

        if(!settings.taskCompleteAction){

            settings.taskCompleteAction =
            "strikethrough";

        }

        if(!settings.lang){

            settings.lang = "ja";

        }

    }

    catch{

        console.error(
            "settings load error"
        );

    }

}

/* =====================
   保存
===================== */

function saveSettings(){

    localStorage.setItem(

        SETTINGS_KEY,

        JSON.stringify(
            settings
        )

    );

}

/* =====================
   タグ追加
===================== */

function addTag(){

    const input =
    document.getElementById(
        "newTagInput"
    );

    const tag =
    input.value.trim();

    if(!tag){

        alert(t("alert.enter_tag"));

        return;

    }

    settings.tags.push(
        tag
    );

    saveSettings();

    renderTagList();

    renderMemoTags();

    input.value = "";

}

/* =====================
   タグ編集
===================== */

function editTag(index){

    const current =
    settings.tags[index];

    const newTag =
    prompt(
        t("prompt.edit_tag"),
        current
    );

    if(!newTag){

        return;
    }

    settings.tags[index] =
    newTag;

    saveSettings();

    renderMemoTags();

    renderTagList();

}

/* =====================
   タグ削除
===================== */

function deleteTag(index){

    const ok =
    confirm(t("confirm.delete"));

    if(!ok){

        return;
    }

    settings.tags.splice(
        index,
        1
    );

    saveSettings();

    renderMemoTags();

    renderTagList();

}

/* =====================
   ライトモード
===================== */

function setLightMode(){

    document.body.classList.add(
        "light-mode"
    );

    settings.theme =
    "light";

    saveSettings();

}

/* =====================
   ダークモード
===================== */

function setDarkMode(){

    document.body.classList.remove(
        "light-mode"
    );

    settings.theme =
    "dark";

    saveSettings();

}

/* =====================
   テーマ適用
===================== */

function applyTheme(){

    if(
        settings.theme
        ===
        "light"
    ){

        document.body.classList.add(
            "light-mode"
        );

    }
    else{

        document.body.classList.remove(
            "light-mode"
        );

    }

}

/* =====================
   パスコード
===================== */

function passcodeSetting(){

    const current =
    settings.passcode
    ? t("prompt.passcode_set_prefix")
    : t("prompt.passcode_notset_prefix");

    const code =
    prompt(
        current +
        t("prompt.passcode_set")
    );

    if(code === null){

        return;
    }

    settings.passcode =
    code.trim();

    saveSettings();

    alert(
        code.trim()
        ? t("alert.passcode_set")
        : t("alert.passcode_removed")
    );

}

/* =====================
   タスク完了動作
===================== */

function setTaskCompleteAction(action){

    settings.taskCompleteAction =
    action;

    saveSettings();

    renderTaskCompleteActionSetting();

}

function renderTaskCompleteActionSetting(){

    const strikeBtn =
    document.getElementById(
        "actionStrikeBtn"
    );

    const deleteBtn =
    document.getElementById(
        "actionDeleteBtn"
    );

    if(!strikeBtn || !deleteBtn){

        return;
    }

    const action =
    settings.taskCompleteAction ||
    "strikethrough";

    const isLight =
    settings.theme === "light";

    const inactiveColor =
    isLight ? "#cccccc" : "#555";

    strikeBtn.style.background =
    action === "strikethrough"
    ? "#007aff"
    : inactiveColor;

    deleteBtn.style.background =
    action === "auto-delete"
    ? "#007aff"
    : inactiveColor;

    strikeBtn.style.color =
    action === "strikethrough"
    ? "#fff"
    : (isLight ? "#111" : "#fff");

    deleteBtn.style.color =
    action === "auto-delete"
    ? "#fff"
    : (isLight ? "#111" : "#fff");

}

/* =====================
   後方互換スタブ
===================== */

function taskTagSetting(){

    showSettingsPage();

}

/* =====================
   タグ一覧描画
===================== */

function renderTagList(){

    const area =
    document.getElementById(
        "tagListArea"
    );

    if(!area){

        return;
    }

    area.innerHTML = "";

    settings.tags.forEach(

        (tag,index)=>{

            const row =
            document.createElement(
                "div"
            );

            row.className =
            "tag-row";

            row.innerHTML =
            `
            <span>
            ${escapeHtml(tag)}
            </span>

            <div>

            <button
            onclick="editTag(${index})">
            ${escapeHtml(t("tag.edit_btn"))}
            </button>

            <button
            onclick="deleteTag(${index})">
            ${escapeHtml(t("tag.delete_btn"))}
            </button>

            </div>
            `;

            area.appendChild(
                row
            );

        }

    );

}

/* =====================
   タスク化タグ追加
===================== */

function addTaskTag(){

    const input =
    document.getElementById(
        "newTaskTagInput"
    );

    const tag =
    input.value.trim();

    if(!tag){

        alert(t("alert.enter_tag"));

        return;

    }

    if(!settings.taskTags){

        settings.taskTags = [];

    }

    settings.taskTags.push(
        tag
    );

    saveSettings();

    renderTaskTagList();

    input.value = "";

}

/* =====================
   タスク化タグ削除
===================== */

function deleteTaskTag(index){

    const ok =
    confirm(t("confirm.delete"));

    if(!ok){

        return;
    }

    settings.taskTags.splice(
        index,
        1
    );

    saveSettings();

    renderTaskTagList();

}

/* =====================
   タスク化タグ一覧描画
===================== */

function renderTaskTagList(){

    const area =
    document.getElementById(
        "taskTagListArea"
    );

    if(!area){

        return;
    }

    area.innerHTML = "";

    if(
        !settings.taskTags ||
        !settings.taskTags.length
    ){

        area.innerHTML =
        `<div class="repeat-empty">${escapeHtml(t("tag.no_tags"))}</div>`;

        return;

    }

    settings.taskTags.forEach(

        (tag,index)=>{

            const row =
            document.createElement(
                "div"
            );

            row.className =
            "tag-row";

            row.innerHTML =
            `
            <span>
            ${escapeHtml(tag)}
            </span>

            <button
            onclick="deleteTaskTag(${index})">
            ${escapeHtml(t("tag.delete_btn"))}
            </button>
            `;

            area.appendChild(
                row
            );

        }

    );

}

/* =====================
   キャッシュ強制クリア
===================== */

async function forceClearAndReload(){

    const ok =
    confirm(t("confirm.clear_cache"));

    if(!ok){ return; }

    try{

        if("serviceWorker" in navigator){

            const regs =
            await navigator.serviceWorker
            .getRegistrations();

            for(const reg of regs){

                await reg.unregister();

            }

        }

        const keys =
        await caches.keys();

        for(const key of keys){

            await caches.delete(key);

        }

    }
    catch(e){}

    location.reload(true);

}

/* =====================
   起動
===================== */

window.addEventListener(

    "load",

    ()=>{

        loadSettings();

        applyTheme();

        renderTagList();

        renderTaskTagList();

    }

);
