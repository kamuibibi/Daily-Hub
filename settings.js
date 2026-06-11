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

    const tag =
    prompt(
        "タグ名を入力"
    );

    if(!tag){

        return;
    }

    settings.tags.push(
        tag
    );

    saveSettings();

    renderMemoTags();

    alert(
        "追加しました"
    );

}

/* =====================
   タグ削除
===================== */

function deleteTag(){

    const tag =
    prompt(
        "削除するタグ名"
    );

    if(!tag){

        return;
    }

    settings.tags =
    settings.tags.filter(

        t =>
        t !== tag

    );

    saveSettings();

    renderMemoTags();

}

/* =====================
   タグ編集
===================== */

function editTag(){

    const oldTag =
    prompt(
        "変更前タグ"
    );

    if(!oldTag){

        return;
    }

    const newTag =
    prompt(
        "変更後タグ"
    );

    if(!newTag){

        return;
    }

    const index =
    settings.tags.indexOf(
        oldTag
    );

    if(index === -1){

        return;
    }

    settings.tags[index] =
    newTag;

    saveSettings();

    renderMemoTags();

}

/* =====================
   ライト
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
   ダーク
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

        document.body
        .classList
        .add(
            "light-mode"
        );

    }

}

/* =====================
   パスコード
===================== */

function passcodeSetting(){

    const code =
    prompt(
        "4桁以上"
    );

    if(!code){

        return;
    }

    settings.passcode =
    code;

    saveSettings();

}

/* =====================
   起動
===================== */

window.addEventListener(

    "load",

    ()=>{

        loadSettings();

        applyTheme();

    }

);