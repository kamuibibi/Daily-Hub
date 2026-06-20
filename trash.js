/* =====================
   Daily Hub Pro
   Trash
===================== */

const TRASH_KEY =
"dailyhub_trash";

let trashData = [];

/* =====================
   読込・保存
===================== */

function loadTrash(){

    const raw =
    localStorage.getItem(
        TRASH_KEY
    );

    if(raw){

        try{

            trashData =
            JSON.parse(raw);

        }
        catch{

            trashData = [];

        }

    }
    else{

        trashData = [];

    }

}

function saveTrash(){

    localStorage.setItem(
        TRASH_KEY,
        JSON.stringify(
            trashData
        )
    );

}

/* =====================
   ゴミ箱へ移動
===================== */

function moveToTrash(
    dateKey,
    task
){

    trashData.unshift({

        dateKey:
        dateKey,

        task:
        task,

        deletedAt:
        Date.now()

    });

    saveTrash();

}

/* =====================
   復元
===================== */

function restoreFromTrash(
    index
){

    const item =
    trashData[index];

    if(!item){

        return;

    }

    if(!appData[item.dateKey]){

        appData[item.dateKey] = {

            memo:"",

            tasks:[],

            favorite:false,

            important:false

        };

    }

    if(!appData[item.dateKey].tasks){

        appData[item.dateKey].tasks = [];

    }

    appData[item.dateKey]
    .tasks
    .push(item.task);

    saveAll();

    trashData.splice(
        index,
        1
    );

    saveTrash();

    renderTrashPage();

    refreshCalendar();

    renderTaskArea();

    updateStats();

}

/* =====================
   完全削除
===================== */

function deleteFromTrash(
    index
){

    trashData.splice(
        index,
        1
    );

    saveTrash();

    renderTrashPage();

}

/* =====================
   ゴミ箱を空にする
===================== */

function clearTrash(){

    const ok =
    confirm(
        "ゴミ箱を空にしますか？"
    );

    if(!ok){

        return;

    }

    trashData = [];

    saveTrash();

    renderTrashPage();

}

/* =====================
   ページ表示
===================== */

function showTrashPage(){

    showPage(
        "trashPage"
    );

    renderTrashPage();

}

/* =====================
   描画
===================== */

function renderTrashPage(){

    const area =
    document.getElementById(
        "trashListArea"
    );

    if(!area){

        return;

    }

    area.innerHTML = "";

    if(trashData.length === 0){

        const empty =
        document.createElement(
            "p"
        );

        empty.className =
        "trash-empty";

        empty.textContent =
        "ゴミ箱は空です";

        area.appendChild(
            empty
        );

        return;

    }

    const clearBtn =
    document.createElement(
        "button"
    );

    clearBtn.className =
    "trash-clear-btn";

    clearBtn.textContent =
    "🗑️ ゴミ箱を空にする";

    clearBtn.onclick =
    clearTrash;

    area.appendChild(
        clearBtn
    );

    trashData.forEach(
        (item, index)=>{

        const card =
        document.createElement(
            "div"
        );

        card.className =
        "list-card";

        const dateEl =
        document.createElement(
            "div"
        );

        dateEl.className =
        "small-date";

        dateEl.textContent =
        item.dateKey;

        const textEl =
        document.createElement(
            "div"
        );

        textEl.className =
        "trash-item-text";

        textEl.textContent =
        item.task.text;

        const deletedEl =
        document.createElement(
            "div"
        );

        deletedEl.className =
        "trash-deleted-at";

        deletedEl.textContent =
        formatDeletedAt(
            item.deletedAt
        );

        const btnRow =
        document.createElement(
            "div"
        );

        btnRow.className =
        "trash-btn-row";

        const restoreBtn =
        document.createElement(
            "button"
        );

        restoreBtn.className =
        "trash-restore-btn";

        restoreBtn.textContent =
        "↩ 元に戻す";

        restoreBtn.onclick =
        ()=>
        restoreFromTrash(
            index
        );

        const delBtn =
        document.createElement(
            "button"
        );

        delBtn.className =
        "delete-btn";

        delBtn.textContent =
        "完全削除";

        delBtn.onclick =
        ()=>
        deleteFromTrash(
            index
        );

        btnRow.appendChild(
            restoreBtn
        );

        btnRow.appendChild(
            delBtn
        );

        card.appendChild(
            dateEl
        );

        card.appendChild(
            textEl
        );

        card.appendChild(
            deletedEl
        );

        card.appendChild(
            btnRow
        );

        area.appendChild(
            card
        );

    });

}

/* =====================
   経過時間
===================== */

function formatDeletedAt(ts){

    const diff =
    Date.now() - ts;

    const min =
    Math.floor(
        diff / 60000
    );

    const hour =
    Math.floor(
        diff / 3600000
    );

    const day =
    Math.floor(
        diff / 86400000
    );

    if(min < 1){

        return "たった今削除";

    }

    if(min < 60){

        return `${min}分前に削除`;

    }

    if(hour < 24){

        return `${hour}時間前に削除`;

    }

    return `${day}日前に削除`;

}
