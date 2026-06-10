/* =====================
   Daily Hub Pro v3.0
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

            console.error(
                error
            );

        }

        const backupData = {

            appData:
            appData,

            attachments:
            attachments,

            exportDate:
            new Date()
            .toISOString()

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
        URL.createObjectURL(
            blob
        );

        const a =
        document.createElement(
            "a"
        );

        a.href = url;

        a.download =
        `dailyhub_backup_${
            Date.now()
        }.json`;

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

        alert(
            "バックアップ作成完了"
        );

    }

    catch(error){

        console.error(
            error
        );

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

            if(
                !backupData.appData
            ){

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

            alert(
                "復元完了"
            );

            location.reload();

        }

        catch(error){

            console.error(
                error
            );

            alert(
                "読込失敗"
            );

        }

    };

    reader.readAsText(
        file
    );

}