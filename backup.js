/* =====================
   Daily Hub Pro v3.1
   Backup
===================== */

/* =====================
   バックアップ画面表示
===================== */

function showBackupPage(){

    showPage(
        "backupPage"
    );

}

/* =====================
   Blob → base64変換
===================== */

function blobToBase64(blob){

    return new Promise(
        (resolve, reject)=>{

        const reader =
        new FileReader();

        reader.onload =
        ()=>resolve(reader.result);

        reader.onerror =
        ()=>reject(
            new Error("FileReader error")
        );

        reader.readAsDataURL(blob);

    });

}

/* =====================
   base64 → Blob変換
===================== */

function base64ToBlob(dataUrl, type){

    const parts =
    dataUrl.split(",");

    const byteStr =
    atob(parts[1]);

    const ab =
    new ArrayBuffer(byteStr.length);

    const ia =
    new Uint8Array(ab);

    for(
        let i = 0;
        i < byteStr.length;
        i++
    ){

        ia[i] =
        byteStr.charCodeAt(i);

    }

    return new Blob(
        [ab],
        { type:type }
    );

}

/* =====================
   JSON出力
===================== */

async function exportData(){

    try{

        let attachments = [];

        try{

            attachments =
            await getAllAttachments();

        }
        catch(error){

            console.error(error);

        }

        const attachmentsExport =
        await Promise.all(

            attachments.map(async att=>{

                const copy = {};

                [
                    "id",
                    "date",
                    "title",
                    "name",
                    "type",
                    "size",
                    "createdAt"
                ].forEach(k=>{

                    if(att[k] !== undefined){

                        copy[k] = att[k];

                    }

                });

                const blob =
                att.file ||
                att.blob;

                if(
                    blob &&
                    blob instanceof Blob
                ){

                    try{

                        copy.fileData =
                        await blobToBase64(blob);

                    }
                    catch(e){

                        console.warn(
                            "変換失敗:",
                            att.name,
                            e
                        );

                    }

                }

                return copy;

            })

        );

        const backupData = {

            appData:
            appData,

            attachments:
            attachmentsExport,

            exportDate:
            new Date().toISOString()

        };

        const blob =
        new Blob(

            [
                JSON.stringify(
                    backupData,
                    null,
                    2
                )
            ],

            {
                type:
                "application/json"
            }

        );

        const url =
        URL.createObjectURL(blob);

        const a =
        document.createElement("a");

        a.href = url;

        a.download =
        `dailyhub_backup_${Date.now()}.json`;

        document.body.appendChild(a);

        a.click();

        a.remove();

        setTimeout(
            ()=>{
                URL.revokeObjectURL(url);
            },
            1000
        );

        alert(
            "バックアップ作成完了"
        );

    }
    catch(error){

        console.error(error);

        alert(
            "バックアップ失敗"
        );

    }

}

/* =====================
   JSON読込
===================== */

async function importData(){

    const input =
    document.getElementById(
        "importFile"
    );

    if(
        !input.files ||
        !input.files.length
    ){

        alert(
            "JSONファイルを選択してください"
        );

        return;

    }

    const file =
    input.files[0];

    const reader =
    new FileReader();

    reader.onload =
    async function(event){

        try{

            const backupData =
            JSON.parse(
                event.target.result
            );

            if(!backupData.appData){

                alert(
                    "不正なファイルです"
                );

                return;

            }

            const ok =
            confirm(
                "現在のデータを上書きしますか？"
            );

            if(!ok){

                return;

            }

            appData =
            backupData.appData;

            saveAll();

            await clearAttachmentsDB();

            const attachments =
            backupData.attachments || [];

            for(
                const att of attachments
            ){

                try{

                    const record =
                    Object.assign({}, att);

                    if(
                        att.fileData &&
                        typeof att.fileData === "string"
                    ){

                        record.file =
                        base64ToBlob(
                            att.fileData,
                            att.type
                        );

                        delete record.fileData;

                    }

                    if(record.file){

                        await restoreAttachmentRecord(
                            record
                        );

                    }

                }
                catch(e){

                    console.warn(
                        "復元失敗:",
                        att.name,
                        e
                    );

                }

            }

            alert(
                "復元完了"
            );

            location.reload();

        }
        catch(error){

            console.error(error);

            alert(
                "読込失敗"
            );

        }

    };

    reader.readAsText(file);

}
