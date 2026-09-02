import SectionHeading from "./ui/SectionHeading";
import type { ProcessStep } from "../types";

const steps: ProcessStep[] = [
  {
    order: 1,
    title: "Choose a design",
    description:
      "Browse our gallery and pick a card that fits your event — or tell us your theme and we'll design one for you.",
  },
  {
    order: 2,
    title: "Share event & guest details",
    description:
      "Send us your event information and guest list. We handle names, single or double invites, and any special notes.",
  },
  {
    order: 3,
    title: "Personalisation & QR codes",
    description:
      "Every guest's card is personalised with their name and a unique QR code, generated automatically for check-in.",
  },
  {
    order: 4,
    title: "Digital delivery",
    description:
      "Cards are sent straight to your guests on WhatsApp or SMS, ready to be scanned at the door on the day.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-ink py-24 sm:py-28">
      <div className="container-content">
        <SectionHeading
          mark="How it works"
          title="From idea to invitation, in four steps"
          tone="dark"
        />

        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {steps.map((step, i) => (
            <div key={step.order} className="relative pl-0">
              <div className="flex items-baseline gap-3">
                <span className="font-display text-3xl text-brand-bright">
                  {step.order}
                </span>
                <span className="h-px flex-1 bg-paper/15" />
              </div>
              <h3 className="mt-5 text-[1.15rem] text-paper">{step.title}</h3>
              <p className="mt-2.5 text-[14.5px] leading-relaxed text-paper/60">
                {step.description}
              </p>
              {i < steps.length - 1 && (
                <span className="absolute -right-3 top-2 hidden text-paper/20 lg:block">
                  &#8250;
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
