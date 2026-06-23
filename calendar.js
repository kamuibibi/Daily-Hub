/* =====================
   Daily Hub Pro v3.0
   Calendar
===================== */

function getWeekNames(){

    return [
        t("cal.sun"),
        t("cal.mon"),
        t("cal.tue"),
        t("cal.wed"),
        t("cal.thu"),
        t("cal.fri"),
        t("cal.sat")
    ];

}

function formatYearMonth(year, month){

    const lang =
    (typeof getLang === "function")
    ? getLang()
    : "ja";

    if(lang === "en"){

        return new Date(year, month - 1, 1)
        .toLocaleDateString("en-US", {
            year: "numeric",
            month: "long"
        });

    }

    return `${year}年${month}月`;

}

/* =====================
   カレンダー描画
===================== */

function renderCalendar(){

    const calendar =
    document.getElementById(
        "calendar"
    );

    calendar.innerHTML = "";

    const appTitle =
    document.getElementById(
        "appTitle"
    );

    if(appTitle){

        appTitle.textContent =
        formatYearMonth(
            currentYear,
            currentMonth
        );

    }

    /* 曜日 */

    getWeekNames().forEach(day=>{

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

        const numEl =
        document.createElement(
            "span"
        );

        numEl.className =
        "day-num";

        numEl.textContent =
        day;

        cell.appendChild(
            numEl
        );

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

        if(appData[key]){

            const data =
            appData[key];

            if(data.favorite){

                const b =
                document.createElement(
                    "span"
                );

                b.className = "badge-fav";

                b.textContent = "★";

                cell.appendChild(b);

            }

            if(data.important){

                const b =
                document.createElement(
                    "span"
                );

                b.className = "badge-imp";

                b.textContent = "●";

                cell.appendChild(b);

            }

            const hasMemo =
            data.memo &&
            data.memo.trim();

            const hasTask =
            data.tasks &&
            data.tasks.length;

            const hasAttachment =
            attachmentDateSet.has(key);

            if(hasMemo || hasTask || hasAttachment){

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

    updateFlagButtons();

}

/* =====================
   フラグトグル
===================== */

function toggleFavorite(){

    if(!selectedDate){ return; }

    ensureDateData();

    const key = getDateKey();

    appData[key].favorite =
    !appData[key].favorite;

    saveAll();

    renderCalendar();

    updateFlagButtons();

}

function toggleImportant(){

    if(!selectedDate){ return; }

    ensureDateData();

    const key = getDateKey();

    appData[key].important =
    !appData[key].important;

    saveAll();

    renderCalendar();

    updateFlagButtons();

}

function updateFlagButtons(){

    const key = getDateKey();

    const favBtn =
    document.getElementById("favBtn");

    const impBtn =
    document.getElementById("impBtn");

    if(!favBtn || !impBtn){ return; }

    if(!key || !appData[key]){

        favBtn.textContent = "☆";
        favBtn.style.color = "#888";
        impBtn.textContent = "○";
        impBtn.style.color = "#888";

        return;

    }

    const data = appData[key];

    favBtn.textContent =
    data.favorite ? "★" : "☆";

    favBtn.style.color =
    data.favorite ? "#ffcc00" : "#888";

    impBtn.textContent =
    data.important ? "●" : "○";

    impBtn.style.color =
    data.important ? "#ff3b30" : "#888";

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
   初回起動はapp.jsに委譲
===================== */