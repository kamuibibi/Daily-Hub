/* =====================
   Daily Hub Pro v3.0
   App Core
===================== */

const STORAGE_KEY =
"dailyhub_data";

let appData = {};

let today =
new Date();

let currentYear =
today.getFullYear();

let currentMonth =
today.getMonth() + 1;

let selectedDate = null;

/* =====================
   保存
===================== */

function saveAll(){

    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(
            appData
        )

    );

}

/* =====================
   読込
===================== */

function loadAll(){

    const raw =
    localStorage.getItem(
        STORAGE_KEY
    );

    if(raw){

        try{

            appData =
            JSON.parse(raw);

        }
        catch{

            appData = {};
        }

    }
    else{

        appData = {};
    }

}

/* =====================
   日付キー
===================== */

function getDateKey(){

    if(!selectedDate){

        return null;
    }

    const y =
    selectedDate.year;

    const m =
    String(
        selectedDate.month
    ).padStart(
        2,
        "0"
    );

    const d =
    String(
        selectedDate.day
    ).padStart(
        2,
        "0"
    );

    return `${y}-${m}-${d}`;

}

/* =====================
   データ保証
===================== */

function ensureDateData(){

    const key =
    getDateKey();

    if(!key){

        return;
    }

    if(!appData[key]){

        appData[key] = {

            memo:"",

            tasks:[]

        };

    }

}

/* =====================
   ページ切替
===================== */

function hideAllPages(){

    document
    .querySelectorAll(
        ".page"
    )
    .forEach(page=>{

        page.classList.remove(
            "active"
        );

    });

}

function showPage(id){

    hideAllPages();

    document
    .getElementById(id)
    .classList
    .add(
        "active"
    );

    window.scrollTo(
        0,
        0
    );

}

/* =====================
   ホームへ
===================== */

function goHome(){

    updateStats();

    showPage(
        "homePage"
    );

}

/* =====================
   ページ表示
===================== */

function showCalendarPage(){

    showPage(
        "calendarPage"
    );

    renderCalendar();
}

function showSearchPage(){

    showPage(
        "searchPage"
    );
}

function showStatsPage(){

    showPage(
        "statsPage"
    );

    renderStats();
}

function showBackupPage(){

    showPage(
        "backupPage"
    );
}

function showSettingsPage(){

    showPage(
        "settingsPage"
    );
}

/* =====================
   件数取得
===================== */

function getMemoCount(){

    let count = 0;

    Object.values(
        appData
    ).forEach(item=>{

        if(
            item.memo &&
            item.memo.trim()
        ){

            count++;

        }

    });

    return count;
}

function getTaskCount(){

    let count = 0;

    Object.values(
        appData
    ).forEach(item=>{

        count +=
        item.tasks.length;

    });

    return count;
}

/* =====================
   統計更新
===================== */

async function updateStats(){

    document
    .getElementById(
        "memoCount"
    )
    .textContent =
    getMemoCount();

    document
    .getElementById(
        "taskCount"
    )
    .textContent =
    getTaskCount();

    const attachments =
    await getAllAttachments();

    document
    .getElementById(
        "attachmentCount"
    )
    .textContent =
    attachments.length;

    const totalSize =
    await getTotalStorageSize();

    document
    .getElementById(
        "storageSize"
    )
    .textContent =
    formatBytes(
        totalSize
    );

}

/* =====================
   全削除
===================== */

async function clearAllData(){

    const ok =
    confirm(
        "全データを削除しますか？"
    );

    if(!ok){

        return;
    }

    appData = {};

    localStorage.removeItem(
        STORAGE_KEY
    );

    await clearAttachmentsDB();

    updateStats();

    alert(
        "削除完了"
    );

    location.reload();

}

/* =====================
   日付並び
===================== */

function getSortedKeys(){

    return Object
    .keys(appData)
    .sort(
        (a,b)=>

        new Date(a)
        -
        new Date(b)

    );

}

/* =====================
   起動
===================== */

window.addEventListener(
    "load",

    async ()=>{

        loadAll();

        await updateStats();

        showPage(
            "homePage"
        );

        startReminderLoop();

    }

);
