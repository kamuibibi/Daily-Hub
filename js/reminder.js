/* =====================
   Daily Hub Pro v3.1
   Reminder
===================== */

const FIRED_KEY =
"dailyhub_fired_reminders";

let firedReminders = new Set();

/* =====================
   発火済み読込
===================== */

function loadFiredReminders(){

    const raw =
    localStorage.getItem(
        FIRED_KEY
    );

    if(raw){

        try{

            const arr =
            JSON.parse(raw);

            firedReminders =
            new Set(arr);

        }
        catch{

            firedReminders =
            new Set();

        }

    }
    else{

        firedReminders =
        new Set();

    }

    cleanupFiredReminders();

}

/* =====================
   発火済み保存
===================== */

function saveFiredReminders(){

    localStorage.setItem(

        FIRED_KEY,

        JSON.stringify(
            [...firedReminders]
        )

    );

}

/* =====================
   古いエントリ削除
   (2日以上前の日付)
===================== */

function cleanupFiredReminders(){

    const now =
    new Date();

    const threshold =
    new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 1
    );

    const thresholdKey =
    threshold.toISOString()
    .slice(0, 10);

    firedReminders.forEach(id=>{

        const dateKey =
        id.slice(0, 10);

        if(dateKey < thresholdKey){

            firedReminders.delete(id);

        }

    });

    saveFiredReminders();

}

function getTodayDateKey(){

    const now =
    new Date();

    const y =
    now.getFullYear();

    const m =
    String(
        now.getMonth() + 1
    ).padStart(2, "0");

    const d =
    String(
        now.getDate()
    ).padStart(2, "0");

    return `${y}-${m}-${d}`;

}

function getCurrentTimeHHMM(){

    const now =
    new Date();

    return (
        String(
            now.getHours()
        ).padStart(2, "0") +
        ":" +
        String(
            now.getMinutes()
        ).padStart(2, "0")
    );

}

/* =====================
   通知許可リクエスト
===================== */

function requestNotificationPermission(){

    if(!("Notification" in window)){

        alert(
            "このブラウザは通知に対応していません"
        );

        return;

    }

    if(Notification.permission === "granted"){

        alert(
            "通知はすでに許可されています"
        );

        return;

    }

    Notification.requestPermission().then(perm=>{

        if(perm === "granted"){

            alert(
                "通知を許可しました"
            );

            checkReminders();

        }

        else{

            alert(
                "通知が拒否されました。ブラウザの設定から許可してください"
            );

        }

    });

}

/* =====================
   リマインダーループ開始
===================== */

function startReminderLoop(){

    loadFiredReminders();

    checkReminders();

    setInterval(checkReminders, 30000);

}

/* =====================
   リマインダーチェック
===================== */

function checkReminders(){

    if(!("Notification" in window)){

        return;

    }

    if(Notification.permission !== "granted"){

        return;

    }

    const todayKey =
    getTodayDateKey();

    const currentTime =
    getCurrentTimeHHMM();

    Object.keys(appData).forEach(dateKey=>{

        if(dateKey > todayKey){

            return;

        }

        const tasks =
        appData[dateKey].tasks || [];

        tasks.forEach(task=>{

            if(!task.reminder){

                return;

            }

            if(task.completed){

                return;

            }

            const reminderId =
            `${dateKey}-${task.id}`;

            if(firedReminders.has(reminderId)){

                return;

            }

            const isDueToday =
            dateKey === todayKey &&
            task.reminder <= currentTime;

            const isOverdue =
            dateKey < todayKey;

            if(isDueToday || isOverdue){

                firedReminders.add(
                    reminderId
                );

                saveFiredReminders();

                fireReminder(task, dateKey);

            }

        });

    });

}

/* =====================
   通知発火
===================== */

function fireReminder(task, dateKey){

    new Notification("Daily Hub Pro", {

        body:
        `📅 ${dateKey}\n✅ ${task.text}`,

        tag:
        `task-${task.id}`

    });

}
