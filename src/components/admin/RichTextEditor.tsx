"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";

import { uploadImageAction } from "@/app/admin/actions";

/**
 * The blog editor.
 *
 * Deliberately a small, opinionated toolbar rather than a full word processor:
 * the fewer ways there are to produce inconsistent markup, the better the blog
 * looks six months from now when three different people have written in it.
 *
 * The HTML it emits is sanitised again on the server before storage, so nothing
 * here is trusted.
 */
export function RichTextEditor({
  name,
  defaultValue = "",
}: {
  name: string;
  defaultValue?: string;
}) {
  // Tiptap writes into this hidden input so the surrounding <form> and its
  // Server Action can submit the content with everything else.
  const hiddenRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const editor = useEditor({
    // Required in Next.js: without this, Tiptap renders on the server and
    // hydration mismatches.
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: "noopener noreferrer" },
      }),
      Image.configure({ HTMLAttributes: { class: "rounded-xl" } }),
    ],
    content: defaultValue,
    editorProps: {
      attributes: {
        class: "prose-article max-w-none px-5 py-4 min-h-[26rem] focus:outline-none",
        "data-placeholder": "Start writing…",
      },
    },
    onUpdate: ({ editor }) => {
      if (hiddenRef.current) hiddenRef.current.value = editor.getHTML();
    },
  });

  // Keep the hidden input in sync on first mount too, so saving without
  // touching the body still submits the existing content.
  useEffect(() => {
    if (editor && hiddenRef.current) {
      hiddenRef.current.value = editor.getHTML();
    }
  }, [editor]);

  const addLink = useCallback(() => {
    if (!editor) return;
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", previous ?? "https://");

    if (url === null) return; // cancelled
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    // Only allow schemes that are safe to put in an href.
    if (!/^(https?:\/\/|mailto:|tel:|\/)/i.test(url)) {
      window.alert(
        "Links must start with https://, http://, mailto:, tel: or / (for a page on this site)."
      );
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const addImage = useCallback(
    async (file: File) => {
      if (!editor) return;
      setUploading(true);
      setUploadError(null);

      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadImageAction(formData);
      setUploading(false);

      if (result.error || !result.url) {
        setUploadError(result.error ?? "Upload failed.");
        return;
      }

      editor.chain().focus().setImage({ src: result.url, alt: "" }).run();
    },
    [editor]
  );

  if (!editor) {
    return (
      <div className="rounded-xl border-2 border-night-200 bg-white p-8 text-center text-sm text-night-400">
        Loading the editor…
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border-2 border-night-200 bg-white focus-within:border-night-900">
      <input type="hidden" name={name} ref={hiddenRef} defaultValue={defaultValue} />

      {/* ---------------------------------------------------------- toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-night-200 bg-night-50 p-2">
        <ToolGroup>
          <ToolButton
            editor={editor}
            label="Bold"
            active={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <span className="font-extrabold">B</span>
          </ToolButton>
          <ToolButton
            editor={editor}
            label="Italic"
            active={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <span className="font-serif italic">I</span>
          </ToolButton>
          <ToolButton
            editor={editor}
            label="Strikethrough"
            active={editor.isActive("strike")}
            onClick={() => editor.chain().focus().toggleStrike().run()}
          >
            <span className="line-through">S</span>
          </ToolButton>
        </ToolGroup>

        <Divider />

        <ToolGroup>
          {[2, 3, 4].map((level) => (
            <ToolButton
              key={level}
              editor={editor}
              label={`Heading ${level}`}
              active={editor.isActive("heading", { level })}
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .toggleHeading({ level: level as 2 | 3 | 4 })
                  .run()
              }
            >
              H{level}
            </ToolButton>
          ))}
          <ToolButton
            editor={editor}
            label="Normal paragraph"
            active={editor.isActive("paragraph")}
            onClick={() => editor.chain().focus().setParagraph().run()}
          >
            ¶
          </ToolButton>
        </ToolGroup>

        <Divider />

        <ToolGroup>
          <ToolButton
            editor={editor}
            label="Bulleted list"
            active={editor.isActive("bulletList")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            •—
          </ToolButton>
          <ToolButton
            editor={editor}
            label="Numbered list"
            active={editor.isActive("orderedList")}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            1.
          </ToolButton>
          <ToolButton
            editor={editor}
            label="Quote"
            active={editor.isActive("blockquote")}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            &ldquo;
          </ToolButton>
          <ToolButton
            editor={editor}
            label="Divider line"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          >
            —
          </ToolButton>
        </ToolGroup>

        <Divider />

        <ToolGroup>
          <ToolButton
            editor={editor}
            label="Add or edit link"
            active={editor.isActive("link")}
            onClick={addLink}
          >
            🔗
          </ToolButton>

          <label
            className={`grid size-8 cursor-pointer place-items-center rounded-lg text-sm transition-colors hover:bg-night-200 ${
              uploading ? "pointer-events-none opacity-50" : ""
            }`}
            title="Insert an image"
          >
            {uploading ? (
              <span className="size-3.5 animate-spin rounded-full border-2 border-night-300 border-t-night-900" />
            ) : (
              "🖼"
            )}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void addImage(file);
                e.target.value = "";
              }}
            />
            <span className="sr-only">Insert an image</span>
          </label>
        </ToolGroup>

        <Divider />

        <ToolGroup>
          <ToolButton
            editor={editor}
            label="Undo"
            onClick={() => editor.chain().focus().undo().run()}
          >
            ↶
          </ToolButton>
          <ToolButton
            editor={editor}
            label="Redo"
            onClick={() => editor.chain().focus().redo().run()}
          >
            ↷
          </ToolButton>
        </ToolGroup>
      </div>

      {uploadError && (
        <p role="alert" className="border-b border-red-200 bg-red-50 px-5 py-2.5 text-xs font-semibold text-red-700">
          {uploadError}
        </p>
      )}

      <EditorContent editor={editor} />

      <p className="border-t border-night-100 bg-night-50 px-5 py-2 text-xs text-night-400">
        Tip: paste a link and it becomes clickable automatically. Images are
        uploaded to this website — keep them under 5&nbsp;MB.
      </p>
    </div>
  );
}

function ToolGroup({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-0.5">{children}</div>;
}

function Divider() {
  return <span className="mx-1 h-6 w-px bg-night-200" aria-hidden="true" />;
}

function ToolButton({
  label,
  active = false,
  onClick,
  children,
}: {
  editor: Editor;
  label: string;
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      aria-pressed={active}
      className={`grid size-8 place-items-center rounded-lg text-sm transition-colors ${
        active
          ? "bg-night-900 text-taxi-400"
          : "text-night-700 hover:bg-night-200"
      }`}
    >
      {children}
    </button>
  );
}
