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

    saveAll();

    refreshCalendar();

    updateStats();

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
            activeElement.tagName === "SELECT"
        )
    ){

        activeElement.blur();

    }

    showPage(
        "memoPage"
    );

    renderMemoList();

    window.scrollTo(
        0,
        0
    );

    requestAnimationFrame(()=>{

        window.scrollTo(
            0,
            0
        );

        requestAnimationFrame(()=>{

            window.scrollTo(
                0,
                0
            );

        });

    });

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

    if(
        keys.length === 0
    ){

        area.innerHTML =
        `
        <div class="list-card">
        メモはありません
        </div>
        `;

        return;
    }

    keys.forEach(key=>{

        const data =
        appData[key];

        if(
            !data.memo ||
            !data.memo.trim()
        ){

            return;
        }

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

        <div>
        ${escapeHtml(
            data.memo
        ).replaceAll(
            "\n",
            "<br>"
        )}
        </div>
        `;

        area.appendChild(
            card
        );

    });

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
