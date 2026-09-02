import SectionHeading from "./ui/SectionHeading";
import type { FeatureItem } from "../types";
import { ScanLine, Users2, CheckCircle2, Send } from "lucide-react";

const features: FeatureItem[] = [
  {
    title: "A card made for one guest",
    description:
      "Names, titles and messages are set per guest, so every invitation feels personally written — not mass-sent.",
  },
  {
    title: "One QR code, one guest",
    description:
      "Each card carries a unique QR code linked only to that guest, making it impossible to duplicate or forward on.",
  },
  {
    title: "Single or double guest support",
    description:
      "Invite one person or a plus-one on the same card, and we'll track both against your final guest count.",
  },
  {
    title: "Attendance, tracked live",
    description:
      "Scan codes at the entrance and watch arrivals update in real time — no clipboard, no guesswork.",
  },
];

const icons = [Users2, ScanLine, Send, CheckCircle2];

export default function SmartInvitations() {
  return (
    <section id="smart-invitations" className="bg-paper py-24 sm:py-28">
      <div className="container-content grid gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <SectionHeading
          mark="Smart invitations"
          title="Every card is an invitation and a guest list, in one"
          description="Behind every Zeonix eCard is a small system: it knows who was invited, whether they're bringing someone, and whether they've arrived."
        />

        <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
          {features.map((feature, i) => {
            const Icon = icons[i];
            return (
              <div key={feature.title}>
                <div className="grid h-11 w-11 place-items-center rounded-full bg-brand-soft">
                  <Icon size={18} strokeWidth={1.6} className="text-brand-deep" />
                </div>
                <h3 className="mt-4 text-[1.05rem] text-ink">{feature.title}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-stone">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
