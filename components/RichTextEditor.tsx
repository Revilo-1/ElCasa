"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { useEffect } from "react";

// ─── Toolbar-knap ─────────────────────────────────────────────────────────────

function ToolbarBtn({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      title={title}
      className={`flex h-7 w-7 items-center justify-center rounded text-sm transition ${
        active
          ? "bg-terracotta/15 text-terracotta"
          : "text-ink/60 hover:bg-stone/60 hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="mx-0.5 h-4 w-px bg-stone-dark/40" />;
}

// ─── Hoved-komponent ──────────────────────────────────────────────────────────

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Tilføj noter, detaljer eller links…",
  minHeight = "8rem",
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      TextStyle,
      Color,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
    ],
    content: value || "",
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "outline-none min-h-[inherit] prose prose-sm max-w-none text-ink",
      },
    },
  });

  // Synk udefra-kommende ændringer (fx når modal åbner med eksisterende data)
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value !== current) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="overflow-hidden rounded-lg border border-stone-dark/50 bg-white focus-within:ring-2 focus-within:ring-terracotta/40">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-stone/70 px-2 py-1.5">
        {/* Paragraf / overskrifter */}
        <ToolbarBtn
          onClick={() => editor.chain().focus().setParagraph().run()}
          active={editor.isActive("paragraph")}
          title="Afsnit"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path
              fillRule="evenodd"
              d="M9.5 3a5 5 0 0 0 0 10H10v3.5a.75.75 0 0 0 1.5 0V5H13a.75.75 0 0 0 0-1.5H9.5ZM10 11.5h-.5a3.5 3.5 0 1 1 0-7H10v7Z"
              clipRule="evenodd"
            />
          </svg>
        </ToolbarBtn>

        <ToolbarBtn
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          active={editor.isActive("heading", { level: 2 })}
          title="Overskrift"
        >
          <span className="text-xs font-bold">H</span>
        </ToolbarBtn>

        <Divider />

        {/* Formatering */}
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Fed"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path d="M5.5 3.5A1.5 1.5 0 0 1 7 2h4a4 4 0 0 1 2.906 6.74A4.5 4.5 0 0 1 11 18H7a1.5 1.5 0 0 1-1.5-1.5v-13ZM8.5 8h2.25a1.75 1.75 0 1 0 0-3.5H8.5V8Zm0 2.5v4H11a2 2 0 1 0 0-4H8.5Z" />
          </svg>
        </ToolbarBtn>

        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Kursiv"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path d="M8.75 3.75a.75.75 0 0 0 0 1.5h1.585l-1.67 7.5H7.25a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5h-1.585l1.67-7.5h1.415a.75.75 0 0 0 0-1.5h-4.5Z" />
          </svg>
        </ToolbarBtn>

        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
          title="Understreget"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path
              fillRule="evenodd"
              d="M5.75 3a.75.75 0 0 1 .75.75V10a3.5 3.5 0 1 0 7 0V3.75a.75.75 0 0 1 1.5 0V10a5 5 0 0 1-10 0V3.75A.75.75 0 0 1 5.75 3ZM4 16.25a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H4.75a.75.75 0 0 1-.75-.75Z"
              clipRule="evenodd"
            />
          </svg>
        </ToolbarBtn>

        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
          title="Gennemstreget"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path d="M3.75 9.25a.75.75 0 0 0 0 1.5h12.5a.75.75 0 0 0 0-1.5H3.75Z" />
            <path d="M5.47 3.424C6.423 2.524 7.71 2 9.25 2c1.498 0 2.817.515 3.756 1.426C13.944 4.33 14.5 5.582 14.5 7a.75.75 0 0 1-1.5 0c0-.987-.39-1.829-1.028-2.444C11.32 3.94 10.376 3.5 9.25 3.5c-1.079 0-1.954.36-2.543.909-.575.537-.957 1.315-.957 2.341 0 .463.105.864.282 1.2h1.68c-.214-.338-.337-.727-.337-1.2 0-.624.191-1.059.478-1.326ZM6.25 13.25c0 .624.19 1.059.477 1.326.59.549 1.465.924 2.523.924 1.126 0 2.07-.44 2.722-1.056.637-.615 1.028-1.457 1.028-2.444H14.5c0 1.418-.556 2.67-1.494 3.574C12.067 16.485 10.748 17 9.25 17c-1.54 0-2.827-.524-3.78-1.424C4.55 14.67 4 13.55 4 12.5v-.25h1.5v.25c0 .127.008.252.023.374H7.21A2.727 2.727 0 0 1 6.25 13.25Z" />
          </svg>
        </ToolbarBtn>

        <Divider />

        {/* Lister */}
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Punktliste"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path
              fillRule="evenodd"
              d="M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75Zm0 5A.75.75 0 0 1 2.75 9h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 9.75Zm0 5a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75Z"
              clipRule="evenodd"
            />
          </svg>
        </ToolbarBtn>

        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="Nummereret liste"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path
              fillRule="evenodd"
              d="M4.25 2.5a.75.75 0 0 0-.75.75V8c0 .414.336.75.75.75H5V9H4.25a.75.75 0 0 0 0 1.5H5v.5H4.25a.75.75 0 0 0-.75.75v2.5c0 .414.336.75.75.75h1.5a.75.75 0 0 0 .75-.75v-2.5a.75.75 0 0 0-.75-.75H5.25V10.5H5V9.75h.25A.75.75 0 0 0 6 9V8a.75.75 0 0 0-.75-.75H5V3.25h.25A.75.75 0 0 0 5.5 2.5h-1.25ZM8.5 4.75A.75.75 0 0 1 9.25 4h8.5a.75.75 0 0 1 0 1.5h-8.5A.75.75 0 0 1 8.5 4.75Zm0 5A.75.75 0 0 1 9.25 9.75h8.5a.75.75 0 0 1 0 1.5h-8.5a.75.75 0 0 1-.75-.75Zm0 5a.75.75 0 0 1 .75-.75h8.5a.75.75 0 0 1 0 1.5h-8.5a.75.75 0 0 1-.75-.75Z"
              clipRule="evenodd"
            />
          </svg>
        </ToolbarBtn>

        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          active={editor.isActive("taskList")}
          title="Tjekliste"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path
              fillRule="evenodd"
              d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
              clipRule="evenodd"
            />
          </svg>
        </ToolbarBtn>

        <Divider />

        {/* Juster */}
        <ToolbarBtn
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          active={editor.isActive({ textAlign: "left" })}
          title="Venstrejustér"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path
              fillRule="evenodd"
              d="M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75Zm0 5A.75.75 0 0 1 2.75 9h9.5a.75.75 0 0 1 0 1.5h-9.5A.75.75 0 0 1 2 9.75Zm0 5a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75Z"
              clipRule="evenodd"
            />
          </svg>
        </ToolbarBtn>

        <Divider />

        {/* Link */}
        <ToolbarBtn
          onClick={() => {
            const url = window.prompt("Indsæt URL");
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          active={editor.isActive("link")}
          title="Link"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path d="M12.232 4.232a2.5 2.5 0 0 1 3.536 3.536l-1.225 1.224a.75.75 0 0 0 1.061 1.06l1.224-1.224a4 4 0 0 0-5.656-5.656l-3 3a4 4 0 0 0 .225 5.865.75.75 0 0 0 .977-1.138 2.5 2.5 0 0 1-.142-3.667l3-3Z" />
            <path d="M11.603 7.963a.75.75 0 0 0-.977 1.138 2.5 2.5 0 0 1 .142 3.667l-3 3a2.5 2.5 0 0 1-3.536-3.536l1.225-1.224a.75.75 0 0 0-1.061-1.06l-1.224 1.224a4 4 0 1 0 5.656 5.656l3-3a4 4 0 0 0-.225-5.865Z" />
          </svg>
        </ToolbarBtn>

        <Divider />

        {/* Fortryd */}
        <ToolbarBtn
          onClick={() => editor.chain().focus().undo().run()}
          title="Fortryd"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path
              fillRule="evenodd"
              d="M7.793 2.232a.75.75 0 0 1-.025 1.06L3.622 7.25h10.128a5.75 5.75 0 0 1 0 11.5H10.75a.75.75 0 0 1 0-1.5h2.996a4.25 4.25 0 0 0 0-8.5H3.622l4.146 3.957a.75.75 0 0 1-1.036 1.085l-5.5-5.25a.75.75 0 0 1 0-1.085l5.5-5.25a.75.75 0 0 1 1.061.025Z"
              clipRule="evenodd"
            />
          </svg>
        </ToolbarBtn>

        <ToolbarBtn
          onClick={() => editor.chain().focus().redo().run()}
          title="Gentag"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path
              fillRule="evenodd"
              d="M12.207 2.232a.75.75 0 0 0 .025 1.06l4.146 3.958H6.25a5.75 5.75 0 0 0 0 11.5H9.25a.75.75 0 0 0 0-1.5H6.254a4.25 4.25 0 0 1 0-8.5h10.128l-4.146 3.957a.75.75 0 0 0 1.036 1.085l5.5-5.25a.75.75 0 0 0 0-1.085l-5.5-5.25a.75.75 0 0 0-1.061.025Z"
              clipRule="evenodd"
            />
          </svg>
        </ToolbarBtn>
      </div>

      {/* Editor */}
      <div style={{ minHeight }} className="px-3 py-2">
        <EditorContent editor={editor} />
        {editor.isEmpty && (
          <p className="pointer-events-none absolute text-sm text-ink/35">
            {placeholder}
          </p>
        )}
      </div>

      {/* Prose-styles til editor-indhold */}
      <style>{`
        .tiptap ul[data-type="taskList"] { list-style: none; padding: 0; }
        .tiptap ul[data-type="taskList"] li { display: flex; align-items: flex-start; gap: 0.5rem; }
        .tiptap ul[data-type="taskList"] li > label { margin-top: 0.1rem; }
        .tiptap p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left; color: #aaa; pointer-events: none; height: 0;
        }
        .tiptap { min-height: inherit; }
        .tiptap h1 { font-size: 1.4em; font-weight: 700; margin: 0.5em 0; }
        .tiptap h2 { font-size: 1.2em; font-weight: 600; margin: 0.4em 0; }
        .tiptap ul, .tiptap ol { padding-left: 1.25rem; margin: 0.25rem 0; }
        .tiptap li { margin: 0.1rem 0; }
        .tiptap a { color: #B5502E; text-decoration: underline; }
        .tiptap strong { font-weight: 700; }
        .tiptap em { font-style: italic; }
        .tiptap u { text-decoration: underline; }
        .tiptap s { text-decoration: line-through; }
      `}</style>
    </div>
  );
}
