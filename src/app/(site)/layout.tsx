import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { MobileBookBar } from "@/components/site/MobileBookBar";

/**
 * Chrome for the public-facing site. The admin panel lives outside this route
 * group so it gets none of it.
 */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <a
        href="#main"
        className="sr-focusable z-100 m-4 rounded-lg bg-night-900 px-5 py-3 font-bold text-taxi-400"
      >
        Skip to main content
      </a>

      <Header />

      <main id="main" className="flex-1">
        {children}
      </main>

      <Footer />
      <MobileBookBar />
    </>
  );
}
