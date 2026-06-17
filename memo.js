/* =====================
    Daily Hub Pro v3.0
    Memo
===================== */

/* =====================
   メモ保存
===================== */

function saveMemo(){

    if(!selectedDate){

        alert(
            "日付を選択してください"
        );

        return;
    }

    ensureDateData();

    const key =
    getDateKey();

    const memoText =
    document
    .getElementById(
        "memoInput"
    )
    .value;

    appData[key].memo =
    memoText;

    syncMemoTasks(key);

    saveAll();

    renderTaskArea();

    refreshCalendar();

    updateStats();

}

/* =====================
   タスク化メモ同期
===================== */

function syncMemoTasks(key){

    if(!key || !appData[key]){

        return;
    }

    const taskTags =
    (
        typeof settings !== "undefined" &&
        settings.taskTags
    )
    ? settings.taskTags
    : [];

    const memo =
    appData[key].memo || "";

    const lines =
    memo.split("\n");

    const newTaskTexts = [];

    if(taskTags.length){

        lines.forEach(line=>{

            const trimmed =
            line.trim();

            if(!trimmed){

                return;
            }

            const matchedTag =
            taskTags.find(
                tag => trimmed.includes(tag)
            );

            if(!matchedTag){

                return;
            }

            const taskText =
            trimmed
            .replace(matchedTag, "")
            .trim();

            if(taskText){

                newTaskTexts.push(taskText);

            }

        });

    }

    const existingMemoTasks = {};

    appData[key].tasks
    .filter(t => t.fromMemo)
    .forEach(t => {

        existingMemoTasks[t.text] = t;

    });

    appData[key].tasks =
    appData[key].tasks.filter(
        t => !t.fromMemo
    );

    newTaskTexts.forEach(text=>{

        if(existingMemoTasks[text]){

            appData[key].tasks.push(
                existingMemoTasks[text]
            );

        }
        else{

            appData[key].tasks.push({

                id:
                Date.now() +
                appData[key].tasks.length,

                text:text,

                completed:false,

                reminder:null,

                repeat:null,

                repeatId:null,

                fromMemo:true

            });

        }

    });

}

/* =====================
   タグ挿入
===================== */

function insertMemoTag(){

    const select =
    document.getElementById(
        "memoTag"
    );

    const value =
    select.value;

    if(!value){

        return;
    }

    const memo =
    document.getElementById(
        "memoInput"
    );

    memo.value +=
    value + "\n";

    saveMemo();

    select.value = "";

}

/* =====================
   自動保存
===================== */

function setupMemoAutoSave(){

    const memo =
    document.getElementById(
        "memoInput"
    );

    if(!memo){

        return;
    }

    memo.addEventListener(

        "input",

        ()=>{

            if(
                !selectedDate
            ){

                return;
            }

            saveMemo();

        }

    );

}

/* =====================
   メモ一覧
===================== */

function showMemoList(){

    const activeElement =
    document.activeElement;

    if(
        activeElement &&
        typeof activeElement.blur === "function" &&
        (
            activeElement.tagName === "TEXTAREA" ||
            activeElement.tagName === "INPUT" ||
            activeElement.tagName === "SELECT" ||
            activeElement.isContentEditable
        )
    ){

        activeElement.blur();

    }

    showPage(
        "memoPage"
    );

    renderMemoList();

    window.scrollTo(0, 0);

    requestAnimationFrame(()=>{

        window.scrollTo(0, 0);

        requestAnimationFrame(()=>{

            window.scrollTo(0, 0);

        });

    });

}

/* =====================
   メモプレビュー
===================== */

function isMemoPreviewNeeded(text){

    return (
        text.length > 80 ||
        text.split("\n").length > 3
    );

}

function getMemoPreviewText(text){

    const lines =
    text.split("\n");

    const preview =
    lines.slice(0, 3).join("\n");

    if(preview.length > 80){

        return preview.slice(0, 80) + "...";

    }

    return preview + "...";

}

/* =====================
   メモ一覧描画
===================== */

