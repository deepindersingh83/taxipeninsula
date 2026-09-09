import type { Metadata } from "next";
import Link from "next/link";

import { LegalPage, LegalSection } from "@/components/site/LegalPage";
import { fullAddress, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: `The terms on which ${site.name} provides commercial passenger vehicle services in Victoria, Australia.`,
  alternates: { canonical: "/terms" },
};

const UPDATED = "9 September 2026";

const sections = [
  { id: "about", heading: "About these terms" },
  { id: "bookings", heading: "Bookings and confirmation" },
  { id: "fares", heading: "Fares, quotes and payment" },
  { id: "cancellations", heading: "Cancellations, changes and no-shows" },
  { id: "vehicles", heading: "Vehicles and availability" },
  { id: "accessible", heading: "Wheelchair accessible and assisted travel" },
  { id: "ndis", heading: "NDIS, TAC and subsidised travel" },
  { id: "conduct", heading: "Passenger conduct and safety" },
  { id: "luggage", heading: "Luggage, property and lost items" },
  { id: "delays", heading: "Delays and matters outside our control" },
  { id: "liability", heading: "Liability and Australian Consumer Law" },
  { id: "complaints", heading: "Complaints" },
  { id: "privacy", heading: "Privacy" },
  { id: "changes", heading: "Changes to these terms" },
  { id: "law", heading: "Governing law" },
  { id: "contact", heading: "How to contact us" },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      eyebrow="Legal"
      href="/terms"
      lead="The terms on which we accept bookings and provide transport. Plain English wherever possible — if anything here is unclear, ask us before you travel."
      updated={UPDATED}
      sections={sections}
    >
      <LegalSection id="about" heading="1. About these terms">
        <p>
          These Terms and Conditions govern the transport services provided by{" "}
          {site.legalName} (ABN {site.abn}) (<strong>&ldquo;we&rdquo;</strong>,{" "}
          <strong>&ldquo;us&rdquo;</strong>, <strong>&ldquo;our&rdquo;</strong>),
          and your use of this website.
        </p>
        <p>
          By requesting a booking — through this website, by telephone, by email
          or through any other channel — you agree to these terms. If you do not
          agree to them, please do not book.
        </p>
        <p>
          We operate as a commercial passenger vehicle service in Victoria,
          Australia, and are subject to the{" "}
          <em>Commercial Passenger Vehicle Industry Act 2017</em> (Vic) and
          associated regulations.
        </p>
      </LegalSection>

      <LegalSection id="bookings" heading="2. Bookings and confirmation">
        <p>
          <strong>
            A booking request submitted through this website is a request, not a
            confirmed trip.
          </strong>{" "}
          No contract for transport is formed until we confirm the booking with
          you directly, by telephone, SMS or email.
        </p>
        <ul>
          <li>
            We will use reasonable efforts to respond to booking requests
            promptly, but we do not guarantee any particular response time.
          </li>
          <li>
            For any pickup within two hours, please telephone{" "}
            <a href={`tel:${site.phoneHref}`}>{site.phone}</a> rather than relying
            on the online form.
          </li>
          <li>
            You are responsible for the accuracy of the details you give us,
            including pickup address, date, time, destination, passenger numbers
            and any accessibility requirements.
          </li>
          <li>
            We may decline a booking request at our discretion, including where
            no suitable vehicle is available, or where we reasonably believe the
            trip would be unsafe or unlawful.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="fares" heading="3. Fares, quotes and payment">
        <p>
          Fares are <strong>quoted on request</strong>. We will provide a quote
          or explain the applicable fare basis before your trip commences.
        </p>
        <ul>
          <li>
            A quote is based on the details you provide. If the actual trip
            differs materially — additional stops, a changed destination, a
            longer wait, more passengers — the fare may change accordingly, and
            we will tell you before proceeding where practicable.
          </li>
          <li>
            Where a trip is metered rather than quoted, the fare is calculated in
            accordance with applicable Victorian regulations.
          </li>
          <li>
            Tolls, airport access fees, parking charges and government levies may
            be added to the fare where they are incurred on your trip.
          </li>
          <li>
            Additional charges may apply for waiting time beyond a reasonable
            grace period, cleaning required as a result of a passenger&rsquo;s
            conduct, or specialist equipment requested at short notice.
          </li>
          <li>
            We accept the payment methods advised at the time of booking.
            Payment is due on completion of the trip unless account terms have
            been agreed in writing.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="cancellations" heading="4. Cancellations, changes and no-shows">
        <ul>
          <li>
            Please give us as much notice as possible if you need to cancel or
            change a booking. Telephone is the fastest way to do this.
          </li>
          <li>
            A cancellation fee may apply where a vehicle has already been
            dispatched, or where a booking is cancelled at short notice —
            particularly for wheelchair accessible vehicles, charters and
            pre-arranged airport transfers.
          </li>
          <li>
            If a passenger is not present at the pickup location within a
            reasonable waiting period after the booked time and cannot be
            contacted, the booking may be treated as a no-show and a fee may
            apply.
          </li>
          <li>
            We will tell you the applicable cancellation or no-show fee at the
            time of booking, or on request.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="vehicles" heading="5. Vehicles and availability">
        <p>
          We will use reasonable efforts to supply the vehicle type you have
          requested. Vehicle allocation depends on availability, and we may
          substitute a vehicle of equivalent or greater capacity where necessary.
        </p>
        <p>
          Seating capacities stated on this website are maximums. Actual capacity
          may be reduced by luggage, wheelchairs, child restraints or mobility
          equipment.
        </p>
      </LegalSection>

      <LegalSection id="accessible" heading="6. Wheelchair accessible and assisted travel">
        <p>
          Wheelchair accessible vehicles (WAT) are a limited part of any fleet,
          including ours. Please tell us at the time of booking that you require
          one.
        </p>
        <ul>
          <li>
            Advance notice significantly improves availability. Same-day
            wheelchair accessible bookings cannot be guaranteed.
          </li>
          <li>
            Passengers travelling in a wheelchair will be secured using the
            restraint system fitted to the vehicle. For safety and legal reasons,
            our drivers cannot transport a passenger whose wheelchair or mobility
            device cannot be safely restrained.
          </li>
          <li>
            Please tell us the type and approximate dimensions of the wheelchair
            or mobility device when booking, so we allocate a suitable vehicle.
          </li>
          <li>
            Assistance animals are welcome in all our vehicles in accordance with
            the <em>Disability Discrimination Act 1992</em> (Cth) and Victorian
            law, at no additional charge.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="ndis" heading="7. NDIS, TAC and subsidised travel">
        <p>
          We are a registered NDIS provider and are approved for Transport
          Accident Commission client transport. If you intend to use plan
          funding, a TAC claim, a Multi Purpose Taxi Program (MPTP) card or any
          other subsidy:
        </p>
        <ul>
          <li>
            Tell us <strong>at the time of booking</strong>, not at the end of
            the trip. We cannot always apply a subsidy retrospectively.
          </li>
          <li>
            You must present a valid card or provide valid plan or claim details.
          </li>
          <li>
            Eligibility for any scheme is determined by the relevant scheme
            administrator, not by us. Where a claim is declined by the scheme,
            you remain responsible for the fare.
          </li>
          <li>
            Subsidy schemes and their rules change from time to time. We apply
            the rules in force at the date of travel.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="conduct" heading="8. Passenger conduct and safety">
        <ul>
          <li>
            Seatbelts must be worn by all passengers where fitted, as required by
            Victorian road law.
          </li>
          <li>
            Children must travel in an approved child restraint appropriate to
            their age and size. Tell us when booking so a suitable restraint is
            fitted.
          </li>
          <li>Smoking, including vaping, is not permitted in our vehicles.</li>
          <li>
            Our drivers may refuse to commence or continue a trip where a
            passenger is behaving in a way that is unsafe, abusive, threatening
            or unlawful, or where the driver reasonably believes their safety is
            at risk.
          </li>
          <li>
            A cleaning fee may be charged where a vehicle requires cleaning
            beyond normal use as a result of a passenger&rsquo;s conduct.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="luggage" heading="9. Luggage, property and lost items">
        <ul>
          <li>
            Luggage capacity varies by vehicle. Please tell us what you are
            carrying when booking so we allocate an appropriate vehicle.
          </li>
          <li>
            Passengers are responsible for their own belongings. We recommend
            checking the vehicle before you leave it.
          </li>
          <li>
            We will make reasonable efforts to return property left in a vehicle,
            but we are not liable for loss of or damage to personal property
            except to the extent required by law.
          </li>
          <li>
            To report a lost item, contact us on{" "}
            <a href={`tel:${site.phoneHref}`}>{site.phone}</a> with the date,
            time and route of your trip.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="delays" heading="10. Delays and matters outside our control">
        <p>
          We will use reasonable efforts to arrive at the booked time and to
          complete your trip within a reasonable period. However, journey times
          are estimates only and can be affected by matters outside our
          reasonable control, including traffic, road closures, weather,
          accidents, breakdowns, flight schedule changes and acts of government.
        </p>
        <p>
          Where you have provided a flight number for an airport pickup, we will
          use reasonable efforts to monitor that flight and adjust the pickup
          time accordingly.
        </p>
        <p>
          We strongly recommend allowing generous time for airport, ferry and
          cruise departures. We are not liable for missed flights, sailings,
          connections, appointments or events except to the extent set out in
          section 11.
        </p>
      </LegalSection>

      <LegalSection id="liability" heading="11. Liability and Australian Consumer Law">
        <p>
          <strong>
            Nothing in these terms excludes, restricts or modifies any consumer
            guarantee, right or remedy conferred by the Australian Consumer Law
            (Schedule 2 to the <em>Competition and Consumer Act 2010</em> (Cth))
            or any other law that cannot lawfully be excluded or limited.
          </strong>
        </p>
        <p>
          Our services come with guarantees that cannot be excluded under the
          Australian Consumer Law, including that services will be provided with
          due care and skill.
        </p>
        <p>
          To the extent permitted by law, and other than in respect of a
          non-excludable guarantee, our liability arising out of or in connection
          with a trip is limited, at our option, to resupplying the service or
          paying the cost of having the service resupplied.
        </p>
        <p>
          To the extent permitted by law, we are not liable for indirect or
          consequential loss, including loss of profits, loss of opportunity, or
          costs arising from a missed flight, connection, appointment or event.
        </p>
      </LegalSection>

      <LegalSection id="complaints" heading="12. Complaints">
        <p>
          If something has gone wrong, tell us. Contact us on{" "}
          <a href={`tel:${site.phoneHref}`}>{site.phone}</a> or{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a> with the date, time
          and details of the trip, and we will investigate.
        </p>
        <p>
          If you are not satisfied with our response, you may be able to raise
          the matter with Safe Transport Victoria or Consumer Affairs Victoria.
        </p>
      </LegalSection>

      <LegalSection id="privacy" heading="13. Privacy">
        <p>
          Our handling of your personal information is described in our{" "}
          <Link href="/privacy">Privacy Policy</Link>, which forms part of these
          terms.
        </p>
      </LegalSection>

      <LegalSection id="changes" heading="14. Changes to these terms">
        <p>
          We may update these terms from time to time. The version published on
          this website at the time you make a booking is the version that applies
          to that booking. The &ldquo;last updated&rdquo; date at the top of this
          page shows when it was last changed.
        </p>
      </LegalSection>

      <LegalSection id="law" heading="15. Governing law">
        <p>
          These terms are governed by the laws of the State of Victoria,
          Australia. You and we submit to the non-exclusive jurisdiction of the
          courts of Victoria.
        </p>
      </LegalSection>

      <LegalSection id="contact" heading="16. How to contact us">
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
      </LegalSection>
    </LegalPage>
  );
}
