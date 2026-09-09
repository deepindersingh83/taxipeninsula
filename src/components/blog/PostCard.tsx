import Link from "next/link";

import { MaxiTaxi } from "@/components/MaxiTaxi";
import { formatDateShort } from "@/lib/format";

export type PostCardData = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string | null;
  publishedAt: Date | null;
  readingMinutes: number;
  category?: { name: string; slug: string } | null;
  author?: { name: string } | null;
};

export function PostCard({
  post,
  featured = false,
}: {
  post: PostCardData;
  featured?: boolean;
}) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-night-200 bg-white transition-all hover:-translate-y-1 hover:border-taxi-500/60 hover:shadow-lift ${
        featured ? "sm:flex-row" : ""
      }`}
    >
      <div
        className={`relative overflow-hidden bg-night-100 ${
          featured ? "aspect-[16/10] sm:aspect-auto sm:w-1/2" : "aspect-[16/10]"
        }`}
      >
        {post.coverImage ? (
          // Cover images are uploaded by staff to /public/uploads, so next/image
          // optimisation is not worth the build-time complexity here.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.coverImage}
            alt=""
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="grid size-full place-items-center bg-gradient-to-br from-taxi-500/25 via-cream to-night-100 p-8">
            <div className="w-full max-w-[12rem]">
              <MaxiTaxi className="h-auto w-full" wheelSpeed={0.75} title="" />
            </div>
          </div>
        )}

        {post.category && (
          <span className="absolute top-3 left-3 rounded-full bg-night-900/90 px-3 py-1 text-[11px] font-bold text-taxi-400 backdrop-blur-sm">
            {post.category.name}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="text-xs font-semibold text-night-400">
          {post.publishedAt ? formatDateShort(post.publishedAt) : "Draft"}
          {" · "}
          {post.readingMinutes} min read
        </p>

        <h3
          className={`mt-2 font-display leading-snug font-bold text-night-900 ${
            featured ? "text-xl sm:text-2xl" : "text-lg"
          }`}
        >
          {post.title}
        </h3>

        <p className="mt-2.5 line-clamp-3 flex-1 text-sm leading-relaxed text-night-500">
          {post.excerpt}
        </p>

        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-night-900 transition-colors group-hover:text-taxi-700">
          Read article
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
