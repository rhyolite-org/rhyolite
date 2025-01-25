<script lang="ts">
  import { EditorState } from "@codemirror/state";
  import { EditorView, keymap } from "@codemirror/view";
  import { defaultKeymap } from "@codemirror/commands";
  import { minimalSetup } from "codemirror";
  import {
    markdown,
    commonmarkLanguage,
    markdownLanguage,
  } from "@codemirror/lang-markdown";
  import { languages } from "@codemirror/language-data";
  import {
    defaultHighlightStyle,
    HighlightStyle,
    indentOnInput,
    syntaxHighlighting,
  } from "@codemirror/language";
  import { tags } from "@lezer/highlight";
  import type { MarkdownConfig } from "@lezer/markdown";
  import { autocompletion } from "@codemirror/autocomplete";
  import { history, historyKeymap } from "@codemirror/commands";
  import { StateEffect, StateField } from "@codemirror/state";
  import { Decoration, ViewPlugin, WidgetType } from "@codemirror/view";
  import type { DecorationSet } from "@codemirror/view";
  import { onMount } from "svelte";
  import { marked } from "marked";
  import {
    customTheme,
    activeLinePlugin,
    customHighlightStyle,
  } from "./cm-extentions";

  let editorContainer: HTMLElement;
  let view: EditorView;

  onMount(() => {
    view = new EditorView({
      extensions: [
        activeLinePlugin,
        minimalSetup,
        history(),
        markdown({
          codeLanguages: languages,
          base: markdownLanguage,
          completeHTMLTags: true,
          addKeymap: true,
        }),
        EditorView.lineWrapping,
        syntaxHighlighting(customHighlightStyle),
        // syntaxHighlighting,
        customTheme,
        // autocompletion(),
      ],
      parent: editorContainer,
    });

    return () => {
      view.destroy();
    };
  });
</script>

<main>
  <div bind:this={editorContainer} class="w-full h-full m-5 text-text"></div>
</main>
