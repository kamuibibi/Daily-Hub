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
        ${escapeHtml(date || t("search.no_date"))}
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
    t("search.attach_label");

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
        ${escapeHtml(file.date || t("search.no_date"))}
        </div>

        <div class="search-type">
        📎 ${escapeHtml(t("search.attach_label"))}
        </div>

        <div class="search-text">
        ${escapeHtml(title)}
        </div>

        ${preview}

        <button
        type="button"
        onclick="downloadAttachment('${file.id}')">
        ${escapeHtml(t("search.download_btn"))}
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
        ${escapeHtml(t("search.enter_keyword"))}
        </div>
        `;

        return;
    }

    resultArea.innerHTML =
    `
    <div class="list-card">
    ${escapeHtml(t("search.searching"))}
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
    ${escapeHtml(t("search.results", {n: total}))}
    </div>
    `;

    memoResults.forEach(item=>{

        html +=
        buildSearchCard(
            t("search.memo_label"),
            "📝",
            item.date,
            item.text
        );

    });

    taskResults.forEach(item=>{

        const taskStatus =
        item.task.completed
        ? t("search.task_done")
        : t("search.task_undone");

        html +=
        buildSearchCard(
            t("search.task_label") + " / " + taskStatus,
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
        ${escapeHtml(t("search.no_results"))}
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
