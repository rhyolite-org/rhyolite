import type { Tab } from "../types/tab";
import tabsStore from "../stores/tabs.store";
import { ApiProvider } from "./api.service";
import TabService from "./tab.service";
import type { Document } from "../types/document";
import { isValidJSON } from "../helpers/common.helper";

const apiProvider = new ApiProvider();

const getAllDocumentTabs = async (): Promise<Tab[]> => {
  const tabs: Tab[] = await apiProvider.getAllDocumentTabs();
  return tabsStore.updateTabsState(tabs);
};

export const addNewDocumentTab = async (): Promise<void> => {
  try {

    const newTab: Tab = await apiProvider.addNewDocumentTab();
    tabsStore.updateCurrentTabState(newTab);

    let tabs: Tab[] = await getAllDocumentTabs();
    tabsStore.updateTabsState(tabs);

    await apiProvider.sendCurrentOpenTab(newTab.id);
  } catch (error) {
    console.error("Failed to create new document:", error);
  }
};

const deleteDocumentTab = async (): Promise<void> => {
  try {
    const currentTab: Tab | null = tabsStore.getCurrentTabState();
    if (currentTab === null) return;

    await apiProvider.deleteDocument(currentTab.id);
    const tabs = await getAllDocumentTabs();
    tabsStore.updateTabsState(tabs);

    if (tabs.length > 0) {
      const lastTab = tabs[tabs.length - 1];
      tabsStore.updateCurrentTabState(lastTab);
    } else {
      await addNewDocumentTab();
    }
  } catch (error) {
    console.error("Failed to delete document:", error);
  }
};

const loadRecentDocuments = async (): Promise<void> => {
  try {
    const docs: Document[] = await apiProvider.getLastOpenedTabs();

    if (docs.length > 0) {
      // await apiProvider.resetTabsOrderCount();

      // Load each document as a tab
      for (const doc of docs) {
        await apiProvider.loadTab({
          documentId: doc.id,
          documentTitle: doc.title,
        });
      }

      // Update the tabs in UI
      await getAllDocumentTabs();

      // Load the last open document into the editor
      const open_tab: string = await apiProvider.getCurrentOpenTab();
      await TabService.switchTab(open_tab);
    } else {
      // If no documents exist, create a new tab
      await addNewDocumentTab();
    }
  } catch (error) {
    console.error("Failed to load documents:", error);
  }
};

const saveDocument = async ({
  documentId,
  documentTitle,
  documentContent,
}: {
  documentId: string;
  documentTitle: string;
  documentContent: any;
}): Promise<void> => {
  await apiProvider.saveDocument({
    documentId,
    documentTitle,
    documentContent: documentContent || "",
  });
};

const loadDocument = async (
  documentId: string,
  documentTitle: string,
): Promise<Document | null> => {
  try {
    const doc = await apiProvider.getDocumentContent(documentId, documentTitle);
    if (!doc) return null;

    return doc;
  } catch (error) {
    console.error("Failed to load document:", error);
    return null;
  }
};

export default {
  getAllDocumentTabs,
  addNewDocumentTab,
  deleteDocumentTab,
  loadRecentDocuments,
  saveDocument,
  loadDocument,
};
