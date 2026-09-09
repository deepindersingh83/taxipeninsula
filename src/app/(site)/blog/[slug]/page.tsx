import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PostCard } from "@/components/blog/PostCard";
import { MaxiTaxi } from "@/components/MaxiTaxi";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink, Container, Section } from "@/components/ui";
import { formatDateShort } from "@/lib/format";
import {
  getAllPublishedSlugs,
  getPostBySlug,
  getRelatedPosts,
  incrementViewCount,
} from "@/lib/posts";
import { toPlainText } from "@/lib/sanitize";
import { absoluteUrl, site } from "@/lib/site";

export const revalidate = 600;

export async function generateStaticParams() {
  const posts = await getAllPublishedSlugs();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) return { title: "Article not found" };

  const description =
    post.seoDescription || post.excerpt || toPlainText(post.content).slice(0, 155);

  return {
    title: post.seoTitle || post.title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.seoTitle || post.title,
      description,
      url: absoluteUrl(`/blog/${post.slug}`),
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  // Fire and forget — the page must not wait on a view counter.
  void incrementViewCount(post.id);

  const related = await getRelatedPosts(post.id, post.categoryId, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.seoDescription || post.excerpt,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: { "@type": "Organization", name: post.author?.name || site.legalName },
    publisher: {
      "@type": "Organization",
      name: site.legalName,
      logo: { "@type": "ImageObject", url: absoluteUrl(site.logo.src) },
    },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    ...(post.coverImage ? { image: post.coverImage } : {}),
  };

  return (
    <>
      {/* ------------------------------------------------------------- head */}
      <article>
        <header className="relative overflow-hidden bg-night-900 pt-12 pb-20 text-white sm:pt-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-40 -right-24 size-[30rem] rounded-full bg-taxi-500/15 blur-[120px]"
          />

          <Container size="narrow" className="relative">
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-night-400">
                <li>
                  <Link href="/" className="hover:text-taxi-400">
                    Home
                  </Link>
                </li>
                <li className="flex items-center gap-1.5">
                  <span aria-hidden="true">/</span>
                  <Link href="/blog" className="hover:text-taxi-400">
                    Blog
                  </Link>
                </li>
                {post.category && (
                  <li className="flex items-center gap-1.5">
                    <span aria-hidden="true">/</span>
                    <Link
                      href={`/blog?category=${post.category.slug}`}
                      className="hover:text-taxi-400"
                    >
                      {post.category.name}
                    </Link>
                  </li>
                )}
              </ol>
            </nav>

            {post.category && (
              <span className="inline-flex rounded-full bg-taxi-500/15 px-3.5 py-1.5 text-xs font-bold tracking-[0.14em] text-taxi-400 uppercase">
                {post.category.name}
              </span>
            )}

            <h1 className="mt-5 font-display text-3xl leading-[1.12] font-extrabold sm:text-4xl lg:text-[2.9rem]">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="mt-5 text-lg leading-relaxed text-night-200">
                {post.excerpt}
              </p>
            )}

            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-night-400">
              {post.author?.name && (
                <span className="font-semibold text-night-200">
                  {post.author.name}
                </span>
              )}
              {post.publishedAt && (
                <time dateTime={post.publishedAt.toISOString()}>
                  {formatDateShort(post.publishedAt)}
                </time>
              )}
              <span>{post.readingMinutes} min read</span>
            </div>
          </Container>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-0 -bottom-2 left-0 h-20 overflow-hidden"
          >
            <div className="absolute inset-x-0 bottom-7 h-[2px] bg-white/10" />
            <div className="absolute bottom-3 left-0 w-28 animate-[tp-drive-across_20s_linear_infinite] sm:w-36">
              <MaxiTaxi className="h-auto w-full" wheelSpeed={0.55} title="" />
            </div>
          </div>

          <div className="checker-band absolute inset-x-0 bottom-0 h-2" aria-hidden="true" />
        </header>

        {/* ------------------------------------------------------ cover image */}
        {post.coverImage && (
          <Container size="narrow" className="-mt-10">
            <div className="relative overflow-hidden rounded-2xl border border-night-200 shadow-lift">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.coverImage}
                alt=""
                className="aspect-[16/9] w-full object-cover"
              />
            </div>
          </Container>
        )}

        {/* ----------------------------------------------------------- body */}
        <Section className={post.coverImage ? "pt-12" : ""}>
          <Container size="narrow">
            <div
              className="prose-article"
              // Content is sanitised on write (see lib/sanitize.ts) so stored
              // HTML can never contain scripts or event handlers.
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* In-article CTA */}
            <aside className="mt-14 overflow-hidden rounded-2xl border-2 border-taxi-500 bg-white">
              <div className="flex flex-col items-center gap-6 p-7 sm:flex-row sm:p-8">
                <div className="w-40 shrink-0">
                  <MaxiTaxi className="h-auto w-full" wheelSpeed={0.55} rampDown title="" />
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="font-display text-xl font-bold text-night-900">
                    Need a ride while you&rsquo;re here?
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-night-500">
                    Maxi taxis, wheelchair accessible vans and airport transfers
                    across the Peninsula and south-east Melbourne. 24/7.
                  </p>
                  <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row sm:justify-start">
                    <ButtonLink href="/book" size="sm">
                      Book a ride
                    </ButtonLink>
                    <ButtonLink
                      href={`tel:${site.phoneHref}`}
                      variant="outline"
                      size="sm"
                    >
                      {site.phone}
                    </ButtonLink>
                  </div>
                </div>
              </div>
            </aside>

            <div className="mt-10">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm font-bold text-night-600 transition-colors hover:text-night-900"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="size-4" aria-hidden="true">
                  <path d="M19 12H5M11 18l-6-6 6-6" />
                </svg>
                All articles
              </Link>
            </div>
          </Container>
        </Section>
      </article>

      {/* --------------------------------------------------------- related */}
      {related.length > 0 && (
        <Section className="bg-white">
          <Container>
            <h2 className="font-display text-2xl font-extrabold text-night-900 sm:text-3xl">
              Keep reading
            </h2>
            <div className="mt-4 h-1 w-16 rounded-full bg-taxi-500" />

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r, i) => (
                <Reveal key={r.id} delay={i * 0.08}>
                  <PostCard post={r} />
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
