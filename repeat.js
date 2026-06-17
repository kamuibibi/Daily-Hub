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
   今日生成すべきか判定
===================== */

function shouldGenerateToday(
    template,
    todayKey
){

    const today =
    new Date(todayKey + "T00:00:00");

    const start =
    new Date(
        template.startDate + "T00:00:00"
    );

    if(today < start){

        return false;

    }

    switch(template.repeat){

        case "daily":
            return true;

        case "weekly":
            return (
                today.getDay() ===
                start.getDay()
            );

        case "monthly":
            return (
                today.getDate() ===
                start.getDate()
            );

        default:
            return false;

    }

}

/* =====================
   今日分を生成
===================== */

function generateRepeatTasks(){

    const todayKey =
    getTodayDateKey();

    const templates =
    loadRepeatTasks();

    if(templates.length === 0){

        return;

    }

    if(!appData[todayKey]){

        appData[todayKey] = {
            memo:"",
            tasks:[]
        };

    }

    let changed = false;

    templates.forEach(template=>{

        const todayTasks =
        appData[todayKey].tasks || [];

        const alreadyExists =
        todayTasks.some(
            t => t.repeatId === template.id
        );

        if(alreadyExists){

            return;

        }

        if(
            shouldGenerateToday(
                template,
                todayKey
            )
        ){

            appData[todayKey].tasks.push({

                id:
                Date.now() +
                Math.floor(
                    Math.random() * 10000
                ),

                text:
                template.text,

                completed:false,

                reminder:
                template.reminder || null,

                repeat:
                template.repeat,

                repeatId:
                template.id

            });

            changed = true;

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
