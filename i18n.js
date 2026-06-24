/* =====================
   Daily Hub Pro
   i18n / Language
===================== */

const LANG_KEY =
"dailyhub_lang";

const TRANSLATIONS = {

ja: {

    "app.title": "Daily Hub Pro",
    "home.search_placeholder": "検索",
    "home.search_btn": "🔍 検索",
    "home.today_btn": "今日",
    "home.date_unselected": "日付未選択",
    "home.memo_title": "📝 メモ",
    "home.memo_placeholder": "メモを入力",
    "home.tag_select": "タグ選択",
    "home.task_title": "✅ タスク",
    "home.task_placeholder": "タスク入力",
    "home.task_add_btn": "追加",
    "home.reminder_label": "⏰ リマインダー",
    "home.repeat_label": "🔁 繰り返し",
    "home.repeat_none": "なし",
    "home.repeat_daily": "毎日",
    "home.repeat_weekly": "毎週",
    "home.repeat_monthly": "毎月",
    "home.attach_title": "📎 添付",
    "home.attach_save_btn": "添付保存",

    "menu.memo_list": "📝 メモ一覧",
    "menu.task_list": "✅ タスク一覧",
    "menu.attach_list": "📎 添付一覧",
    "menu.settings": "⚙️ 設定",
    "menu.trash": "🗑️ ゴミ箱",

    "stat.memo": "メモ",
    "stat.task": "タスク",
    "stat.attach": "添付",
    "stat.storage": "容量",

    "nav.back_home": "← ホーム",

    "page.memo_list": "メモ一覧",
    "page.task_list": "タスク一覧",
    "page.attach_list": "添付一覧",
    "page.stats": "統計",
    "page.backup": "バックアップ",
    "page.settings": "⚙️ 設定",
    "page.trash": "🗑️ ゴミ箱",

    "backup.export_title": "📤 エクスポート",
    "backup.export_note": "現在のデータをJSONファイルとして保存します。",
    "backup.export_btn": "JSON出力",
    "backup.import_title": "📥 インポート",
    "backup.import_note": "ブラウザやデバイスを変える際は、エクスポートしたJSONファイルをここから読み込んでください。",
    "backup.import_btn": "JSON読込",
    "backup.warning": "⚠️ ブラウザが異なるとデータは共有されません。<br>Chrome → Safari など環境を変える場合は、必ずエクスポート → インポートでデータを移行してください。",

    "settings.repeat_title": "🔁 繰り返しタスク",
    "settings.tag_title": "🏷️ タグ管理",
    "settings.tag_placeholder": "タグ名",
    "settings.tag_add_btn": "追加",
    "settings.tag_registered": "登録済みタグ",
    "settings.task_tag_title": "📝 タスク化メモ",
    "settings.task_tag_note": "このタグを含むメモ行は自動的にタスクに変換されます。",
    "settings.task_tag_placeholder": "タスク化タグ（例:【タスク】）",
    "settings.task_complete_title": "✅ タスク完了動作",
    "settings.strike_btn": "取り消し線のみ",
    "settings.auto_delete_btn": "取り消し線→2秒後に削除",
    "settings.passcode_title": "🔒 パスコード",
    "settings.passcode_btn": "設定",
    "settings.notif_title": "🔔 通知",
    "settings.notif_btn": "通知を許可する",
    "settings.theme_title": "🎨 テーマ",
    "settings.light_btn": "ライトモード",
    "settings.dark_btn": "ダークモード",
    "settings.update_title": "🔄 アップデート",
    "settings.update_note": "キャッシュを削除して最新版を読み込みます",
    "settings.update_btn": "🗑️ キャッシュ削除 & 再起動",
    "settings.stats_title": "📊 統計",
    "settings.stats_btn": "統計を開く",
    "settings.backup_title": "💾 バックアップ",
    "settings.backup_btn": "バックアップを開く",
    "settings.info_title": "ℹ️ アプリ情報",
    "settings.info_version": "Daily Hub Pro v3.1",
    "settings.data_title": "🗑️ データ管理",
    "settings.clear_data_btn": "全データ削除",
    "settings.lang_title": "🌐 言語 / Language",
    "settings.lang_ja_btn": "日本語",
    "settings.lang_en_btn": "English",

    "trash.empty": "ゴミ箱は空です",
    "trash.clear_btn": "🗑️ ゴミ箱を空にする",
    "trash.task_badge": "✅ タスク",
    "trash.attach_badge": "📎 添付",
    "trash.restore_btn": "↩ 元に戻す",
    "trash.delete_btn": "完全削除",
    "trash.deleted_just_now": "たった今削除",
    "trash.deleted_minutes": "{n}分前に削除",
    "trash.deleted_hours": "{n}時間前に削除",
    "trash.deleted_days": "{n}日前に削除",

    "task.no_tasks": "タスクなし",
    "task.no_tasks_list": "タスクはありません",
    "task.delete_btn": "削除",
    "task.from_memo_badge": "📝 メモ",

    "memo.no_memos": "メモはありません",
    "memo.read_more": "続きを読む",
    "memo.close": "閉じる",

    "repeat.daily": "毎日",
    "repeat.weekly": "毎週",
    "repeat.monthly": "毎月",
    "repeat.empty": "繰り返しタスクはありません",
    "repeat.delete_btn": "削除",

    "tag.edit_btn": "編集",
    "tag.delete_btn": "削除",
    "tag.no_tags": "タグなし",

    "cal.sun": "日",
    "cal.mon": "月",
    "cal.tue": "火",
    "cal.wed": "水",
    "cal.thu": "木",
    "cal.fri": "金",
    "cal.sat": "土",

    "alert.select_date": "日付を選択してください",
    "alert.enter_tag": "タグ名を入力してください",
    "alert.backup_done": "バックアップ作成完了",
    "alert.backup_fail": "バックアップ失敗",
    "alert.select_json": "JSONファイルを選択してください",
    "alert.invalid_file": "不正なファイルです",
    "alert.restore_done": "復元完了",
    "alert.restore_fail": "読込失敗",
    "alert.clear_done": "削除完了",
    "alert.passcode_set": "パスコードを設定しました",
    "alert.passcode_removed": "パスコードを解除しました",

    "confirm.overwrite": "現在のデータを上書きしますか？",
    "confirm.delete_repeat": "この繰り返しタスクを削除しますか？\n今後生成されなくなります。",
    "confirm.clear_all": "全データを削除しますか？",
    "confirm.clear_trash": "ゴミ箱を空にしますか？",
    "confirm.clear_cache": "キャッシュを削除して再起動しますか？\n修正が反映されない場合に使用してください。",
    "confirm.delete": "削除しますか？",
    "confirm.reset_passcode": "パスコードを含む設定をリセットします。\nメモ・タスクのデータは保持されます。\n続けますか？",

    "prompt.edit_tag": "変更後タグ",
    "prompt.passcode_set": "新しいパスコードを入力\n（空白のままOKで解除）",
    "prompt.passcode_set_prefix": "現在設定済み。\n",
    "prompt.passcode_notset_prefix": "現在未設定。\n",

    "search.enter_keyword": "検索文字を入力してください",
    "search.searching": "検索中...",
    "search.results": "検索結果: {n}件",
    "search.no_results": "検索結果なし",
    "search.no_date": "日付なし",
    "search.memo_label": "メモ",
    "search.task_label": "タスク",
    "search.task_done": "完了",
    "search.task_undone": "未完了",
    "search.attach_label": "添付",
    "search.download_btn": "ダウンロード",

    "stats.storage_api_title": "ストレージ使用状況",
    "stats.storage_api_used": "使用中",
    "stats.storage_api_percent": "使用率",
    "stats.storage_api_unavailable": "このブラウザはStorage APIに非対応です"

},

en: {

    "app.title": "Daily Hub Pro",
    "home.search_placeholder": "Search",
    "home.search_btn": "🔍 Search",
    "home.today_btn": "Today",
    "home.date_unselected": "No date selected",
    "home.memo_title": "📝 Memo",
    "home.memo_placeholder": "Enter memo",
    "home.tag_select": "Select tag",
    "home.task_title": "✅ Tasks",
    "home.task_placeholder": "Enter task",
    "home.task_add_btn": "Add",
    "home.reminder_label": "⏰ Reminder",
    "home.repeat_label": "🔁 Repeat",
    "home.repeat_none": "None",
    "home.repeat_daily": "Daily",
    "home.repeat_weekly": "Weekly",
    "home.repeat_monthly": "Monthly",
    "home.attach_title": "📎 Attachments",
    "home.attach_save_btn": "Save attachment",

    "menu.memo_list": "📝 Memos",
    "menu.task_list": "✅ Tasks",
    "menu.attach_list": "📎 Attachments",
    "menu.settings": "⚙️ Settings",
    "menu.trash": "🗑️ Trash",

    "stat.memo": "Memos",
    "stat.task": "Tasks",
    "stat.attach": "Files",
    "stat.storage": "Storage",

    "nav.back_home": "← Home",

    "page.memo_list": "Memo List",
    "page.task_list": "Task List",
    "page.attach_list": "Attachment List",
    "page.stats": "Statistics",
    "page.backup": "Backup",
    "page.settings": "⚙️ Settings",
    "page.trash": "🗑️ Trash",

    "backup.export_title": "📤 Export",
    "backup.export_note": "Save current data as a JSON file.",
    "backup.export_btn": "Export JSON",
    "backup.import_title": "📥 Import",
    "backup.import_note": "When switching browsers or devices, import the exported JSON file here.",
    "backup.import_btn": "Import JSON",
    "backup.warning": "⚠️ Data is not shared between different browsers.<br>When switching environments (e.g., Chrome → Safari), always export then import your data.",

    "settings.repeat_title": "🔁 Repeat Tasks",
    "settings.tag_title": "🏷️ Tags",
    "settings.tag_placeholder": "Tag name",
    "settings.tag_add_btn": "Add",
    "settings.tag_registered": "Registered Tags",
    "settings.task_tag_title": "📝 Memo to Task",
    "settings.task_tag_note": "Memo lines containing this tag will be automatically converted to tasks.",
    "settings.task_tag_placeholder": "Task tag (e.g. [Task])",
    "settings.task_complete_title": "✅ Task Complete Action",
    "settings.strike_btn": "Strikethrough only",
    "settings.auto_delete_btn": "Strike → delete after 2s",
    "settings.passcode_title": "🔒 Passcode",
    "settings.passcode_btn": "Set",
    "settings.notif_title": "🔔 Notifications",
    "settings.notif_btn": "Allow notifications",
    "settings.theme_title": "🎨 Theme",
    "settings.light_btn": "Light mode",
    "settings.dark_btn": "Dark mode",
    "settings.update_title": "🔄 Update",
    "settings.update_note": "Clear cache and reload the latest version",
    "settings.update_btn": "🗑️ Clear cache & restart",
    "settings.stats_title": "📊 Statistics",
    "settings.stats_btn": "Open statistics",
    "settings.backup_title": "💾 Backup",
    "settings.backup_btn": "Open backup",
    "settings.info_title": "ℹ️ App Info",
    "settings.info_version": "Daily Hub Pro v3.1",
    "settings.data_title": "🗑️ Data Management",
    "settings.clear_data_btn": "Delete all data",
    "settings.lang_title": "🌐 Language",
    "settings.lang_ja_btn": "日本語",
    "settings.lang_en_btn": "English",

    "trash.empty": "Trash is empty",
    "trash.clear_btn": "🗑️ Empty trash",
    "trash.task_badge": "✅ Task",
    "trash.attach_badge": "📎 Attachment",
    "trash.restore_btn": "↩ Restore",
    "trash.delete_btn": "Delete",
    "trash.deleted_just_now": "Just deleted",
    "trash.deleted_minutes": "{n}m ago",
    "trash.deleted_hours": "{n}h ago",
    "trash.deleted_days": "{n}d ago",

    "task.no_tasks": "No tasks",
    "task.no_tasks_list": "No tasks",
    "task.delete_btn": "Delete",
    "task.from_memo_badge": "📝 Memo",

    "memo.no_memos": "No memos",
    "memo.read_more": "Read more",
    "memo.close": "Close",

    "repeat.daily": "Daily",
    "repeat.weekly": "Weekly",
    "repeat.monthly": "Monthly",
    "repeat.empty": "No repeat tasks",
    "repeat.delete_btn": "Delete",

    "tag.edit_btn": "Edit",
    "tag.delete_btn": "Delete",
    "tag.no_tags": "No tags",

    "cal.sun": "Sun",
    "cal.mon": "Mon",
    "cal.tue": "Tue",
    "cal.wed": "Wed",
    "cal.thu": "Thu",
    "cal.fri": "Fri",
    "cal.sat": "Sat",

    "alert.select_date": "Please select a date",
    "alert.enter_tag": "Please enter a tag name",
    "alert.backup_done": "Backup complete",
    "alert.backup_fail": "Backup failed",
    "alert.select_json": "Please select a JSON file",
    "alert.invalid_file": "Invalid file",
    "alert.restore_done": "Restore complete",
    "alert.restore_fail": "Load failed",
    "alert.clear_done": "Deleted",
    "alert.passcode_set": "Passcode set",
    "alert.passcode_removed": "Passcode removed",

    "confirm.overwrite": "Overwrite current data?",
    "confirm.delete_repeat": "Delete this repeat task?\nIt will no longer be generated.",
    "confirm.clear_all": "Delete all data?",
    "confirm.clear_trash": "Empty the trash?",
    "confirm.clear_cache": "Clear cache and restart?\nUse this if updates are not reflected.",
    "confirm.delete": "Delete?",
    "confirm.reset_passcode": "This will reset settings including the passcode.\nMemo and task data will be preserved.\nContinue?",

    "prompt.edit_tag": "New tag name",
    "prompt.passcode_set": "Enter new passcode\n(leave empty and OK to remove)",
    "prompt.passcode_set_prefix": "Currently set.\n",
    "prompt.passcode_notset_prefix": "Not set.\n",

    "search.enter_keyword": "Please enter search text",
    "search.searching": "Searching...",
    "search.results": "Results: {n}",
    "search.no_results": "No results",
    "search.no_date": "No date",
    "search.memo_label": "Memo",
    "search.task_label": "Task",
    "search.task_done": "Done",
    "search.task_undone": "Not done",
    "search.attach_label": "Attachment",
    "search.download_btn": "Download",

    "stats.storage_api_title": "Storage Usage",
    "stats.storage_api_used": "Used",
    "stats.storage_api_percent": "Usage rate",
    "stats.storage_api_unavailable": "Storage API not supported in this browser"

}

};

