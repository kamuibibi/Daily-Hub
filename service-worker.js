/* =====================
   Daily Hub Pro v3.1
   Service Worker
===================== */

const CACHE_NAME =
"dailyhub-v17";

const ASSETS = [
    "./",
    "./index.html",
    "./style.css",
    "./js/app.js",
    "./js/db.js",
    "./js/calendar.js",
    "./js/memo.js",
    "./js/task.js",
    "./js/attachment.js",
    "./js/search.js",
    "./js/stats.js",
    "./js/backup.js",
    "./js/settings.js",
    "./js/i18n.js",
    "./js/reminder.js",
    "./js/repeat.js",
    "./js/trash.js",
    "./manifest.json",
    "./icon.svg"
];

/* =====================
   インストール時キャッシュ
===================== */

self.addEventListener(
    "install",
    event=>{

        event.waitUntil(

            caches.open(CACHE_NAME).then(cache=>{

                return cache.addAll(ASSETS);

            })

        );

        self.skipWaiting();

    }
);

/* =====================
   古いキャッシュ削除
===================== */

self.addEventListener(
    "activate",
    event=>{

        event.waitUntil(

            caches.keys().then(keys=>{

                return Promise.all(

                    keys
                    .filter(k=> k !== CACHE_NAME)
                    .map(k=> caches.delete(k))

                );

            })

        );

        self.clients.claim();

    }
);

/* =====================
   オフライン対応
===================== */

self.addEventListener(
    "fetch",
    event=>{

        event.respondWith(

            fetch(event.request)
            .then(response=>{

                const clone =
                response.clone();

                caches.open(
                    CACHE_NAME
                ).then(cache=>{

                    cache.put(
                        event.request,
                        clone
                    );

                });

                return response;

            })
            .catch(()=>{

                return caches.match(
                    event.request
                );

            })

        );

    }
);

/* =====================
   プッシュ通知受信
===================== */

self.addEventListener(
    "push",
    event=>{

        const data =
        event.data
        ? event.data.json()
        : {};

        const title =
        data.title ||
        "Daily Hub Pro";

        const options = {

            body:
            data.body || "",

            tag:
            data.tag || "reminder",

            requireInteraction:
            false

        };

        event.waitUntil(

            self.registration.showNotification(
                title,
                options
            )

        );

    }
);

/* =====================
   通知タップ時
===================== */

self.addEventListener(
    "notificationclick",
    event=>{

        event.notification.close();

        event.waitUntil(

            clients.matchAll({
                type: "window"
            }).then(clientList=>{

                for(const client of clientList){

                    if(
                        client.url &&
                        "focus" in client
                    ){

                        return client.focus();

                    }

                }

                if(clients.openWindow){

                    return clients.openWindow("./");

                }

            })

        );

    }
);
