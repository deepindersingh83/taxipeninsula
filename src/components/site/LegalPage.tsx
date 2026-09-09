import { PageHero } from "@/components/site/PageHero";
import { Alert, Container, Section } from "@/components/ui";

/**
 * Shared shell for /terms and /privacy: a hero, a "last updated" line, a
 * sticky table of contents, and the reviewed-by-a-lawyer warning that both
 * pages need until the business has had them checked.
 */
export function LegalPage({
  title,
  eyebrow,
  lead,
  href,
  updated,
  sections,
  children,
}: {
  title: string;
  eyebrow: string;
  lead: string;
  href: string;
  updated: string;
  sections: Array<{ id: string; heading: string }>;
  children: React.ReactNode;
}) {
  return (
    <>
      <PageHero
        eyebrow={eyebrow}
        title={title}
        lead={lead}
        breadcrumbs={[{ href, label: title }]}
      />

      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-16">
            {/* Table of contents */}
            <nav aria-label="On this page" className="lg:sticky lg:top-28 lg:self-start">
              <p className="text-xs font-bold tracking-[0.14em] text-night-400 uppercase">
                On this page
              </p>
              <ol className="mt-4 space-y-1">
                {sections.map((s, i) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="flex gap-2.5 rounded-lg px-3 py-2 text-sm text-night-600 transition-colors hover:bg-night-100 hover:text-night-900"
                    >
                      <span className="font-bold text-night-300">{i + 1}.</span>
                      {s.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div>
              <p className="text-sm font-semibold text-night-400">
                Last updated: {updated}
              </p>

              <div className="mt-6">
                <Alert tone="warning" title="Template — have this reviewed">
                  This document was drafted as a starting point for an Australian
                  commercial passenger vehicle operator. It has <strong>not</strong>{" "}
                  been reviewed by a lawyer. Have a qualified Australian legal
                  practitioner review and adapt it to your actual operation before
                  you rely on it.
                </Alert>
              </div>

              <div className="mt-10 space-y-12">{children}</div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

export function LegalSection({
  id,
  heading,
  children,
}: {
  id: string;
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28">
      <h2 className="font-display text-2xl font-extrabold text-night-900">
        {heading}
      </h2>
      <div className="prose-article mt-4">{children}</div>
    </section>
  );
}
