use crate::{
    app_state::{AppState, Tab},
    editor::tabs::{TabCommands, update_tabs_state},
};
use tauri::{AppHandle, Manager};

impl TabCommands {
    pub async fn load_tab(app: AppHandle, payload: Option<String>) {
        log::debug!("load_tab init");
        let Some(payload) = payload else {
            log::warn!("Invalid call to load_tab");
            return;
        };
        if let Ok(json_value) = serde_json::from_str::<Tab>(&payload) {
            {
                let temp_app = app.clone();
                let state = temp_app.state::<AppState>();
                let id = json_value.id;
                let title = json_value.title;
                let new_tab = Tab {
                    id: id.clone(),
                    title: title.clone(),
                };

                let mut tab_switcher = state.tab_switcher.write().await;
                tab_switcher.tabs.insert(id.clone(), new_tab.clone());

                tab_switcher.current_tab_id = Some(id);
            }

            update_tabs_state(app).await;
        }
    }
}
