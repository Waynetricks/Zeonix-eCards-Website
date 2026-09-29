import { MessageCircle } from "lucide-react";
import InstagramIcon from "./ui/InstagramIcon";
import { openWhatsApp } from "../config";

const columns = [
  {
    title: "Explore",
    links: [
      { label: "Services", href: "#services" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "Smart Invitations", href: "#smart-invitations" },
      { label: "Gallery", href: "#gallery" },
    ],
  },
  {
    title: "Studio",
    links: [
      { label: "About Us", href: "#about" },
      { label: "Contact & Order", href: "#contact" },
      { label: "Zeonix Software Company", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-ink pt-20">
      <div className="container-content grid gap-14 pb-14 sm:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <a href="#top" className="inline-flex rounded-lg bg-paper p-3">
            <img
              src="/brand/zeonix-logo-full.png"
              alt="Zeonix eCards"
              className="h-14 w-auto"
            />
          </a>
          <p className="mt-5 max-w-xs text-[14.5px] leading-relaxed text-paper/55">
            Digital invitations with built-in QR-code guest management, from
            Zeonix Software Company in Dar es Salaam.
          </p>
          <div className="mt-6 flex gap-3">
            <a
              href="https://instagram.com/zeonix_ecards"
              className="grid h-10 w-10 place-items-center rounded-full border border-paper/20 text-paper/80 transition-colors hover:border-brand-bright hover:text-brand-bright"
              aria-label="Instagram"
            >
              <InstagramIcon size={17} />
            </a>
            <button
              onClick={() => openWhatsApp()}
              className="flex items-center gap-2 rounded-full border border-green-500 bg-green-500 px-4 py-2 text-[14px] font-medium text-white transition-colors hover:bg-green-600 hover:border-green-600"
              aria-label="Chat with us on WhatsApp"
            >
              <MessageCircle size={16} />
              Chat Now
            </button>
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <p className="text-[13px] text-paper/45">{col.title}</p>
            <ul className="mt-4 space-y-3">
              {col.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[14.5px] text-paper/75 transition-colors hover:text-brand-bright"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-paper/10 py-6">
        <div className="container-content flex flex-col items-center justify-between gap-3 text-[13px] text-paper/45 sm:flex-row">
          <p>&copy; 2026 Zeonix eCards. All rights reserved.</p>
          <p>Kinondoni Studio, Dar es Salaam, Tanzania</p>
        </div>
      </div>
    </footer>
  );
}
