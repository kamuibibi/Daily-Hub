/* =====================
   Daily Hub Pro v3.0
   Task
===================== */

/* =====================
   タスク追加
===================== */

function addTask(){

    if(!selectedDate){

        alert(
            "日付を選択してください"
        );

        return;
    }

    const input =
    document.getElementById(
        "taskInput"
    );

    const text =
    input.value.trim();

    if(!text){

        return;
    }

    ensureDateData();

    const key =
    getDateKey();

    const reminderInput =
    document.getElementById(
        "taskReminderTime"
    );

    const reminder =
    reminderInput && reminderInput.value
    ? reminderInput.value
    : null;

    const repeatInput =
    document.getElementById(
        "taskRepeat"
    );

    const repeat =
    repeatInput && repeatInput.value
    ? repeatInput.value
    : null;

    const taskId =
    Date.now();

    if(repeat){

        addRepeatTask(
            taskId,
            text,
            repeat,
            reminder,
            key
        );

    }

    appData[key].tasks.push({

        id:
        repeat ? taskId + 1 : taskId,

        text:text,

        completed:false,

        reminder:reminder,

        repeat:repeat || null,

        repeatId:
        repeat ? taskId : null

    });

    input.value = "";

    if(reminderInput){

        reminderInput.value = "";

    }

    if(repeatInput){

        repeatInput.value = "";

    }

    saveAll();

    if(repeat){

        generateRepeatTasks();

    }

    renderTaskArea();

    refreshCalendar();

    updateStats();

}

/* =====================
   カレンダー画面
===================== */

function renderTaskArea(){

    const area =
    document.getElementById(
        "taskArea"
    );

    if(!area){

        return;
    }

    area.innerHTML = "";

    if(!selectedDate){

        return;
    }

    const key =
    getDateKey();

    ensureDateData();

    const tasks =
    appData[key].tasks;

    if(tasks.length === 0){

        area.innerHTML =
        `
        <div class="list-card">
            タスクなし
        </div>
        `;

        return;
    }

    tasks.forEach(task=>{

        const row =
        document.createElement(
            "div"
        );

        row.className =
        "todo-item";

        row.innerHTML =
        `
        <label class="task-label">

            <input
            type="checkbox"
            ${task.completed ? "checked" : ""}
            onchange="toggleTask(${task.id})">

            <span class="${
                task.completed
                ? "todo-complete"
                : ""
            }">

                ${escapeHtml(task.text)}

                ${task.repeat
                ? `<span class="repeat-badge">🔁 ${escapeHtml(getRepeatLabel(task.repeat))}</span>`
                : ""}

                ${task.reminder
                ? `<span class="reminder-badge">⏰ ${escapeHtml(task.reminder)}</span>`
                : ""}

                ${task.fromMemo
                ? `<span class="memo-badge">📝 メモ</span>`
                : ""}

            </span>

        </label>

        ${!task.fromMemo
        ? `<button
        type="button"
        class="delete-btn"
        onclick="deleteTask(${task.id})">
            削除
        </button>`
        : ""}
        `;

        area.appendChild(
            row
        );

    });

}

/* =====================
   完了切替
===================== */

function toggleTask(id){

    const key =
    getDateKey();

    if(!key){

        return;
    }

    const tasks =
    appData[key].tasks;

    const task =
    tasks.find(

        t =>
        t.id === id

    );

    if(!task){

        return;
    }

    task.completed =
    !task.completed;

    saveAll();

    renderTaskArea();

    renderTaskList();

    refreshCalendar();

    if(
        task.completed &&
        settings.taskCompleteAction
        === "auto-delete"
    ){

        const capturedKey = key;
        const capturedId = id;

        setTimeout(()=>{

            const dayData =
            appData[capturedKey];

            if(!dayData){ return; }

            const target =
            dayData.tasks.find(
                t => t.id === capturedId
            );

            if(
                !target ||
                !target.completed
            ){
                return;
            }

            dayData.tasks =
            dayData.tasks.filter(
                t => t.id !== capturedId
            );

            saveAll();

            renderTaskArea();

            renderTaskList();

            refreshCalendar();

            updateStats();

        }, 2000);

    }

}