/* =====================
   現在の言語取得
===================== */

function getLang(){

    if(
        typeof settings !== "undefined" &&
        settings.lang
    ){
        return settings.lang;
    }

    return "ja";

}

/* =====================
   翻訳関数
===================== */

function t(key, params){

    const lang =
    getLang();

    const dict =
    TRANSLATIONS[lang] ||
    TRANSLATIONS["ja"];

    let str =
    dict[key] ||
    TRANSLATIONS["ja"][key] ||
    key;

    if(params){

        Object.keys(params).forEach(k=>{

            str = str.replace(
                "{" + k + "}",
                params[k]
            );

        });

    }

    return str;

}

/* =====================
   静的テキスト一括適用
===================== */

function applyTranslations(){

    document
    .querySelectorAll("[data-i18n]")
    .forEach(el=>{

        el.textContent =
        t(el.getAttribute("data-i18n"));

    });

    document
    .querySelectorAll("[data-i18n-placeholder]")
    .forEach(el=>{

        el.placeholder =
        t(el.getAttribute(
            "data-i18n-placeholder"
        ));

    });

    document
    .querySelectorAll("[data-i18n-html]")
    .forEach(el=>{

        el.innerHTML =
        t(el.getAttribute("data-i18n-html"));

    });

}

/* =====================
   言語切替
===================== */

function setLang(lang){

    if(typeof settings !== "undefined"){

        settings.lang = lang;

        saveSettings();

    }

    applyTranslations();

    renderLangSetting();

    renderRepeatList();

    renderTagList();

    renderTaskTagList();

    renderTaskCompleteActionSetting();

    renderCalendar();

    renderTaskArea();

    renderMemoTags();

}

/* =====================
   言語ボタン状態
===================== */

function renderLangSetting(){

    const jaBtn =
    document.getElementById(
        "langJaBtn"
    );

    const enBtn =
    document.getElementById(
        "langEnBtn"
    );

    if(!jaBtn || !enBtn){

        return;

    }

    const lang = getLang();

    const isLight =
    typeof settings !== "undefined" &&
    settings.theme === "light";

    const inactiveColor =
    isLight ? "#cccccc" : "#555";

    jaBtn.style.background =
    lang === "ja" ? "#007aff" : inactiveColor;

    enBtn.style.background =
    lang === "en" ? "#007aff" : inactiveColor;

    jaBtn.style.color =
    lang === "ja"
    ? "#fff"
    : (isLight ? "#111" : "#fff");

    enBtn.style.color =
    lang === "en"
    ? "#fff"
    : (isLight ? "#111" : "#fff");

}
