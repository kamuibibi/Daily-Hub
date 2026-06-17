/* =====================
   Daily Hub Pro v3.0
   IndexedDB
===================== */

const DB_NAME = "DailyHubDB";
const DB_VERSION = 1;
const STORE_ATTACHMENTS = "attachments";

let db = null;

/* =====================
   DB初期化
===================== */

function openDatabase(){

    return new Promise(
        (resolve,reject)=>{

        const request =
        indexedDB.open(
            DB_NAME,
            DB_VERSION
        );

        request.onerror =
        function(){

            reject(
                request.error
            );
        };

        request.onsuccess =
        function(){

            db =
            request.result;

            resolve(db);
        };

        request.onupgradeneeded =
        function(event){

            const database =
            event.target.result;

            if(
                !database.objectStoreNames.contains(
                    STORE_ATTACHMENTS
                )
            ){

                const store =
                database.createObjectStore(
                    STORE_ATTACHMENTS,
                    {
                        keyPath:"id"
                    }
                );

                store.createIndex(
                    "date",
                    "date",
                    {
                        unique:false
                    }
                );

                store.createIndex(
                    "createdAt",
                    "createdAt",
                    {
                        unique:false
                    }
                );

            }

        };

    });

}

/* =====================
   UUID生成
===================== */

function createId(){

    return Date.now() +
    "_" +
    Math.random()
    .toString(36)
    .substring(2);

}

/* =====================
   添付保存
===================== */

async function saveAttachmentToDB(
    date,
    file,
    title
    
){

    if(!db){

        await openDatabase();
    }

    return new Promise(
        (resolve,reject)=>{

        const tx =
        db.transaction(
            STORE_ATTACHMENTS,
            "readwrite"
        );

        const store =
        tx.objectStore(
            STORE_ATTACHMENTS
        );

const record = {

    id:createId(),

    date:date,

    title:title,

    name:file.name,

    type:file.type,

    size:file.size,

    createdAt:
    Date.now(),

    file:file

};

        const request =
        store.add(record);

        request.onsuccess =
        ()=>resolve(record);

        request.onerror =
        ()=>reject(
            request.error
        );

    });

}

/* =====================
   日付取得
===================== */

async function getAttachmentsByDate(
    date
){

    if(!db){

        await openDatabase();
    }

    return new Promise(
        (resolve,reject)=>{

        const tx =
        db.transaction(
            STORE_ATTACHMENTS,
            "readonly"
        );

        const store =
        tx.objectStore(
            STORE_ATTACHMENTS
        );

        const index =
        store.index(
            "date"
        );

        const request =
        index.getAll(
            date
        );

        request.onsuccess =
        ()=>resolve(
            request.result
        );

        request.onerror =
        ()=>reject(
            request.error
        );

    });

}

/* =====================
   全件取得
===================== */

async function getAllAttachments(){

    if(!db){

        await openDatabase();
    }

    return new Promise(
        (resolve,reject)=>{

        const tx =
        db.transaction(
            STORE_ATTACHMENTS,
            "readonly"
        );

        const store =
        tx.objectStore(
            STORE_ATTACHMENTS
        );

        const request =
        store.getAll();

        request.onsuccess =
        ()=>resolve(
            request.result
        );

        request.onerror =
        ()=>reject(
            request.error
        );

    });

}

/* =====================
   1件取得
===================== */

async function getAttachmentById(
    id
){

    if(!db){

        await openDatabase();
    }

    return new Promise(
        (resolve,reject)=>{

        const tx =
        db.transaction(
            STORE_ATTACHMENTS,
            "readonly"
        );

        const store =
        tx.objectStore(
            STORE_ATTACHMENTS
        );

        const request =
        store.get(id);

        request.onsuccess =
        ()=>resolve(
            request.result
        );

        request.onerror =
        ()=>reject(
            request.error
        );

    });

}

/* =====================
   削除
===================== */

async function deleteAttachmentById(
    id
){

    if(!db){

        await openDatabase();
    }

    return new Promise(
        (resolve,reject)=>{

        const tx =
        db.transaction(
            STORE_ATTACHMENTS,
            "readwrite"
        );

        const store =
        tx.objectStore(
            STORE_ATTACHMENTS
        );

        const request =
        store.delete(id);

        request.onsuccess =
        ()=>resolve();

        request.onerror =
        ()=>reject(
            request.error
        );

    });

}

/* =====================
   容量計算
===================== */

async function getTotalStorageSize(){

    const files =
    await getAllAttachments();

    let total = 0;

    files.forEach(file=>{

        total +=
        file.size || 0;

    });

    return total;

}

/* =====================
   バイト変換
===================== */

function formatBytes(
    bytes
){

    if(bytes === 0){

        return "0 B";
    }

    const k = 1024;

    const sizes = [

        "B",
        "KB",
        "MB",
        "GB",
        "TB"

    ];

    const i =
    Math.floor(
        Math.log(bytes) /
        Math.log(k)
    );

    return (
        bytes /
        Math.pow(k,i)
    ).toFixed(2)
    + " "
    + sizes[i];

}

/* =====================
   全削除
===================== */

async function clearAttachmentsDB(){

    if(!db){

        await openDatabase();
    }

    return new Promise(
        (resolve,reject)=>{

        const tx =
        db.transaction(
            STORE_ATTACHMENTS,
            "readwrite"
        );

        const store =
        tx.objectStore(
            STORE_ATTACHMENTS
        );

        const request =
        store.clear();

        request.onsuccess =
        ()=>resolve();

        request.onerror =
        ()=>reject(
            request.error
        );

    });

}

/* =====================
   バックアップ用直接保存
===================== */

async function restoreAttachmentRecord(record){

    if(!db){

        await openDatabase();

    }

    return new Promise(
        (resolve,reject)=>{

        const tx =
        db.transaction(
            STORE_ATTACHMENTS,
            "readwrite"
        );

        const store =
        tx.objectStore(
            STORE_ATTACHMENTS
        );

        const request =
        store.put(record);

        request.onsuccess =
        ()=>resolve();

        request.onerror =
        ()=>reject(
            request.error
        );

    });

}

/* =====================
   起動時
===================== */

openDatabase()
.then(()=>{

    console.log(
        "IndexedDB Ready"
    );

})
.catch(err=>{

    console.error(
        err
    );

});