<script lang="ts">
  import "../styles/styles.css";

  import { onMount } from "svelte";
  import CommandPalette from "../components/command-palette.svelte";
  import RecentFiles from "../components/recentfilesmenu.svelte";
  import Workspace from "../components/workspace.svelte";
  import TitleBar from "../components/titlebar.svelte";
  import HomeHotkeys from "../components/home-hotkeys.svelte";
  import DocumentService from "../services/document.service";
  import Sidebar from "../components/sidebar.svelte";
  import { listen } from "@tauri-apps/api/event";
  import { invoke } from "@tauri-apps/api/core";

  type Appdata = {
    counter: number;
  };

  let counter = $state(0);

  function handleIncrement() {
    invoke("increment_counter");
  }

  onMount(() => {
    // TabsStore.initTabsStore();
    // Listen for the 'counter-updated' event from the backend
    const unlisten = listen<number>("counter-updated", (event) => {
      // Update the Svelte store with the new counter value
      counter = event.payload;
    });
    DocumentService.loadRecentDocuments();
    return () => {
      unlisten.then((unsub) => unsub());
    };
  });
</script>

<main class="flex flex-col h-lvh">
  <TitleBar />
  <div class="flex items-stretch grow overflow-hidden">
    <!-- <Sidebar />
    <Workspace /> -->
    <p class="text-text">Counter Value: {counter}</p>
    <button onclick={handleIncrement} class="text-text">Increment</button>
  </div>
  <!-- <HomeHotkeys />
  <CommandPalette />
  <RecentFiles /> -->
</main>
