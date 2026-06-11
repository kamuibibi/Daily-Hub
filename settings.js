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

    if(
        typeof renderMemoTags
        ===
        "function"
    ){

        renderMemoTags();

    }

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

    if(
        typeof renderMemoTags
        ===
        "function"
    ){

        renderMemoTags();

    }

    alert(
        "削除しました"
    );

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

        alert(
            "タグが見つかりません"
        );

        return;
    }

    settings.tags[index] =
    newTag;

    saveSettings();

    if(
        typeof renderMemoTags
        ===
        "function"
    ){

        renderMemoTags();

    }

    alert(
        "変更しました"
    );

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

    const code =
    prompt(
        "4桁以上のパスコード"
    );

    if(!code){

        return;
    }

    settings.passcode =
    code;

    saveSettings();

    alert(
        "保存しました"
    );

}

/* =====================
   タスク化タグ設定
===================== */

function taskTagSetting(){

    alert(
        "次回実装予定"
    );

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
            "list-card";

            row.innerHTML =
            `
            <div style="
            display:flex;
            justify-content:space-between;
            align-items:center;
            ">

                <span>
                ${tag}
                </span>

                <div>

                    <button
                    onclick="editTagByIndex(${index})">
                    編集
                    </button>

                    <button
                    onclick="deleteTagByIndex(${index})">
                    削除
                    </button>

                </div>

            </div>
            `;

            area.appendChild(
                row
            );

        }

    );

}

/* =====================
   タグ編集
===================== */

function editTagByIndex(
    index
){

    const newTag =
    prompt(
        "新しいタグ名",
        settings.tags[index]
    );

    if(!newTag){

        return;
    }

    settings.tags[index] =
    newTag;

    saveSettings();

    renderTagList();

    renderMemoTags();

}

/* =====================
   タグ削除
===================== */

function deleteTagByIndex(
    index
){

    const ok =
    confirm(
        settings.tags[index]
        +
        " を削除しますか？"
    );

    if(!ok){

        return;
    }

    settings.tags.splice(
        index,
        1
    );

    saveSettings();

    renderTagList();

    renderMemoTags();

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

    }

);
