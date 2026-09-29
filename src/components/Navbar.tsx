import { useEffect, useState } from "react";
import { Menu, X, MessageCircle } from "lucide-react";
import { openWhatsApp } from "../config";

const links = [
  { href: "#services", label: "Services" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#smart-invitations", label: "Smart Invitations" },
  { href: "#gallery", label: "Gallery" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open ? "bg-paper/90 backdrop-blur-md shadow-soft" : "bg-transparent"
      }`}
    >
      <div className="container-content flex h-[72px] items-center justify-between">
        <a href="#top" className="flex items-center">
          <img
            src="/brand/zeonix-logo-full.png"
            alt="Zeonix eCards"
            className="h-11 w-auto sm:h-12"
          />
        </a>

        <nav className="hidden items-center gap-9 lg:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[14.5px] text-ink/75 transition-colors hover:text-brand-deep"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href="#contact"
            className="rounded-full bg-ink px-5 py-2.5 text-[14px] font-medium text-paper transition-colors hover:bg-brand-deep"
          >
            Get Started
          </a>
          <button
            onClick={() => openWhatsApp()}
            className="flex items-center gap-2 rounded-full border border-green-600 bg-white px-4 py-2.5 text-[14px] font-medium text-green-600 transition-colors hover:bg-green-50"
            aria-label="Chat with us on WhatsApp"
          >
            <MessageCircle size={16} />
            WhatsApp
          </button>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-full text-ink lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-ink/10 bg-paper px-6 pb-6 pt-2 lg:hidden">
          <nav className="flex flex-col">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-ink/8 py-3.5 text-[15px] text-ink/80"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mt-5 flex flex-col gap-3">
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="block rounded-full bg-ink px-5 py-3 text-center text-[15px] font-medium text-paper"
            >
              Get Started
            </a>
            <button
              onClick={() => {
                setOpen(false);
                openWhatsApp();
              }}
              className="flex items-center justify-center gap-2 rounded-full border border-green-600 bg-white px-5 py-3 text-center text-[15px] font-medium text-green-600"
              aria-label="Chat with us on WhatsApp"
            >
              <MessageCircle size={16} />
              WhatsApp Chat
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
