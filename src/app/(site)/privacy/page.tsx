import type { Metadata } from "next";
import Link from "next/link";

import { LegalPage, LegalSection } from "@/components/site/LegalPage";
import { fullAddress, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${site.name} collects, uses, stores and protects your personal information, in accordance with the Privacy Act 1988 (Cth) and the Australian Privacy Principles.`,
  alternates: { canonical: "/privacy" },
};

const UPDATED = "9 September 2026";

const sections = [
  { id: "intro", heading: "Introduction" },
  { id: "collect", heading: "What we collect" },
  { id: "how", heading: "How we collect it" },
  { id: "why", heading: "Why we collect it" },
  { id: "disclose", heading: "Who we share it with" },
  { id: "recaptcha", heading: "Google reCAPTCHA" },
  { id: "cookies", heading: "Cookies and analytics" },
  { id: "storage", heading: "Storage and security" },
  { id: "retention", heading: "How long we keep it" },
  { id: "overseas", heading: "Overseas disclosure" },
  { id: "access", heading: "Accessing and correcting your information" },
  { id: "complaints", heading: "Complaints" },
  { id: "changes", heading: "Changes to this policy" },
  { id: "contact", heading: "How to contact us" },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      eyebrow="Legal"
      href="/privacy"
      lead="What we collect when you book a ride or send us a message, why we collect it, who sees it, and how to get it back or have it deleted."
      updated={UPDATED}
      sections={sections}
    >
      <LegalSection id="intro" heading="1. Introduction">
        <p>
          {site.legalName} (ABN {site.abn}) (<strong>&ldquo;we&rdquo;</strong>,{" "}
          <strong>&ldquo;us&rdquo;</strong>, <strong>&ldquo;our&rdquo;</strong>)
          respects your privacy. This policy explains how we handle personal
          information in accordance with the{" "}
          <em>Privacy Act 1988</em> (Cth) and the Australian Privacy Principles
          (APPs).
        </p>
        <p>
          It applies to this website and to the transport services we provide.
        </p>
      </LegalSection>

      <LegalSection id="collect" heading="2. What we collect">
        <p>When you request a booking, we collect:</p>
        <ul>
          <li>your name;</li>
          <li>your telephone number;</li>
          <li>your email address (optional);</li>
          <li>your pickup date and time;</li>
          <li>your pickup and drop-off locations;</li>
          <li>the vehicle type and number of passengers;</li>
          <li>
            optional details you choose to provide — flight number, luggage,
            wheelchair space requirements and notes for the driver.
          </li>
        </ul>
        <p>When you use the contact form, we collect your name, email address, optional telephone number, subject and message.</p>
        <p>
          <strong>Sensitive information.</strong> If you tell us about a
          disability, a mobility device, an assistance animal, an NDIS plan or a
          TAC claim, that is <em>sensitive information</em> under the Privacy
          Act. We collect it only because it is reasonably necessary to provide
          transport safely and to bill the trip correctly, and we collect it with
          your consent — you give it to us voluntarily when you book. We do not
          use it for any other purpose.
        </p>
        <p>
          Our servers also automatically record standard technical information
          such as IP address, browser type and pages visited.
        </p>
      </LegalSection>

      <LegalSection id="how" heading="3. How we collect it">
        <p>
          We collect personal information directly from you — through the booking
          form on this website, the contact form, by telephone, by email, by SMS
          or in person with a driver.
        </p>
        <p>
          We may also collect information from a third party who books on your
          behalf, such as a family member, carer, support coordinator, plan
          manager, hospital, hotel or employer.
        </p>
      </LegalSection>

      <LegalSection id="why" heading="4. Why we collect it">
        <p>We use your personal information to:</p>
        <ul>
          <li>accept, confirm, dispatch and complete your booking;</li>
          <li>allocate a suitable vehicle and driver, including accessible vehicles;</li>
          <li>contact you about your trip, including if a driver is delayed;</li>
          <li>quote, invoice and take payment for the trip;</li>
          <li>claim against an NDIS plan, TAC claim or transport subsidy where you have asked us to;</li>
          <li>respond to your enquiry, feedback or complaint;</li>
          <li>keep records we are required by law to keep;</li>
          <li>detect and prevent fraudulent or abusive use of our booking system.</li>
        </ul>
        <p>
          We do not sell your personal information. We do not use your booking
          details to send you marketing unless you have separately asked us to.
        </p>
      </LegalSection>

      <LegalSection id="disclose" heading="5. Who we share it with">
        <p>We may disclose your personal information to:</p>
        <ul>
          <li>
            <strong>our drivers</strong> — only the details needed to complete
            your trip;
          </li>
          <li>
            <strong>our service providers</strong> — our web host, email provider
            and, where SMS alerts are enabled, our SMS provider;
          </li>
          <li>
            <strong>scheme administrators</strong> — the NDIA, a plan manager,
            the Transport Accident Commission or the Multi Purpose Taxi Program,
            where you have asked us to bill a trip that way;
          </li>
          <li>
            <strong>regulators and law enforcement</strong> — where we are
            required or authorised by law to do so, including under Victorian
            commercial passenger vehicle law;
          </li>
          <li>
            <strong>our professional advisers</strong> — such as accountants and
            lawyers, where necessary.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="recaptcha" heading="6. Google reCAPTCHA">
        <p>
          The forms on this website are protected by Google reCAPTCHA v3, which
          helps us tell real customers from automated abuse.
        </p>
        <p>
          reCAPTCHA collects hardware and software information — such as device
          and application data — and sends it to Google for analysis. This
          information is used to provide, maintain and improve reCAPTCHA and for
          general security purposes; it is not used for personalised advertising
          by Google. Your use of reCAPTCHA is subject to the{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Privacy Policy
          </a>{" "}
          and{" "}
          <a
            href="https://policies.google.com/terms"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms of Service
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection id="cookies" heading="7. Cookies and analytics">
        <p>
          This website uses a small number of cookies. Some are strictly
          necessary — for example, the session cookie that keeps a staff member
          signed in to the administration area.
        </p>
        <p>
          Where analytics are enabled, we may use Google Analytics to understand
          how visitors use the site in aggregate — which pages are read, which
          are not, and where visitors arrive from. This helps us improve the
          site. You can opt out using the{" "}
          <a
            href="https://tools.google.com/dlpage/gaoptout"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Analytics opt-out browser add-on
          </a>
          , or by blocking cookies in your browser settings. Blocking cookies may
          affect how parts of this website work.
        </p>
      </LegalSection>

      <LegalSection id="storage" heading="8. Storage and security">
        <p>
          Booking and enquiry records are stored in a database on our web hosting
          infrastructure. We take reasonable steps to protect personal
          information from misuse, interference, loss, and unauthorised access,
          modification or disclosure — including encrypted connections (HTTPS),
          password-protected administrative access, and limiting staff access to
          those who need it.
        </p>
        <p>
          No method of transmission or storage is completely secure. If we become
          aware of a data breach likely to result in serious harm, we will notify
          affected individuals and the Office of the Australian Information
          Commissioner as required by the Notifiable Data Breaches scheme.
        </p>
      </LegalSection>

      <LegalSection id="retention" heading="9. How long we keep it">
        <p>
          We keep booking and enquiry records for as long as necessary for the
          purposes described in this policy, and for as long as we are required
          to keep them under Australian taxation, commercial passenger vehicle
          and other record-keeping laws — generally at least seven years for
          financial records.
        </p>
        <p>
          When information is no longer needed and we are not required to keep
          it, we take reasonable steps to destroy or de-identify it.
        </p>
      </LegalSection>

      <LegalSection id="overseas" heading="10. Overseas disclosure">
        <p>
          Some of our service providers — including our email provider, analytics
          provider and reCAPTCHA — may store or process data on servers located
          outside Australia, including in the United States. Where we disclose
          personal information to an overseas recipient, we take reasonable steps
          to ensure it is handled consistently with the Australian Privacy
          Principles.
        </p>
      </LegalSection>

      <LegalSection id="access" heading="11. Accessing and correcting your information">
        <p>
          You may ask us for a copy of the personal information we hold about
          you, and you may ask us to correct it if it is inaccurate, out of date,
          incomplete or misleading.
        </p>
        <p>
          Contact us using the details in section 14. We will respond within a
          reasonable period, normally within 30 days. We may need to verify your
          identity first. If we refuse a request, we will tell you why in
          writing.
        </p>
        <p>
          You may also ask us to delete your information. We will do so where we
          are not required by law to retain it.
        </p>
      </LegalSection>

      <LegalSection id="complaints" heading="12. Complaints">
        <p>
          If you believe we have breached the Australian Privacy Principles,
          please contact us first using the details in section 14. We will
          investigate and respond in writing.
        </p>
        <p>
          If you are not satisfied with our response, you may complain to the
          Office of the Australian Information Commissioner (OAIC) at{" "}
          <a
            href="https://www.oaic.gov.au"
            target="_blank"
            rel="noopener noreferrer"
          >
            oaic.gov.au
          </a>{" "}
          or on 1300 363 992.
        </p>
      </LegalSection>

      <LegalSection id="changes" heading="13. Changes to this policy">
        <p>
          We may update this policy from time to time. The current version is
          always published on this page, with the date it was last updated shown
          at the top.
        </p>
      </LegalSection>

      <LegalSection id="contact" heading="14. How to contact us">
        <p>
          For any privacy question, access request or complaint:
        </p>
        <p>
          {site.legalName}
          <br />
          ABN {site.abn}
          <br />
          {fullAddress()}
          <br />
          Telephone: <a href={`tel:${site.phoneHref}`}>{site.phone}</a>
          <br />
          Email: <a href={`mailto:${site.email}`}>{site.email}</a>
        </p>
        <p>
          See also our <Link href="/terms">Terms &amp; Conditions</Link>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