/* =====================
   削除
===================== */

function deleteTask(id){

    const key =
    getDateKey();

    const task =
    appData[key].tasks.find(
        t => t.id === id
    );

    if(!task){

        return;
    }

    if(task.repeatId){

        markRepeatDeleted(
            task.repeatId,
            key
        );

    }

    moveToTrash(
        key,
        task
    );

    appData[key].tasks =
    appData[key].tasks.filter(

        t =>
        t.id !== id

    );

    saveAll();

    renderTaskArea();

    renderTaskList();

    refreshCalendar();

    updateStats();

}

/* =====================
   タスク一覧
===================== */

function showTaskList(){

    showPage(
        "taskPage"
    );

    renderTaskList();

}

/* =====================
   一覧描画
===================== */

function renderTaskList(){

    const area =
    document.getElementById(
        "taskListArea"
    );

    if(!area){

        return;
    }

    area.innerHTML = "";

    const keys =
    getSortedKeys();

    let taskCount = 0;

    keys.forEach(key=>{

        const tasks =
        appData[key].tasks || [];

        tasks.forEach(task=>{

            taskCount++;

            const card =
            document.createElement(
                "div"
            );

            card.className =
            "list-card";

            card.innerHTML =
            `
            <div class="small-date">
            ${key}
            </div>

            <label class="task-label">

            <input
            type="checkbox"
            ${task.completed ? "checked" : ""}
            onchange="
            toggleTaskFromList(
            '${key}',
            ${task.id}
            )">

            <span class="${
                task.completed
                ? "todo-complete"
                : ""
            }">

            ${escapeHtml(
                task.text
            )}

            ${task.repeat
            ? `<span class="repeat-badge">🔁 ${escapeHtml(getRepeatLabel(task.repeat))}</span>`
            : ""}

            ${task.reminder
            ? `<span class="reminder-badge">⏰ ${escapeHtml(task.reminder)}</span>`
            : ""}

            </span>

            </label>
            `;

            area.appendChild(
                card
            );

        });

    });

    if(taskCount === 0){

        area.innerHTML =
        `
        <div class="list-card">
        タスクはありません
        </div>
        `;
    }

}

/* =====================
   一覧から完了切替
===================== */

function toggleTaskFromList(
    dateKey,
    taskId
){

    const tasks =
    appData[dateKey].tasks;

    const task =
    tasks.find(

        t =>
        t.id === taskId

    );

    if(!task){

        return;
    }

    task.completed =
    !task.completed;

    saveAll();

    renderTaskList();

    if(

        selectedDate

        &&

        getDateKey()
        === dateKey

    ){

        renderTaskArea();

    }

    refreshCalendar();

}

/* =====================
   タスク件数
===================== */

function getTaskTotal(){

    let total = 0;

    Object.values(
        appData
    ).forEach(item=>{

        total +=
        item.tasks.length;

    });

    return total;

}

/* =====================
   完了件数
===================== */

function getCompletedTaskTotal(){

    let total = 0;

    Object.values(
        appData
    ).forEach(item=>{

        item.tasks.forEach(task=>{

            if(
                task.completed
            ){

                total++;

            }

        });

    });

    return total;

}

/* =====================
   検索用
===================== */

function searchTask(keyword){

    const result = [];

    Object.keys(
        appData
    ).forEach(date=>{

        appData[date]
        .tasks
        .forEach(task=>{

            if(

                task.text
                .toLowerCase()
                .includes(
                    keyword
                    .toLowerCase()
                )

            ){

                result.push({

                    date:date,

                    task:task

                });

            }

        });

    });

    return result;

}