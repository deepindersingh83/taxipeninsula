import type { Metadata } from "next";
import Link from "next/link";

import { PostCard } from "@/components/blog/PostCard";
import { MaxiTaxi } from "@/components/MaxiTaxi";
import { Reveal } from "@/components/motion/Reveal";
import { PageHero } from "@/components/site/PageHero";
import { ButtonLink, Container, Section } from "@/components/ui";
import {
  countPublishedPosts,
  getCategoriesWithCounts,
  getPublishedPosts,
} from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Airport pickup zones, NDIS and MPTP transport subsidies explained, and local guides to the Mornington Peninsula — written by the people driving it.",
  alternates: { canonical: "/blog" },
};

export const revalidate = 600;

const PER_PAGE = 9;

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string }>;
}) {
  const { page: pageParam, category } = await searchParams;

  const page = Math.max(1, Number(pageParam) || 1);
  const [posts, total, categories] = await Promise.all([
    getPublishedPosts({
      take: PER_PAGE,
      skip: (page - 1) * PER_PAGE,
      categorySlug: category,
    }),
    countPublishedPosts(category),
    getCategoriesWithCounts(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const activeCategory = categories.find((c) => c.slug === category);

  const buildHref = (opts: { page?: number; category?: string | null }) => {
    const params = new URLSearchParams();
    const cat = opts.category === null ? undefined : (opts.category ?? category);
    if (cat) params.set("category", cat);
    if (opts.page && opts.page > 1) params.set("page", String(opts.page));
    const qs = params.toString();
    return qs ? `/blog?${qs}` : "/blog";
  };

  return (
    <>
      <PageHero
        eyebrow="The blog"
        title={
          <>
            Local knowledge,
            <br />
            <span className="text-taxi-400">written down.</span>
          </>
        }
        lead="Which terminal pickup zone actually works, how the NDIS and MPTP subsidies differ, and where to go on the Peninsula when you have a driver for the day."
        breadcrumbs={[{ href: "/blog", label: "Blog" }]}
      />

      <Section>
        <Container>
          {/* ------------------------------------------------ category filter */}
          {categories.length > 0 && (
            <Reveal>
              <nav aria-label="Post categories" className="flex flex-wrap gap-2">
                <Link
                  href={buildHref({ category: null, page: 1 })}
                  aria-current={!category ? "page" : undefined}
                  className={`rounded-full border-2 px-5 py-2.5 text-sm font-bold transition-all ${
                    !category
                      ? "border-night-900 bg-night-900 text-taxi-400"
                      : "border-night-200 text-night-600 hover:border-taxi-500"
                  }`}
                >
                  All posts
                  <span className="ml-2 opacity-60">{total > 0 && !category ? total : ""}</span>
                </Link>
                {categories.map((c) => (
                  <Link
                    key={c.id}
                    href={buildHref({ category: c.slug, page: 1 })}
                    aria-current={category === c.slug ? "page" : undefined}
                    className={`rounded-full border-2 px-5 py-2.5 text-sm font-bold transition-all ${
                      category === c.slug
                        ? "border-night-900 bg-night-900 text-taxi-400"
                        : "border-night-200 text-night-600 hover:border-taxi-500"
                    }`}
                  >
                    {c.name}
                    <span className="ml-2 opacity-60">{c._count.posts}</span>
                  </Link>
                ))}
              </nav>
            </Reveal>
          )}

          {activeCategory?.description && (
            <Reveal delay={0.05}>
              <p className="mt-6 max-w-2xl text-night-500">
                {activeCategory.description}
              </p>
            </Reveal>
          )}

          {/* --------------------------------------------------------- posts */}
          {posts.length === 0 ? (
            <div className="mt-12 rounded-3xl border border-dashed border-night-300 bg-white p-12 text-center">
              <div className="mx-auto w-44">
                <MaxiTaxi className="h-auto w-full" wheelSpeed={1.2} title="" />
              </div>
              <h2 className="mt-6 font-display text-xl font-bold text-night-900">
                Nothing here yet
              </h2>
              <p className="mx-auto mt-2 max-w-sm text-sm text-night-500">
                {category
                  ? "No posts in this category yet. Try another one."
                  : "The first articles are on their way. In the meantime, the phone still works."}
              </p>
              <div className="mt-6">
                <ButtonLink href={category ? "/blog" : "/book"}>
                  {category ? "See all posts" : "Book a ride"}
                </ButtonLink>
              </div>
            </div>
          ) : (
            <>
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post, i) => (
                  <Reveal key={post.id} delay={Math.min(i * 0.07, 0.35)}>
                    <PostCard post={post} />
                  </Reveal>
                ))}
              </div>

              {/* ---------------------------------------------- pagination */}
              {totalPages > 1 && (
                <nav
                  aria-label="Pagination"
                  className="mt-14 flex items-center justify-center gap-2"
                >
                  <PageLink
                    href={buildHref({ page: page - 1 })}
                    disabled={page <= 1}
                    label="Previous page"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="size-4" aria-hidden="true">
                      <path d="M19 12H5M11 18l-6-6 6-6" />
                    </svg>
                  </PageLink>

                  {Array.from({ length: totalPages }).map((_, i) => {
                    const n = i + 1;
                    return (
                      <Link
                        key={n}
                        href={buildHref({ page: n })}
                        aria-current={n === page ? "page" : undefined}
                        className={`grid size-10 place-items-center rounded-full text-sm font-bold transition-colors ${
                          n === page
                            ? "bg-night-900 text-taxi-400"
                            : "text-night-600 hover:bg-night-100"
                        }`}
                      >
                        {n}
                      </Link>
                    );
                  })}

                  <PageLink
                    href={buildHref({ page: page + 1 })}
                    disabled={page >= totalPages}
                    label="Next page"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="size-4" aria-hidden="true">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </PageLink>
                </nav>
              )}
            </>
          )}
        </Container>
      </Section>
    </>
  );
}

function PageLink({
  href,
  disabled,
  label,
  children,
}: {
  href: string;
  disabled: boolean;
  label: string;
  children: React.ReactNode;
}) {
  if (disabled) {
    return (
      <span
        aria-hidden="true"
        className="grid size-10 place-items-center rounded-full text-night-300"
      >
        {children}
      </span>
    );
  }
  return (
    <Link
      href={href}
      aria-label={label}
      className="grid size-10 place-items-center rounded-full text-night-600 transition-colors hover:bg-night-100"
    >
      {children}
    </Link>
  );
}
