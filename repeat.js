/* =====================
   Daily Hub Pro v3.1
   Repeat Tasks
===================== */

const REPEAT_KEY =
"dailyhub_repeat";

const DELETED_INSTANCES_KEY =
"dailyhub_deleted_repeat_instances";

/* =====================
   削除済みインスタンス管理
   （appDataとは独立したキーで保存）
===================== */

function loadDeletedInstances(){

    const raw =
    localStorage.getItem(
        DELETED_INSTANCES_KEY
    );

    if(raw){

        try{

            return JSON.parse(raw);

        }
        catch{

            return {};

        }

    }

    return {};

}

function saveDeletedInstances(map){

    localStorage.setItem(
        DELETED_INSTANCES_KEY,
        JSON.stringify(map)
    );

}

function markRepeatDeleted(
    templateId,
    dateKey
){

    const map =
    loadDeletedInstances();

    map[
        String(templateId) + "|" + dateKey
    ] = true;

    saveDeletedInstances(map);

}

function unmarkRepeatDeleted(
    templateId,
    dateKey
){

    const map =
    loadDeletedInstances();

    delete map[
        String(templateId) + "|" + dateKey
    ];

    saveDeletedInstances(map);

}

/* =====================
   テンプレート読込・保存
===================== */

function loadRepeatTasks(){

    const raw =
    localStorage.getItem(REPEAT_KEY);

    if(raw){

        try{

            return JSON.parse(raw);

        }
        catch{

            return [];

        }

    }

    return [];

}

function saveRepeatTasks(tasks){

    localStorage.setItem(
        REPEAT_KEY,
        JSON.stringify(tasks)
    );

}

/* =====================
   テンプレート追加
===================== */

function addRepeatTask(
    id,
    text,
    repeat,
    reminder,
    startDate
){

    const templates =
    loadRepeatTasks();

    templates.push({

        id:id,

        text:text,

        repeat:repeat,

        reminder:
        reminder || null,

        startDate:startDate

    });

    saveRepeatTasks(templates);

}

/* =====================
   テンプレート削除
===================== */

function deleteRepeatTask(id){

    const ok =
    confirm(
        "この繰り返しタスクを削除しますか？\n今後生成されなくなります。"
    );

    if(!ok){

        return;

    }

    const templates =
    loadRepeatTasks().filter(
        t => t.id !== id
    );

    saveRepeatTasks(templates);

    const map =
    loadDeletedInstances();

    const prefix =
    String(id) + "|";

    Object.keys(map).forEach(k=>{

        if(k.startsWith(prefix)){

            delete map[k];

        }

    });

    saveDeletedInstances(map);

    renderRepeatList();

}

/* =====================
   繰り返しラベル
===================== */

function getRepeatLabel(repeat){

    switch(repeat){

        case "daily":
            return "毎日";

        case "weekly":
            return "毎週";

        case "monthly":
            return "毎月";

        default:
            return "";

    }

}

/* =====================
   日付キー変換
===================== */

function dateToKey(date){

    const y =
    date.getFullYear();

    const m =
    String(
        date.getMonth() + 1
    ).padStart(2, "0");

    const d =
    String(
        date.getDate()
    ).padStart(2, "0");

    return `${y}-${m}-${d}`;

}

/* =====================
   月加算（閏年・月末対応）
===================== */

function addMonthSafe(date){

    const originalDay =
    date.getDate();

    date.setDate(1);

    date.setMonth(
        date.getMonth() + 1
    );

    const maxDay =
    new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0
    ).getDate();

    date.setDate(
        Math.min(originalDay, maxDay)
    );

    return date;

}

/* =====================
   startDateから先まで生成
===================== */

function generateRepeatTasks(){

    const templates =
    loadRepeatTasks();

    if(templates.length === 0){

        return;

    }

    const todayStr =
    getTodayDateKey();

    let changed = false;

    let idSeed = Date.now();

    const deletedMap =
    loadDeletedInstances();

    templates.forEach(template=>{

        const daysAhead =
        template.repeat === "monthly"
        ? 365
        : template.repeat === "weekly"
        ? 90
        : 60;

        const endDate =
        new Date(todayStr + "T00:00:00");

        endDate.setDate(
            endDate.getDate() + daysAhead
        );

        const current =
        new Date(
            template.startDate + "T00:00:00"
        );

        while(current <= endDate){

            const dateKey =
            dateToKey(current);

            if(!appData[dateKey]){

                appData[dateKey] = {
                    memo:"",
                    tasks:[]
                };

            }

            const alreadyDeleted =
            !!(deletedMap[
                template.id + "|" + dateKey
            ]);

            const alreadyInTrash =
            (typeof trashData !== "undefined") &&
            trashData.some(
                item =>
                item.dateKey === dateKey &&
                item.task &&
                String(item.task.repeatId) ===
                String(template.id)
            );

            const alreadyExists =
            (appData[dateKey].tasks || [])
            .some(
                t => t.repeatId === template.id
            );

            if(
                !alreadyExists &&
                !alreadyDeleted &&
                !alreadyInTrash
            ){

                idSeed++;

                appData[dateKey].tasks.push({

                    id: idSeed,

                    text:
                    template.text,

                    completed: false,

                    reminder:
                    template.reminder || null,

                    repeat:
                    template.repeat,

                    repeatId:
                    template.id

                });

                changed = true;

            }

            if(template.repeat === "daily"){

                current.setDate(
                    current.getDate() + 1
                );

            }
            else if(template.repeat === "weekly"){

                current.setDate(
                    current.getDate() + 7
                );

            }
            else if(template.repeat === "monthly"){

                addMonthSafe(current);

            }
            else{

                break;

            }

        }

    });

    if(changed){

        saveAll();

    }

}

/* =====================
   繰り返し一覧描画
===================== */

function renderRepeatList(){

    const area =
    document.getElementById(
        "repeatListArea"
    );

    if(!area){

        return;

    }

    const templates =
    loadRepeatTasks();

    if(templates.length === 0){

        area.innerHTML =
        `
        <div class="repeat-empty">
        繰り返しタスクはありません
        </div>
        `;

        return;

    }

    area.innerHTML = "";

    templates.forEach(template=>{

        const item =
        document.createElement("div");

        item.className =
        "repeat-item";

        item.innerHTML =
        `
        <div class="repeat-item-info">

            <span class="repeat-badge">
            🔁 ${escapeHtml(
                getRepeatLabel(template.repeat)
            )}
            </span>

            <span class="repeat-item-text">
            ${escapeHtml(template.text)}
            </span>

            ${template.reminder
            ? `<span class="reminder-badge">
               ⏰ ${escapeHtml(template.reminder)}
               </span>`
            : ""}

        </div>

        <button
        type="button"
        class="delete-btn"
        onclick="deleteRepeatTask(${template.id})">
        削除
        </button>
        `;

        area.appendChild(item);

    });

}
