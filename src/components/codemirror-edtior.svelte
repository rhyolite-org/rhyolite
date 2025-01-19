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
  import { autocompletion } from "@codemirror/autocomplete";
  import { history, historyKeymap } from "@codemirror/commands";
  import { onMount } from "svelte";
  import { marked } from "marked";

  let editorContainer: HTMLElement;
  let view: EditorView;

  const initial_text = "Welcome to Rhyolite!";

  const customHighlightStyle = HighlightStyle.define([
    {
      tag: tags.heading1,
      fontSize: "2em",
      fontWeight: "bold",
    },
    {
      tag: tags.heading2,
      fontSize: "1.8em",
      fontWeight: "bold",
    },
    {
      tag: tags.heading3,
      fontSize: "1.6em",
      fontWeight: "bold",
    },
    {
      tag: tags.heading4,
      fontSize: "1.4em",
      fontWeight: "bold",
    },
    {
      tag: tags.heading5,
      fontSize: "1.2em",
      fontWeight: "bold",
    },
    {
      tag: tags.heading6,
      fontSize: "1em",
      fontWeight: "bold",
    },
    {
      tag: tags.emphasis,
      // color: "#666666",
      fontStyle: "italic",
    },
    {
      tag: tags.strong,
      // color: "#666666",
      fontStyle: "bold",
    },
  ]);

  const customTheme = EditorView.theme({
    ".cm-cursor": { borderLeftColor: "rgb(var(--color-text))" },
    "&.cm-focused .cm-cursor": { borderLeftColor: "rgb(var(--color-text))" },
  });

  const markdownStyles = EditorView.baseTheme({
    ".cm-formatting-header, .cm-formatting-strong, .cm-formatting-em": {
      display: "none"
    },
    ".cm-active .cm-formatting-header, .cm-active .cm-formatting-strong, .cm-active .cm-formatting-em, &:hover .cm-formatting-header, &:hover .cm-formatting-strong, &:hover .cm-formatting-em": {
      display: "inline"
    }
  });

  onMount(() => {
    view = new EditorView({
      doc: initial_text,
      extensions: [
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
        markdownStyles,
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