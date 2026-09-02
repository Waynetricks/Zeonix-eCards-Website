import InvitationCard from "./ui/InvitationCard";
import { mockupDesigns } from "../data/mockups";

export default function AboutUs() {
  return (
    <section id="about" className="bg-paper py-24 sm:py-28">
      <div className="container-content grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <div className="eyebrow-mark">
            <span className="h-px w-8 bg-current opacity-60" />
            About us
          </div>
          <h2 className="mt-6 text-[2rem] leading-[1.2] text-ink sm:text-4xl">
            A creative technology studio, built for celebration
          </h2>
          <div className="mt-6 space-y-4 text-[15.5px] leading-relaxed text-stone">
            <p>
              Zeonix eCards is the digital invitation arm of Zeonix Software
              Company, based in Kinondoni, Dar es Salaam. We bring together
              graphic design and software engineering to turn ordinary
              invitations into something worth keeping.
            </p>
            <p>
              What started as a design service has grown into a small guest
              management system — one that designs your card, generates a QR
              code for every guest, and tracks who walks through the door.
              It's the same care Zeonix brings to all its software, applied
              to the moments that matter most to our clients.
            </p>
          </div>

          <div className="mt-9 grid grid-cols-3 gap-6 border-t border-ink/10 pt-8">
            <div>
              <p className="font-display text-2xl text-ink">Kinondoni</p>
              <p className="mt-1 text-[13px] text-stone">Studio, Dar es Salaam</p>
            </div>
            <div>
              <p className="font-display text-2xl text-ink">Zeonix</p>
              <p className="mt-1 text-[13px] text-stone">Software Company</p>
            </div>
            <div>
              <p className="font-display text-2xl text-ink">Every event</p>
              <p className="mt-1 text-[13px] text-stone">large or intimate</p>
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[300px]">
          <InvitationCard design={{ ...mockupDesigns[4], rotation: 3 }} />
        </div>
      </div>
    </section>
  );
}
