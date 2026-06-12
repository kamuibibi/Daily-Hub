/* =====================
   添付保存
===================== */

async function saveAttachment(){

    if(!selectedDate){

        alert(
            "日付を選択してください"
        );

        return;
    }

    const input =
    document.getElementById(
        "attachmentInput"
    );

    if(
        !input.files ||
        !input.files.length
    ){

        alert(
            "ファイルを選択してください"
        );

        return;
    }

    const dateKey =
    getDateKey();

    for(
        const file
        of input.files
    ){

const title =
prompt(
    file.name +
    "\n\n表示名を入力"
);

await saveAttachmentToDB(

    dateKey,

    file,

    title || file.name

);



    }

    input.value = "";

    await renderAttachmentArea();

    refreshCalendar();

    updateStats();

    alert(
        "保存しました"
    );

}

/* =====================
   日付添付一覧
===================== */

async function renderAttachmentArea(){

    const area =
    document.getElementById(
        "attachmentArea"
    );

    if(
        !area ||
        !selectedDate
    ){

        return;
    }

    area.innerHTML = "";

    const dateKey =
    getDateKey();

    const files =
    await getAttachmentsByDate(
        dateKey
    );

    if(
        files.length === 0
    ){

        area.innerHTML =
        `
        <div class="list-card">
        添付なし
        </div>
        `;

        return;
    }

    files.forEach(file=>{

        const card =
        document.createElement(
            "div"
        );

        card.className =
        "attachment-card";

        const url =
        URL.createObjectURL(
            file.file
        );

        let preview = "";

        if(
            file.type &&
            file.type.startsWith(
                "image/"
            )
        ){

            preview =
            `
            <img
            src="${url}"
            class="attachment-preview">
            `;

        }

        else if(
            file.type &&
            file.type.startsWith(
                "video/"
            )
        ){

            preview =
            `
            <video
            class="attachment-preview"
            controls>

            <source
            src="${url}">

            </video>
            `;

        }

        card.innerHTML =
        `
        <div>
        ${file.title || file.name}
        </div>

        ${preview}

        <button
        onclick="downloadAttachment('${file.id}')">
        ダウンロード
        </button>

        <button
        class="delete-btn"
        onclick="deleteAttachment('${file.id}')">
        削除
        </button>
        `;

        area.appendChild(
            card
        );

    });

}

/* =====================
   添付一覧画面
===================== */

async function showAttachmentList(){

    showPage(
        "attachmentPage"
    );

    await renderAttachmentList();

}

/* =====================
   添付一覧描画
===================== */

async function renderAttachmentList(){

    const area =
    document.getElementById(
        "attachmentListArea"
    );

    area.innerHTML = "";

    const files =
    await getAllAttachments();

    files.sort(

        (a,b)=>

        new Date(b.date)
        -
        new Date(a.date)

    );

    if(
        files.length === 0
    ){

        area.innerHTML =
        `
        <div class="list-card">
        添付ファイルなし
        </div>
        `;

        return;
    }

    files.forEach(file=>{

        const card =
        document.createElement(
            "div"
        );

        card.className =
        "attachment-card";

        const url =
        URL.createObjectURL(
            file.file
        );

        let preview = "";

        if(
            file.type &&
            file.type.startsWith(
                "image/"
            )
        ){

            preview =
            `
            <img
            src="${url}"
            class="attachment-preview">
            `;

        }

        else if(
            file.type &&
            file.type.startsWith(
                "video/"
            )
        ){

            preview =
            `
            <video
            class="attachment-preview"
            controls>

            <source
            src="${url}">

            </video>
            `;

        }

        card.innerHTML =
        `
        <div class="small-date">
        ${file.date}
        </div>

       <div>
        ${file.title || file.name}
        </div> 

        ${preview}

        <button
        onclick="downloadAttachment('${file.id}')">
        ダウンロード
        </button>

        <button
        class="delete-btn"
        onclick="deleteAttachment('${file.id}')">
        削除
        </button>
        `;

        area.appendChild(
            card
        );

    });

}

/* =====================
   ダウンロード
===================== */

async function downloadAttachment(id){

    try{

        const file =
        await getAttachmentById(
            id
        );

        if(!file){

            alert(
                "ファイル取得失敗"
            );

            return;
        }

        const blob =
        file.file ||
        file.blob;

        if(!blob){

            alert(
                "Blob取得失敗"
            );

            return;
        }

        const url =
        URL.createObjectURL(
            blob
        );

const a =
document.createElement(
    "a"
);

a.href = url;

a.download =
file.title ||
file.name ||
"download";

document.body
.appendChild(a);

        a.click();

        a.remove();

        setTimeout(
            ()=>{

                URL.revokeObjectURL(
                    url
                );

            },
            1000
        );

    }

    catch(error){

        console.error(
            error
        );

        alert(
            "ダウンロードエラー"
        );

    }

}

/* =====================
   削除
===================== */

async function deleteAttachment(id){

    const ok =
    confirm(
        "削除しますか？"
    );

    if(!ok){

        return;
    }

    try{

        await deleteAttachmentById(
            id
        );

        await renderAttachmentArea();

        await renderAttachmentList();

        updateStats();

        alert(
            "削除しました"
        );

    }

    catch(error){

        console.error(
            error
        );

        alert(
            "削除失敗"
        );

    }

}