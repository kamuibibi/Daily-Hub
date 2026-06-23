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

    if(item.task.repeatId){

        unmarkRepeatDeleted(
            item.task.repeatId,
            item.dateKey
        );

    }

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

async function clearTrash(){

    const ok =
    confirm(t("confirm.clear_trash"));

    if(!ok){

        return;

    }

    trashData = [];

    saveTrash();

    try{

        await clearAttachmentTrashDB();

    }
    catch(e){}

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

async function renderTrashPage(){

    const area =
    document.getElementById(
        "trashListArea"
    );

    if(!area){

        return;

    }

    area.innerHTML = "";

    let attachTrash = [];

    try{

        attachTrash =
        await getAllAttachmentTrash();

    }
    catch(e){

        attachTrash = [];

    }

    if(
        trashData.length === 0 &&
        attachTrash.length === 0
    ){

        const empty =
        document.createElement(
            "p"
        );

        empty.className =
        "trash-empty";

        empty.textContent =
        t("trash.empty");

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
    t("trash.clear_btn");

    clearBtn.onclick =
    clearTrash;

    area.appendChild(
        clearBtn
    );

    const combined = [

        ...trashData.map(item=>({
            kind:"task",
            item
        })),

        ...attachTrash.map(item=>({
            kind:"attach",
            item
        }))

    ].sort(
        (a,b)=>
        b.item.deletedAt -
        a.item.deletedAt
    );

    combined.forEach(entry=>{

        const { kind, item } = entry;

        const card =
        document.createElement(
            "div"
        );

        card.className =
        "list-card";

        const typeBadge =
        document.createElement(
            "span"
        );

        typeBadge.className =
        kind === "task"
        ? "trash-type-badge trash-type-task"
        : "trash-type-badge trash-type-attach";

        typeBadge.textContent =
        kind === "task"
        ? t("trash.task_badge")
        : t("trash.attach_badge");

        const dateEl =
        document.createElement(
            "div"
        );

        dateEl.className =
        "small-date";

        dateEl.textContent =
        kind === "task"
        ? item.dateKey
        : item.date;

        const textEl =
        document.createElement(
            "div"
        );

        textEl.className =
        "trash-item-text";

        textEl.textContent =
        kind === "task"
        ? item.task.text
        : (item.title || item.name);

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
        t("trash.restore_btn");

        const delBtn =
        document.createElement(
            "button"
        );

        delBtn.className =
        "delete-btn";

        delBtn.textContent =
        t("trash.delete_btn");

        if(kind === "task"){

            restoreBtn.onclick =
            ()=>restoreFromTrash(
                trashData.indexOf(item)
            );

            delBtn.onclick =
            ()=>deleteFromTrash(
                trashData.indexOf(item)
            );

        }
        else{

            restoreBtn.onclick =
            ()=>restoreAttachmentTrash(
                item.id
            );

            delBtn.onclick =
            ()=>deleteAttachmentTrash(
                item.id
            );

        }

        btnRow.appendChild(
            restoreBtn
        );

        btnRow.appendChild(
            delBtn
        );

        card.appendChild(
            typeBadge
        );

        card.appendChild(
            dateEl
        );

        card.appendChild(
            textEl
        );

        if(
            kind === "attach" &&
            item.type &&
            item.type.startsWith("image/") &&
            item.file
        ){

            const img =
            document.createElement(
                "img"
            );

            img.className =
            "attachment-preview";

            img.src =
            URL.createObjectURL(
                item.file
            );

            card.appendChild(img);

        }

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
   添付ゴミ箱から復元
===================== */

async function restoreAttachmentTrash(id){

    try{

        await restoreAttachmentTrashById(
            id
        );

        await renderAttachmentArea();

        await renderAttachmentList();

        renderTrashPage();

        updateStats();

    }
    catch(e){

        console.error(e);

    }

}

/* =====================
   添付ゴミ箱から完全削除
===================== */

async function deleteAttachmentTrash(id){

    try{

        await deleteAttachmentTrashById(
            id
        );

        renderTrashPage();

    }
    catch(e){

        console.error(e);

    }

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

        return t("trash.deleted_just_now");

    }

    if(min < 60){

        return t("trash.deleted_minutes", {n: min});

    }

    if(hour < 24){

        return t("trash.deleted_hours", {n: hour});

    }

    return t("trash.deleted_days", {n: day});

}
