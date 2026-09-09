"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import { deletePostAction, savePostAction, uploadImageAction } from "@/app/admin/actions";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

type Category = { id: string; name: string };

export type EditablePost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  status: string;
  categoryId: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
};

/** Turns a title into a URL slug, matching the server's rules closely enough
 *  to preview. The server is authoritative and will de-duplicate. */
function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 90);
}

export function PostEditor({
  post,
  categories,
  saved = false,
}: {
  post?: EditablePost;
  categories: Category[];
  saved?: boolean;
}) {
  const [state, formAction] = useActionState(savePostAction, null);

  const [title, setTitle] = useState(post?.title ?? "");
  // Once a post is published its slug is its permanent URL, so stop
  // auto-rewriting it from the title after the first save.
  const [slugTouched, setSlugTouched] = useState(Boolean(post?.slug));
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [coverImage, setCoverImage] = useState(post?.coverImage ?? "");
  const [uploadingCover, setUploadingCover] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  function onTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  async function onCoverSelected(file: File) {
    setUploadingCover(true);
    const formData = new FormData();
    formData.append("file", file);
    const result = await uploadImageAction(formData);
    setUploadingCover(false);
    if (result.url) setCoverImage(result.url);
    else window.alert(result.error ?? "Upload failed.");
  }

  return (
    <form action={formAction}>
      {post?.id && <input type="hidden" name="id" value={post.id} />}

      {saved && !state && (
        <p className="mb-5 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          ✅ Saved.{" "}
          {post?.status === "published" ? (
            <Link href={`/blog/${post.slug}`} target="_blank" className="underline">
              View it on the website ↗
            </Link>
          ) : (
            "It is still a draft — set the status to Published when you are ready."
          )}
        </p>
      )}

      {state?.error && (
        <p role="alert" className="mb-5 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
          {state.error}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        {/* ------------------------------------------------------ main body */}
        <div className="space-y-5">
          <Field label="Title" htmlFor="title" required>
            <input
              id="title"
              name="title"
              required
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="How to get to Melbourne Airport from Rosebud at 4am"
              className="w-full rounded-xl border-2 border-night-200 bg-white px-4 py-3 font-display text-lg font-bold transition-colors focus:border-night-900 focus:outline-none"
            />
          </Field>

          <Field
            label="Web address (URL)"
            htmlFor="slug"
            hint="Changing this after publishing will break existing links."
          >
            <div className="flex items-center gap-1 rounded-xl border-2 border-night-200 bg-white px-4 transition-colors focus-within:border-night-900">
              <span className="shrink-0 text-sm text-night-400">/blog/</span>
              <input
                id="slug"
                name="slug"
                value={slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setSlug(slugify(e.target.value));
                }}
                placeholder="url-for-this-post"
                className="w-full bg-transparent py-3 text-sm focus:outline-none"
              />
            </div>
          </Field>

          <Field
            label="Summary"
            htmlFor="excerpt"
            hint="Shown on the blog listing and in Google results. Leave blank and we'll generate one."
          >
            <textarea
              id="excerpt"
              name="excerpt"
              rows={3}
              maxLength={400}
              defaultValue={post?.excerpt ?? ""}
              placeholder="One or two sentences telling someone why they should read this."
              className="w-full rounded-xl border-2 border-night-200 bg-white px-4 py-3 text-sm transition-colors focus:border-night-900 focus:outline-none"
            />
          </Field>

          <Field label="Article" htmlFor="content">
            <RichTextEditor name="content" defaultValue={post?.content ?? ""} />
          </Field>
        </div>

        {/* --------------------------------------------------------- sidebar */}
        <aside className="space-y-5 lg:sticky lg:top-6">
          <Panel title="Publish">
            <Field label="Status" htmlFor="status">
              <select
                id="status"
                name="status"
                defaultValue={post?.status ?? "draft"}
                className="w-full rounded-xl border-2 border-night-200 bg-white px-4 py-3 text-sm font-semibold transition-colors focus:border-night-900 focus:outline-none"
              >
                <option value="draft">Draft — only visible here</option>
                <option value="published">Published — live on the website</option>
              </select>
            </Field>

            <div className="mt-4 flex flex-col gap-2">
              <SaveButton />
              {post?.id && post.status === "published" && (
                <Link
                  href={`/blog/${post.slug}`}
                  target="_blank"
                  className="rounded-xl border-2 border-night-200 px-5 py-2.5 text-center text-sm font-bold text-night-700 transition-colors hover:border-night-900"
                >
                  View on website ↗
                </Link>
              )}
            </div>
          </Panel>

          <Panel title="Category">
            <select
              name="categoryId"
              defaultValue={post?.categoryId ?? ""}
              aria-label="Category"
              className="w-full rounded-xl border-2 border-night-200 bg-white px-4 py-3 text-sm transition-colors focus:border-night-900 focus:outline-none"
            >
              <option value="">No category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <p className="mt-2 text-xs text-night-400">
              Manage categories from the{" "}
              <Link href="/admin/posts" className="underline">
                posts list
              </Link>
              .
            </p>
          </Panel>

          <Panel title="Cover image">
            <input type="hidden" name="coverImage" value={coverImage} />

            {coverImage ? (
              <div className="space-y-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverImage}
                  alt="Cover preview"
                  className="aspect-[16/9] w-full rounded-xl object-cover"
                />
                <button
                  type="button"
                  onClick={() => setCoverImage("")}
                  className="w-full rounded-xl border-2 border-night-200 px-4 py-2 text-xs font-bold text-red-600 transition-colors hover:border-red-300"
                >
                  Remove image
                </button>
              </div>
            ) : (
              <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-night-300 px-4 py-8 text-center transition-colors hover:border-taxi-500">
                {uploadingCover ? (
                  <>
                    <span className="size-5 animate-spin rounded-full border-2 border-night-300 border-t-night-900" />
                    <span className="text-xs font-semibold text-night-500">
                      Uploading…
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-2xl" aria-hidden="true">🖼</span>
                    <span className="text-xs font-bold text-night-700">
                      Choose an image
                    </span>
                    <span className="text-[11px] text-night-400">
                      JPG, PNG or WebP · max 5 MB
                    </span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                  className="sr-only"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void onCoverSelected(file);
                    e.target.value = "";
                  }}
                />
              </label>
            )}

            <p className="mt-3 text-xs text-night-400">
              Optional. Without one we show an animated taxi illustration.
            </p>
          </Panel>

          <Panel title="Search engine (SEO)">
            <Field label="Page title" htmlFor="seoTitle" hint="Defaults to the post title.">
              <input
                id="seoTitle"
                name="seoTitle"
                maxLength={200}
                defaultValue={post?.seoTitle ?? ""}
                className="w-full rounded-xl border-2 border-night-200 bg-white px-4 py-2.5 text-sm transition-colors focus:border-night-900 focus:outline-none"
              />
            </Field>
            <div className="mt-4">
              <Field
                label="Meta description"
                htmlFor="seoDescription"
                hint="Aim for 150–160 characters."
              >
                <textarea
                  id="seoDescription"
                  name="seoDescription"
                  rows={3}
                  maxLength={300}
                  defaultValue={post?.seoDescription ?? ""}
                  className="w-full rounded-xl border-2 border-night-200 bg-white px-4 py-2.5 text-sm transition-colors focus:border-night-900 focus:outline-none"
                />
              </Field>
            </div>
          </Panel>

          {post?.id && (
            <Panel title="Danger zone">
              {confirmDelete ? (
                <div className="space-y-2">
                  <p className="text-xs text-night-600">
                    This permanently deletes the post. It cannot be undone.
                  </p>
                  <button
                    type="submit"
                    formAction={deletePostAction}
                    className="w-full rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-red-700"
                  >
                    Yes, delete this post
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="w-full rounded-xl px-4 py-2 text-xs font-bold text-night-500 hover:text-night-900"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="w-full rounded-xl border-2 border-night-200 px-4 py-2.5 text-xs font-bold text-red-600 transition-colors hover:border-red-300"
                >
                  Delete this post
                </button>
              )}
            </Panel>
          )}
        </aside>
      </div>
    </form>
  );
}

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center justify-center gap-2 rounded-xl bg-night-900 px-5 py-3 text-sm font-bold text-taxi-400 transition-colors hover:bg-night-800 disabled:opacity-60"
    >
      {pending ? (
        <>
          <span className="size-4 animate-spin rounded-full border-2 border-taxi-400/30 border-t-taxi-400" />
          Saving…
        </>
      ) : (
        "Save post"
      )}
    </button>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-night-200 bg-white p-5">
      <h2 className="mb-4 text-xs font-bold tracking-wide text-night-500 uppercase">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Field({
  label,
  htmlFor,
  hint,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-bold text-night-800">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-xs text-night-400">{hint}</p>}
    </div>
  );
}
