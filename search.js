/* =====================
   Daily Hub Pro v3.0
   Search
===================== */

/* =====================
   検索ページ表示
===================== */

function showSearchPage(){

    showPage(
        "searchPage"
    );

}

/* =====================
   タグ検索エリア描画
===================== */

function renderTagSearchArea(){

    const area =
    document.getElementById(
        "tagSearchArea"
    );

    if(!area){

        return;

    }

    area.innerHTML = "";

    if(
        !settings.tags ||
        settings.tags.length === 0
    ){

        return;

    }

    const label =
    document.createElement("div");

    label.className =
    "tag-search-label";

    label.textContent =
    "🏷️ タグで絞り込み";

    area.appendChild(label);

    const wrap =
    document.createElement("div");

    wrap.className =
    "tag-search-wrap";

    settings.tags.forEach(tag=>{

        const btn =
        document.createElement("button");

        btn.className =
        "tag-search-btn";

        btn.textContent =
        tag;

        btn.onclick =
        ()=> searchByTag(tag, btn);

        wrap.appendChild(btn);

    });

    area.appendChild(wrap);

}

/* =====================
   タグで絞り込み
===================== */

function searchByTag(tag, btn){

    const resultArea =
    document.getElementById(
        "searchResult"
    );

    const allBtns =
    document.querySelectorAll(
        ".tag-search-btn"
    );

    allBtns.forEach(b=>{

        b.classList.remove(
            "tag-search-btn-active"
        );

    });

    if(btn){

        btn.classList.add(
            "tag-search-btn-active"
        );

    }

    resultArea.innerHTML = "";

    const results =
    searchMemo(tag);

    if(results.length === 0){

        resultArea.innerHTML =
        `
        <div class="list-card">
        「${escapeHtml(tag)}」のメモはありません
        </div>
        `;

        return;

    }

    let html =
    `
    <div class="list-card search-summary">
    「${escapeHtml(tag)}」: ${results.length}件
    </div>
    `;

    results.forEach(item=>{

        html +=
        buildSearchCard(
            "メモ",
            "📝",
            item.date,
            item.text
        );

    });

    resultArea.innerHTML =
    html;

}

/* =====================
   検索補助
===================== */

function normalizeSearchText(text){

    return String(text || "")
    .toLowerCase()
    .trim();

}

function makeSearchSnippet(text){

    const source =
    String(text || "")
    .trim();

    if(source.length <= 90){

        return source;

    }

    return source.slice(0, 90) + "...";

}

function buildSearchCard(
    typeLabel,
    icon,
    date,
    text
){

    return `
    <div class="list-card search-card">

        <div class="small-date">
        ${escapeHtml(date || "日付なし")}
        </div>

        <div class="search-type">
        ${icon} ${escapeHtml(typeLabel)}
        </div>

        <div class="search-text">
        ${escapeHtml(
            makeSearchSnippet(text)
        ).replaceAll(
            "\n",
            "<br>"
        )}
        </div>

    </div>
    `;

}

function buildAttachmentSearchCard(file){

    const blob =
    file.file ||
    file.blob;

    const title =
    file.title ||
    file.name ||
    "添付ファイル";

    let preview = "";

    if(blob){

        const url =
        URL.createObjectURL(
            blob
        );

        if(
            file.type &&
            file.type.startsWith(
                "image/"
            )
        ){

            preview =
            `
            <img
            src="${url}"
            class="attachment-preview"
            alt="${escapeHtml(title)}">
            `;

        }

        else if(
            file.type &&
            file.type.startsWith(
                "video/"
            )
        ){

            preview =
            `
            <video
            class="attachment-preview"
            controls>

                <source
                src="${url}">

            </video>
            `;

        }

    }

    return `
    <div class="list-card search-card">

        <div class="small-date">
        ${escapeHtml(file.date || "日付なし")}
        </div>

        <div class="search-type">
        📎 添付
        </div>

        <div class="search-text">
        ${escapeHtml(title)}
        </div>

        ${preview}

        <button
        type="button"
        onclick="downloadAttachment('${file.id}')">
        ダウンロード
        </button>

    </div>
    `;

}

/* =====================
   検索実行
===================== */

async function runSearch(){

    const keyword =
    document
    .getElementById(
        "searchInput"
    )
    .value
    .trim();

    const resultArea =
    document
    .getElementById(
        "searchResult"
    );

    resultArea.innerHTML = "";

    if(!keyword){

        resultArea.innerHTML =
        `
        <div class="list-card">
        検索文字を入力してください
        </div>
        `;

        return;
    }

    resultArea.innerHTML =
    `
    <div class="list-card">
    検索中...
    </div>
    `;

    const memoResults =
    searchMemo(
        keyword
    );

    const taskResults =
    searchTask(
        keyword
    );

    const attachmentResults =
    await searchAttachment(
        keyword
    );

    let html = "";

    const total =
    memoResults.length +
    taskResults.length +
    attachmentResults.length;

    html +=
    `
    <div class="list-card search-summary">
    検索結果: ${total}件
    </div>
    `;

    memoResults.forEach(item=>{

        html +=
        buildSearchCard(
            "メモ",
            "📝",
            item.date,
            item.text
        );

    });

    taskResults.forEach(item=>{

        const taskStatus =
        item.task.completed
        ? "完了"
        : "未完了";

        html +=
        buildSearchCard(
            "タスク / " + taskStatus,
            "✅",
            item.date,
            item.task.text
        );

    });

    attachmentResults.forEach(file=>{

        html +=
        buildAttachmentSearchCard(
            file
        );

    });

    if(total === 0){

        html =
        `
        <div class="list-card">
        検索結果なし
        </div>
        `;

    }

    resultArea.innerHTML =
    html;

}

/* =====================
   添付検索
===================== */

async function searchAttachment(
    keyword
){

    const normalizedKeyword =
    normalizeSearchText(
        keyword
    );

    const files =
    await getAllAttachments();

    return files.filter(file=>{

        const title =
        normalizeSearchText(
            file.title
        );

        const name =
        normalizeSearchText(
            file.name
        );

        return (
            title.includes(
                normalizedKeyword
            ) ||
            name.includes(
                normalizedKeyword
            )
        );

    });

}

/* =====================
   Enterキー検索
===================== */

window.addEventListener(

    "load",

    ()=>{

        const input =
        document.getElementById(
            "searchInput"
        );

        if(!input){

            return;

        }

        input.addEventListener(

            "keydown",

            event=>{

                if(event.key === "Enter"){

                    runSearch();

                }

            }

        );

    }

);
