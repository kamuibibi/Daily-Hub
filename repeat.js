/* =====================
   Daily Hub Pro v3.1
   Repeat Tasks
===================== */

const REPEAT_KEY =
"dailyhub_repeat";

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
   startDateから60日先まで生成
===================== */

function generateRepeatTasks(){

    const templates =
    loadRepeatTasks();

    if(templates.length === 0){

        return;

    }

    const endDate =
    new Date(
        getTodayDateKey() + "T00:00:00"
    );

    endDate.setDate(
        endDate.getDate() + 60
    );

    let changed = false;

    let idSeed = Date.now();

    templates.forEach(template=>{

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

            const alreadyExists =
            (appData[dateKey].tasks || [])
            .some(
                t => t.repeatId === template.id
            );

            if(!alreadyExists){

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

                current.setMonth(
                    current.getMonth() + 1
                );

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
