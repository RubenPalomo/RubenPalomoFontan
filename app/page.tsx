import { ContactSection } from "@/components/contact-section";
import { Hero } from "@/components/hero";
import { NewsletterSection } from "@/components/newsletter-section";
import { Services } from "@/components/services";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { structuredData } from "@/lib/site";

export default function Home() {
  const serializedStructuredData = JSON.stringify(structuredData).replace(/</g, "\\u003c");

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializedStructuredData }} />
      <a className="skip-link" href="#contenido">
        Saltar al contenido principal
      </a>
      <SiteHeader />
      <main id="contenido">
        <Hero />
        <Services />
        <NewsletterSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </>
  );
}
