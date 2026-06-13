/* =====================
   Daily Hub Pro v3.0
   Calendar
===================== */

const WEEK_NAMES = [

    "日",
    "月",
    "火",
    "水",
    "木",
    "金",
    "土"

];

/* =====================
   カレンダー描画
===================== */

function renderCalendar(){

    const calendar =
    document.getElementById(
        "calendar"
    );

    calendar.innerHTML = "";

    document
    .getElementById(
        "appTitle"
    )
    .textContent =
    `${currentYear}年${currentMonth}月`;

    const appTitle =
    document.getElementById(
        "appTitle"
    );

    if(appTitle){

        appTitle.textContent =
        `${currentYear}年${currentMonth}月`;

    }

    /* 曜日 */

    WEEK_NAMES.forEach(day=>{

        const header =
        document.createElement(
            "div"
        );

        header.className =
        "day-header";

        header.textContent =
        day;

        calendar.appendChild(
            header
        );

    });

    const firstDay =
    new Date(
        currentYear,
        currentMonth - 1,
        1
    );

    const startDay =
    firstDay.getDay();

    const lastDate =
    new Date(
        currentYear,
        currentMonth,
        0
    ).getDate();

    /* 空白 */

    for(
        let i=0;
        i<startDay;
        i++
    ){

        const blank =
        document.createElement(
            "div"
        );

        calendar.appendChild(
            blank
        );

    }

    /* 日付生成 */

    for(
        let day=1;
        day<=lastDate;
        day++
    ){

        const cell =
        document.createElement(
            "div"
        );

        cell.className =
        "day";

        cell.textContent =
        day;

        const key =
        createDateKey(
            currentYear,
            currentMonth,
            day
        );

        /* 今日 */

        const now =
        new Date();

        if(

            currentYear ===
            now.getFullYear()

            &&

            currentMonth ===
            now.getMonth()+1

            &&

            day ===
            now.getDate()

        ){

            cell.classList.add(
                "today-highlight"
            );
            cell.style.background ="#ffcc00";

            cell.style.color ="#000000";

        }

        /* 選択中 */

        if(

            selectedDate

            &&

            selectedDate.year
            === currentYear

            &&

            selectedDate.month
            === currentMonth

            &&

            selectedDate.day
            === day

        ){

            cell.classList.add(
                "selected"
            );

        }

        /* バッジ */

        if(

            appData[key]

        ){

            const data =
            appData[key];

            const hasMemo =
            data.memo &&
            data.memo.trim();

            const hasTask =
            data.tasks &&
            data.tasks.length;

            if(
                hasMemo ||
                hasTask
            ){

                const badge =
                document.createElement(
                    "span"
                );

                badge.className =
                "badge";

                badge.textContent =
                "●";

                cell.appendChild(
                    badge
                );

            }

        }

        cell.addEventListener(

            "click",

            ()=>{

                selectDate(
                    day
                );

            }

        );

        calendar.appendChild(
            cell
        );

    }

}

/* =====================
   日付選択
===================== */

function selectDate(day){

    selectedDate = {

        year:
        currentYear,

        month:
        currentMonth,

        day:
        day

    };

    ensureDateData();

    const key =
    getDateKey();

    document
    .getElementById(
        "selectedDate"
    )
    .textContent =
    key;

    document
    .getElementById(
        "memoInput"
    )
    .value =
    appData[key].memo || "";

    renderTaskArea();

    renderAttachmentArea();

    renderCalendar();

}

/* =====================
   日付キー
===================== */

function createDateKey(
    year,
    month,
    day
){

    const y =
    year;

    const m =
    String(
        month
    ).padStart(
        2,
        "0"
    );

    const d =
    String(
        day
    ).padStart(
        2,
        "0"
    );

    return `${y}-${m}-${d}`;

}

/* =====================
   前月
===================== */

function prevMonth(){

    currentMonth--;

    if(
        currentMonth < 1
    ){

        currentMonth = 12;

        currentYear--;

    }

    renderCalendar();

}

/* =====================
   次月
===================== */

function nextMonth(){

    currentMonth++;

    if(
        currentMonth > 12
    ){

        currentMonth = 1;

        currentYear++;

    }

    renderCalendar();

}

/* =====================
   今日へ移動
===================== */

function goToday(){

    const now =
    new Date();

    currentYear =
    now.getFullYear();

    currentMonth =
    now.getMonth()+1;

    selectedDate = {

        year:
        currentYear,

        month:
        currentMonth,

        day:
        now.getDate()

    };

    renderCalendar();

    selectDate(
        now.getDate()
    );

}

/* =====================
   カレンダー更新
===================== */

function refreshCalendar(){

    renderCalendar();

}

/* =====================
   初回起動
===================== */

window.addEventListener(

    "load",

    ()=>{

        renderCalendar();

    }

);