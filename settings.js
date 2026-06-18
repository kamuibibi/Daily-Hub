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

    passcode:""

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

        alert(
            "タグ名を入力してください"
        );

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
        "変更後タグ",
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
    confirm(
        "削除しますか？"
    );

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
    ? "現在設定済み。\n"
    : "現在未設定。\n";

    const code =
    prompt(
        current +
        "新しいパスコードを入力\n（空白のままOKで解除）"
    );

    if(code === null){

        return;
    }

    settings.passcode =
    code.trim();

    saveSettings();

    alert(
        code.trim()
        ? "パスコードを設定しました"
        : "パスコードを解除しました"
    );

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
            編集
            </button>

            <button
            onclick="deleteTag(${index})">
            削除
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

        alert(
            "タグ名を入力してください"
        );

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
    confirm(
        "削除しますか？"
    );

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
        `<div class="repeat-empty">タグなし</div>`;

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
            削除
            </button>
            `;

            area.appendChild(
                row
            );

        }

    );

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
