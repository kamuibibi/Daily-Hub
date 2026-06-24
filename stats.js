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
   Storage API 使用量取得
===================== */

async function getStorageAPIEstimate(){

    if(
        !navigator.storage ||
        !navigator.storage.estimate
    ){

        return null;

    }

    try{

        return await
        navigator.storage.estimate();

    }

    catch(e){

        return null;

    }

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

    const estimate =
    await getStorageAPIEstimate();

    let storageCardHtml = "";

    if(estimate){

        const used =
        estimate.usage || 0;

        const quota =
        estimate.quota || 0;

        const percent =
        quota > 0
        ? Math.round(
            (used / quota) * 100
        )
        : 0;

        const barColor =
        percent >= 90
        ? "#e74c3c"
        : percent >= 70
        ? "#f39c12"
        : "#007aff";

        storageCardHtml =
        `
        <div class="list-card">

            <h3>
            ${t("stats.storage_api_title")}
            </h3>

            <div style="margin:8px 0 4px;">
            ${t("stats.storage_api_used")}：
            ${formatBytes(used)}
            /
            ${formatBytes(quota)}
            </div>

            <div style="
                background:#333;
                border-radius:6px;
                height:10px;
                overflow:hidden;
                margin:8px 0;
            ">
                <div style="
                    width:${percent}%;
                    height:100%;
                    background:${barColor};
                    border-radius:6px;
                    transition:width 0.4s;
                "></div>
            </div>

            <div style="font-size:13px;opacity:.75;">
            ${t("stats.storage_api_percent")}：${percent}%
            </div>

        </div>
        `;

    }

    else{

        storageCardHtml =
        `
        <div class="list-card">

            <h3>
            ${t("stats.storage_api_title")}
            </h3>

            <div style="opacity:.6;font-size:13px;">
            ${t("stats.storage_api_unavailable")}
            </div>

        </div>
        `;

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

    ${storageCardHtml}
    `;

}