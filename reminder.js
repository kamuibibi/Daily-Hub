/* =====================
   Daily Hub Pro v3.1
   Reminder
===================== */

const firedReminders = new Set();

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

                firedReminders.add(reminderId);

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
