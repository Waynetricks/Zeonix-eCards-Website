import SectionHeading from "./ui/SectionHeading";
import { Sparkles, Share2, ScanQrCode, Clock, UserCog, ClipboardList } from "lucide-react";

const reasons = [
  {
    icon: Sparkles,
    title: "Designs made to be remembered",
    description: "Each invitation is composed for the occasion, not pulled from a generic template pack.",
  },
  {
    icon: Share2,
    title: "Shares in one tap",
    description: "Guests receive their card straight on WhatsApp — no app to download, no link to lose.",
  },
  {
    icon: ScanQrCode,
    title: "Built-in QR technology",
    description: "Every card doubles as a guest pass, scannable at the door for instant check-in.",
  },
  {
    icon: Clock,
    title: "Convenient from anywhere",
    description: "Send us your list from your phone; we handle the design, the coding, and the delivery.",
  },
  {
    icon: UserCog,
    title: "Personalised, guest by guest",
    description: "Names, titles and seating notes are set individually, at no extra design effort on your side.",
  },
  {
    icon: ClipboardList,
    title: "Guest management, sorted",
    description: "See who's confirmed, who's arrived, and how many are still expected — all in one place.",
  },
];

export default function WhyZeonix() {
  return (
    <section className="bg-ink py-24 sm:py-28">
      <div className="container-content">
        <SectionHeading
          mark="Why Zeonix"
          title="Invitations that do more than look good"
          tone="dark"
        />

        <div className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason) => (
            <div key={reason.title} className="border-t border-paper/15 pt-6">
              <reason.icon size={20} strokeWidth={1.5} className="text-brand-bright" />
              <h3 className="mt-4 text-[1.05rem] text-paper">{reason.title}</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-paper/60">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
