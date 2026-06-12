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
   検索実行
===================== */

async function runSearch(){
    
    const attachmentResults =
await searchAttachment(
    keyword
);

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

    const memoResults =
    searchMemo(
        keyword
    );

    const taskResults =
    searchTask(
        keyword
    );

    let html = "";

    memoResults.forEach(item=>{

        html +=
        `
        <div class="list-card">

            <div class="small-date">
            ${item.date}
            </div>

            <div>
            📝 ${item.text}
            </div>

        </div>
        `;

    });

    taskResults.forEach(item=>{
        
        attachmentResults.forEach(file=>{

    html +=
    `
    <div class="list-card">

        <div class="small-date">
        ${file.date}
        </div>

        <div>
        📎 ${file.title || file.name}
        </div>

    </div>
    `;

});

        html +=
        `
        <div class="list-card">

            <div class="small-date">
            ${item.date}
            </div>

            <div>
            ✅ ${item.task.text}
            </div>

        </div>
        `;

    });

    if(!html){

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

    const files =
    await getAllAttachments();

    return files.filter(file=>

        (file.title || "")
        .toLowerCase()
        .includes(
            keyword.toLowerCase()
        )

        ||

        (file.name || "")
        .toLowerCase()
        .includes(
            keyword.toLowerCase()
        )

    );

} 

