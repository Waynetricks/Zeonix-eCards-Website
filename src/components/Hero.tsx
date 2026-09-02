import Button from "./ui/Button";
import HeroShowcase from "./HeroShowcase";
import WhatsAppButton from "./ui/WhatsAppButton";

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-paper pt-[72px]">
      <div className="pointer-events-none absolute inset-0 bg-grain" />
      <div className="container-content grid items-center gap-16 py-20 sm:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
        <div className="animate-rise">
          <div className="eyebrow-mark">
            <span className="h-px w-8 bg-current opacity-60" />
            Zeonix Software Company &middot; Dar es Salaam
          </div>
          <h1 className="mt-6 text-[2.6rem] leading-[1.08] text-ink sm:text-5xl lg:text-[3.4rem]">
            Make every invitation unforgettable
          </h1>
          <p className="mt-6 max-w-lg text-[16.5px] leading-relaxed text-stone">
            Zeonix eCards designs personalised digital invitations for
            weddings, birthdays, send-offs and every occasion worth
            celebrating — each one carrying its own QR code, so you always
            know who's walking through the door.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Button href="#contact" variant="primary">
              Get Started
            </Button>
            <Button href="#gallery" variant="ghost">
              View Designs
            </Button>
            <WhatsAppButton variant="secondary" size="md" className="border-green-600 text-green-600">
              Chat Now
            </WhatsAppButton>
          </div>

          <div className="mt-14 flex items-center gap-8 border-t border-ink/10 pt-8">
            <div>
              <p className="font-display text-2xl text-ink">Unique</p>
              <p className="mt-1 text-[13px] text-stone">QR code per guest</p>
            </div>
            <div className="h-9 w-px bg-ink/10" />
            <div>
              <p className="font-display text-2xl text-ink">Live</p>
              <p className="mt-1 text-[13px] text-stone">attendance tracking</p>
            </div>
            <div className="h-9 w-px bg-ink/10" />
            <div>
              <p className="font-display text-2xl text-ink">Instant</p>
              <p className="mt-1 text-[13px] text-stone">WhatsApp delivery</p>
            </div>
          </div>
        </div>

        <HeroShowcase />
      </div>
    </section>
  );
}
