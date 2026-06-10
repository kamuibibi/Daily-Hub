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

function runSearch(){

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