function renderMemoList(){

    const area =
    document.getElementById(
        "memoListArea"
    );

    area.innerHTML = "";

    const keys =
    getSortedKeys();

    let memoCount = 0;

    keys.forEach(key=>{

        const data =
        appData[key];

        if(
            !data.memo ||
            !data.memo.trim()
        ){

            return;
        }

        memoCount++;

        const memoText =
        data.memo.trim();

        const isLongMemo =
        isMemoPreviewNeeded(
            memoText
        );

        const previewText =
        isLongMemo
        ? getMemoPreviewText(
            memoText
        )
        : memoText;

        const card =
        document.createElement(
            "div"
        );

        card.className =
        "list-card";

        card.innerHTML =
        `
        <div class="small-date">
        ${key}
        </div>

        <div class="memo-preview">
        ${escapeHtml(
            previewText
        ).replaceAll(
            "\n",
            "<br>"
        )}
        </div>

        ${isLongMemo ? `
        <button
        type="button"
        class="memo-toggle-btn"
        data-date="${key}"
        data-expanded="false"
        onclick="toggleMemoPreview(this)">
        続きを読む
        </button>
        ` : ""}
        `;

        area.appendChild(
            card
        );

    });

    if(
        memoCount === 0
    ){

        area.innerHTML =
        `
        <div class="list-card">
        メモはありません
        </div>
        `;

    }

}

/* =====================
   メモ全文表示切替
===================== */

function toggleMemoPreview(button){

    const dateKey =
    button.dataset.date;

    const data =
    appData[dateKey];

    if(
        !data ||
        !data.memo
    ){

        return;
    }

    const preview =
    button.parentElement.querySelector(
        ".memo-preview"
    );

    if(!preview){

        return;
    }

    const memoText =
    data.memo.trim();

    const isExpanded =
    button.dataset.expanded === "true";

    const nextText =
    isExpanded
    ? getMemoPreviewText(
        memoText
    )
    : memoText;

    preview.innerHTML =
    escapeHtml(
        nextText
    ).replaceAll(
        "\n",
        "<br>"
    );

    button.dataset.expanded =
    isExpanded ? "false" : "true";

    button.textContent =
    isExpanded ? "続きを読む" : "閉じる";

}

/* =====================
   HTMLエスケープ
===================== */

function escapeHtml(text){

    if(!text){

        return "";
    }

    return text

    .replaceAll(
        "&",
        "&amp;"
    )

    .replaceAll(
        "<",
        "&lt;"
    )

    .replaceAll(
        ">",
        "&gt;"
    )

    .replaceAll(
        '"',
        "&quot;"
    )

    .replaceAll(
        "'",
        "&#039;"
    );

}

/* =====================
   メモ件数
===================== */

function getMemoTotal(){

    let total = 0;

    Object.values(
        appData
    ).forEach(item=>{

        if(

            item.memo &&
            item.memo.trim()

        ){

            total++;

        }

    });

    return total;

}

/* =====================
   検索用
===================== */

function searchMemo(keyword){

    const result = [];

    const keys =
    getSortedKeys();

    keys.forEach(key=>{

        const memo =
        appData[key].memo || "";

        if(

            memo
            .toLowerCase()
            .includes(
                keyword
                .toLowerCase()
            )

        ){

            result.push({

                date:key,

                text:memo

            });

        }

    });

    return result;

}

/* =====================
   初期化
===================== */

window.addEventListener(

    "load",

    ()=>{

        renderMemoTags();

        const tag =
        document.getElementById(
            "memoTag"
        );

        if(tag){

            tag.addEventListener(

                "change",

                insertMemoTag

            );

        }

        setupMemoAutoSave();

    }

);



/* =====================
   タグ描画
===================== */

function renderMemoTags(){

    const select =
    document.getElementById(
        "memoTag"
    );

    if(!select){

        return;
    }

    if(
        typeof settings ===
        "undefined"
    ){

        return;
    }

    select.innerHTML = "";

    const first =
    document.createElement(
        "option"
    );

    first.value = "";

    first.textContent =
    "タグ選択";

    select.appendChild(
        first
    );

    settings.tags.forEach(tag=>{

        const option =
        document.createElement(
            "option"
        );

        option.value =
        tag;

        option.textContent =
        tag;

        select.appendChild(
            option
        );

    });

}