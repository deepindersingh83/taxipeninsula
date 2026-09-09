"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { createCategoryAction, deleteCategoryAction } from "@/app/admin/actions";

type Category = {
  id: string;
  name: string;
  description: string;
  _count: { posts: number };
};

export function CategoryManager({ categories }: { categories: Category[] }) {
  const [state, formAction] = useActionState(createCategoryAction, null);

  return (
    <section className="rounded-2xl border border-night-200 bg-white p-5">
      <h2 className="text-xs font-bold tracking-wide text-night-500 uppercase">
        Categories
      </h2>

      <ul className="mt-4 space-y-2">
        {categories.length === 0 && (
          <li className="text-sm text-night-400">No categories yet.</li>
        )}
        {categories.map((c) => (
          <li
            key={c.id}
            className="flex items-center gap-2 rounded-xl bg-night-50 px-3 py-2.5"
          >
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-bold text-night-900">
                {c.name}
              </span>
              <span className="text-xs text-night-400">
                {c._count.posts} post{c._count.posts === 1 ? "" : "s"}
              </span>
            </span>
            <form action={deleteCategoryAction}>
              <input type="hidden" name="id" value={c.id} />
              <button
                type="submit"
                aria-label={`Delete the ${c.name} category`}
                title="Delete — posts in it are kept, just uncategorised"
                className="rounded-lg px-2 py-1 text-xs font-bold text-night-400 transition-colors hover:bg-red-50 hover:text-red-600"
              >
                ✕
              </button>
            </form>
          </li>
        ))}
      </ul>

      <form action={formAction} className="mt-5 border-t border-night-100 pt-5">
        {state?.error && (
          <p role="alert" className="mb-3 text-xs font-semibold text-red-600">
            {state.error}
          </p>
        )}
        {state?.success && (
          <p className="mb-3 text-xs font-semibold text-emerald-700">
            {state.success}
          </p>
        )}

        <label htmlFor="category-name" className="mb-1.5 block text-sm font-bold text-night-800">
          Add a category
        </label>
        <input
          id="category-name"
          name="name"
          required
          maxLength={60}
          placeholder="e.g. Airport Transfers"
          className="w-full rounded-xl border-2 border-night-200 px-4 py-2.5 text-sm transition-colors focus:border-night-900 focus:outline-none"
        />
        <textarea
          name="description"
          rows={2}
          maxLength={300}
          placeholder="Optional description, shown on the blog when this category is filtered."
          className="mt-2 w-full rounded-xl border-2 border-night-200 px-4 py-2.5 text-sm transition-colors focus:border-night-900 focus:outline-none"
        />
        <AddButton />
      </form>
    </section>
  );
}

function AddButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-3 w-full rounded-xl bg-night-900 px-4 py-2.5 text-sm font-bold text-taxi-400 transition-colors hover:bg-night-800 disabled:opacity-60"
    >
      {pending ? "Adding…" : "Add category"}
    </button>
  );
}
