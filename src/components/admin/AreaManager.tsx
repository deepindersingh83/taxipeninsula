"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import { deleteAreaAction, saveAreaAction } from "@/app/admin/actions";

export type AdminArea = {
  id: string;
  slug: string;
  name: string;
  region: string;
  headline: string;
  description: string;
  postcodes: string;
  travelTime: string;
  featured: boolean;
  sortOrder: number;
};

export function AreaManager({ areas }: { areas: AdminArea[] }) {
  const [editing, setEditing] = useState<AdminArea | null>(null);
  const [creating, setCreating] = useState(false);

  // Group by region so a long list stays navigable.
  const regions = areas.reduce<Record<string, AdminArea[]>>((acc, area) => {
    (acc[area.region] ??= []).push(area);
    return acc;
  }, {});

  const knownRegions = Object.keys(regions).sort();

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start">
      {/* ------------------------------------------------------------- list */}
      <div className="space-y-8">
        {Object.entries(regions).map(([region, items]) => (
          <section key={region}>
            <h2 className="font-display text-lg font-extrabold text-night-900">
              {region}
              <span className="ml-2 text-sm font-semibold text-night-400">
                {items.length}
              </span>
            </h2>

            <div className="mt-3 space-y-2">
              {items.map((area) => (
                <div
                  key={area.id}
                  className={`rounded-xl border-2 bg-white p-4 transition-colors ${
                    editing?.id === area.id ? "border-taxi-500" : "border-night-200"
                  }`}
                >
                  <div className="flex flex-wrap items-start gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-night-900">{area.name}</span>
                        {area.featured && (
                          <span className="rounded-full bg-taxi-500/25 px-2 py-0.5 text-[11px] font-bold text-taxi-900">
                            Featured
                          </span>
                        )}
                        <code className="text-[11px] text-night-400">
                          /areas/{area.slug}
                        </code>
                      </div>
                      <p className="mt-1 line-clamp-1 text-sm text-night-500">
                        {area.headline}
                      </p>
                    </div>

                    <div className="flex shrink-0 gap-1">
                      <Link
                        href={`/areas/${area.slug}`}
                        target="_blank"
                        className="rounded-lg px-2.5 py-1.5 text-xs font-bold text-night-500 transition-colors hover:bg-night-100"
                        title="View on the website"
                      >
                        ↗
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setCreating(false);
                          setEditing(area);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="rounded-lg px-3 py-1.5 text-xs font-bold text-night-700 transition-colors hover:bg-night-100"
                      >
                        Edit
                      </button>
                      <form action={deleteAreaAction}>
                        <input type="hidden" name="id" value={area.id} />
                        <button
                          type="submit"
                          className="rounded-lg px-2.5 py-1.5 text-xs font-bold text-night-400 transition-colors hover:bg-red-50 hover:text-red-600"
                          title="Delete this area"
                        >
                          ✕
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* ------------------------------------------------------------- form */}
      <aside className="lg:sticky lg:top-6">
        {editing || creating ? (
          <AreaForm
            key={editing?.id ?? "new"}
            area={editing}
            regions={knownRegions}
            onCancel={() => {
              setEditing(null);
              setCreating(false);
            }}
          />
        ) : (
          <div className="rounded-2xl border border-night-200 bg-white p-6 text-center">
            <p className="text-sm text-night-500">
              Select an area to edit it, or add a new suburb.
            </p>
            <button
              type="button"
              onClick={() => setCreating(true)}
              className="mt-4 w-full rounded-xl bg-night-900 px-5 py-3 text-sm font-bold text-taxi-400 transition-colors hover:bg-night-800"
            >
              + Add a service area
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}

function AreaForm({
  area,
  regions,
  onCancel,
}: {
  area: AdminArea | null;
  regions: string[];
  onCancel: () => void;
}) {
  const [state, formAction] = useActionState(saveAreaAction, null);

  return (
    <form action={formAction} className="rounded-2xl border-2 border-taxi-500 bg-white p-5">
      {area && <input type="hidden" name="id" value={area.id} />}

      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-base font-extrabold text-night-900">
          {area ? `Edit ${area.name}` : "New service area"}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg px-2 py-1 text-xs font-bold text-night-400 hover:text-night-900"
        >
          ✕
        </button>
      </div>

      {state?.error && (
        <p role="alert" className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
          {state.error}
        </p>
      )}
      {state?.success && (
        <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800">
          {state.success}
        </p>
      )}

      <div className="mt-4 space-y-3.5">
        <Field label="Suburb name" htmlFor="name" required>
          <input
            id="name"
            name="name"
            required
            defaultValue={area?.name ?? ""}
            placeholder="Rosebud"
            className={inputClass}
          />
        </Field>

        {area && (
          <p className="text-xs text-night-400">
            URL: <code>/areas/{area.slug}</code> — renaming the suburb does not
            change an existing URL, so old links keep working.
          </p>
        )}

        <Field label="Region" htmlFor="region">
          <input
            id="region"
            name="region"
            list="region-options"
            defaultValue={area?.region ?? "Mornington Peninsula"}
            className={inputClass}
          />
          <datalist id="region-options">
            {regions.map((r) => (
              <option key={r} value={r} />
            ))}
          </datalist>
        </Field>

        <Field
          label="Headline"
          htmlFor="headline"
          hint="One line. Shown on the area card and used as the meta description."
        >
          <input
            id="headline"
            name="headline"
            maxLength={250}
            defaultValue={area?.headline ?? ""}
            placeholder="Our home base — vans on the road around the clock."
            className={inputClass}
          />
        </Field>

        <Field label="Description" htmlFor="description" hint="A paragraph or two about this area.">
          <textarea
            id="description"
            name="description"
            rows={6}
            defaultValue={area?.description ?? ""}
            className={inputClass}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Postcodes" htmlFor="postcodes">
            <input
              id="postcodes"
              name="postcodes"
              defaultValue={area?.postcodes ?? ""}
              placeholder="3939"
              className={inputClass}
            />
          </Field>
          <Field label="Sort order" htmlFor="sortOrder">
            <input
              id="sortOrder"
              name="sortOrder"
              type="number"
              defaultValue={area?.sortOrder ?? 0}
              className={inputClass}
            />
          </Field>
        </div>

        <Field label="Travel time note" htmlFor="travelTime">
          <input
            id="travelTime"
            name="travelTime"
            defaultValue={area?.travelTime ?? ""}
            placeholder="≈ 1 hr 30 min to Melbourne Airport"
            className={inputClass}
          />
        </Field>

        <label className="flex items-center gap-2.5">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={area?.featured ?? false}
            className="size-4 rounded border-night-300"
          />
          <span className="text-sm font-semibold text-night-800">
            Feature on the home page
          </span>
        </label>
      </div>

      <SaveButton isNew={!area} />
    </form>
  );
}

const inputClass =
  "w-full rounded-xl border-2 border-night-200 bg-white px-4 py-2.5 text-sm transition-colors focus:border-night-900 focus:outline-none";

function SaveButton({ isNew }: { isNew: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-5 w-full rounded-xl bg-night-900 px-5 py-3 text-sm font-bold text-taxi-400 transition-colors hover:bg-night-800 disabled:opacity-60"
    >
      {pending ? "Saving…" : isNew ? "Create area" : "Save changes"}
    </button>
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
      {hint && <p className="mt-1 text-xs text-night-400">{hint}</p>}
    </div>
  );
}
