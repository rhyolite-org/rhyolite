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

const customHighlightStyle = HighlightStyle.define([
  {
    tag: tags.heading1,
    fontSize: "2.8em",
    fontWeight: "bold",
  },
  {
    tag: tags.heading2,
    fontSize: "2.4em",
    fontWeight: "bold",
  },
  {
    tag: tags.heading3,
    fontSize: "2em",
    fontWeight: "bold",
  },
  {
    tag: tags.heading4,
    fontSize: "1.6em",
    fontWeight: "bold",
  },
  {
    tag: tags.heading5,
    fontSize: "1.4em",
    fontWeight: "bold",
  },
  {
    tag: tags.heading6,
    fontSize: "1.2em",
    fontWeight: "bold",
  },
  {
    tag: tags.emphasis,
    // color: "#666666",
    fontStyle: "italic",
  },
  {
    tag: tags.processingInstruction, // Handles #, >, etc.
    color: "#888888",
  },
  {
    tag: tags.strong,
    fontWeight: "bold",
  },
  {
    tag: tags.strikethrough, // Strikethrough text
    textDecoration: "line-through",
    color: "#888888",
  },
  {
    tag: tags.quote, // Blockquotes
    color: "#666666",
    borderLeft: "4px solid #888888",
    paddingLeft: "0.5em",
    fontStyle: "italic",
  },
]);

const customTheme = EditorView.theme({
  ".cm-cursor": { borderLeftColor: "rgb(var(--color-text))" },
  "&.cm-focused .cm-cursor": { borderLeftColor: "rgb(var(--color-text))" },
});

const activeLineDecoration = Decoration.line({
  attributes: { class: "cm-active-line" },
  // Optional: add some custom styling
});

const activeLinePlugin = ViewPlugin.fromClass(
  class {
    decorations;

    constructor(view: any) {
      this.decorations = this.getDecorations(view);
    }

    update(update: any) {
      if (update.docChanged || update.selectionSet) {
        this.decorations = this.getDecorations(update.view);
      }
    }

    getDecorations(view: any) {
      const { state } = view;
      const cursorPos = state.selection.main.head;
      const line = state.doc.lineAt(cursorPos);
      return Decoration.set([activeLineDecoration.range(line.from)]);
    }
  },
  {
    decorations: (v) => v.decorations,
  },
);

export { customTheme, customHighlightStyle, activeLinePlugin };
