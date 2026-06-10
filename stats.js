/* =====================
   Daily Hub Pro v3.0
   Stats
===================== */

/* =====================
   統計画面表示
===================== */

async function showStatsPage(){

    showPage(
        "statsPage"
    );

    await renderStats();

}

/* =====================
   統計描画
===================== */

async function renderStats(){

    const area =
    document.getElementById(
        "statsDetail"
    );

    if(!area){

        return;
    }

    const memoTotal =
    getMemoTotal();

    const taskTotal =
    getTaskTotal();

    const completedTaskTotal =
    getCompletedTaskTotal();

    let attachmentTotal = 0;

    try{

        const files =
        await getAllAttachments();

        attachmentTotal =
        files.length;

    }

    catch(error){

        console.error(
            error
        );

    }

    area.innerHTML =
    `
    <div class="list-card">

        <h3>
        メモ
        </h3>

        <div>
        ${memoTotal} 件
        </div>

    </div>

    <div class="list-card">

        <h3>
        タスク
        </h3>

        <div>
        総数：
        ${taskTotal} 件
        </div>

        <div>
        完了：
        ${completedTaskTotal} 件
        </div>

    </div>

    <div class="list-card">

        <h3>
        添付
        </h3>

        <div>
        ${attachmentTotal} 件
        </div>

    </div>
    `;

}