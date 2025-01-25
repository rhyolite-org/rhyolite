// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use indexmap::IndexMap;
use once_cell::sync::Lazy;
use serde::{Deserialize, Serialize};
use std::{collections::HashMap, sync::Mutex};
use tauri::{State, WindowEvent};
use tauri::{AppHandle, Builder, Emitter, Manager};
mod editor;

#[derive(Default)]
struct AppStateInner {
    counter: u32,
}
type AppState = Mutex<AppStateInner>;

///DocumentData struct, datatype that stores id, title and content of the document.
#[derive(Serialize, Deserialize, Clone)]
pub struct DocumentData {
    id: String,
    title: String,
    content: String,
}

///Tab struct, used to store order(index of the tab), id of the document and title of the document.
#[derive(Serialize, Deserialize, Clone)]
pub struct Tab {
    id: String,
    title: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct RecentFileInfo {
    pub id: String,
    pub title: String,
}

///Userdata Struct, used to store the userdata, like last open tab and all the open tabs.
#[derive(Serialize, Deserialize, Clone)]
pub struct UserData {
    tabs: Vec<Tab>,
    last_open_tab: String,
    recent_files: Vec<RecentFileInfo>,
}

//Mutex Variable declarations:-
///A Vector data type to store all the tabs in ascending order(depending upon the order value of the Tab):
pub static TABS: Lazy<Mutex<IndexMap<String, Tab>>> = Lazy::new(|| Mutex::new(IndexMap::new()));
pub static ID_TO_PATH: Lazy<Mutex<HashMap<String, String>>> =
    Lazy::new(|| Mutex::new(HashMap::new()));
///A String that stores the id of the current open tab in the editor:
pub static CURRENT_OPEN_TAB: Lazy<Mutex<String>> = Lazy::new(|| Mutex::new("".to_string()));
pub static RECENT_FILES: Lazy<Mutex<Vec<RecentFileInfo>>> = Lazy::new(|| Mutex::new(Vec::new()));

fn update_counter(app: AppHandle, new_value: u32) {
    // Update the counter value in your application state
    // For example:
    // app_handle.state::<AppState>().lock().unwrap().counter = new_value;

    // Emit the 'counter-updated' event with the new counter value
    app.emit("counter-updated", new_value).unwrap();
}

#[tauri::command]
fn increment_counter(app: AppHandle, state: State<'_, AppState>) {
    let mut state = state.lock().unwrap();
    state.counter += 1;
    app.emit("counter-updated", state.counter).unwrap();
}

//Main tauri function.
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .on_window_event(|window, event| {
            if let WindowEvent::CloseRequested { .. } = event {
                // Call the function to save UserData when the app is closing
                editor::io::on_app_close();

                // Prevent the window from closing immediately
                #[cfg(not(target_os = "android"))]
                window.close().unwrap();
            }
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            increment_counter,
            editor::io::save_document,
            editor::io::load_last_open_tabs,
            editor::io::delete_document,
            editor::io::get_document_content,
            editor::io::get_recent_files_metadata,
            editor::tabs::new_tab,
            editor::tabs::load_tab,
            editor::tabs::delete_tab,
            editor::tabs::get_tabs,
            editor::tabs::send_current_open_tab,
            editor::tabs::get_current_open_tab,
            editor::tabs::update_tab_title,
            editor::tabs::cycle_tabs,
            editor::tabs::close_tab
        ])
        .setup(|app| {
            app.manage(AppState::default());
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
