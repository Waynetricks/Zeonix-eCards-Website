import { useState } from "react";
import SectionHeading from "./ui/SectionHeading";
import PortfolioCard from "./ui/PortfolioCard";
import Lightbox from "./ui/Lightbox";
import Button from "./ui/Button";
import { portfolioDesigns } from "../data/portfolio";
import type { EventCategory } from "../types";

const categories: Array<EventCategory | "All"> = [
  "All",
  "Wedding",
  "Birthday",
  "Send-off",
  "Kitchen Party",
  "Graduation",
  "Custom Event",
];

export default function Gallery() {
  const [active, setActive] = useState<EventCategory | "All">("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered =
    active === "All"
      ? portfolioDesigns
      : portfolioDesigns.filter((d) => d.category === active);

  return (
    <section id="gallery" className="bg-paper-dim py-24 sm:py-28">
      <div className="container-content">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            mark="Gallery"
            title="Real invitations, from real celebrations"
            description="A selection of designs we've created for Zeonix eCards clients. Tap any card to view it full size."
          />

          <div className="flex flex-wrap gap-2 lg:justify-end">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`rounded-full border px-4 py-2 text-[13.5px] transition-colors ${
                  active === cat
                    ? "border-ink bg-ink text-paper"
                    : "border-ink/15 text-ink/70 hover:border-ink/40"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-14">
          {filtered.length > 0 ? (
            <div className="columns-2 gap-5 sm:gap-7 lg:columns-3">
              {filtered.map((design, i) => (
                <PortfolioCard
                  key={design.id}
                  design={design}
                  onOpen={() => setLightboxIndex(i)}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-[8px] border border-dashed border-ink/15 py-20 text-center">
              <p className="text-[15px] text-stone">
                More {active} designs are on the way — check back soon, or
                get in touch and we'll design yours first.
              </p>
            </div>
          )}
        </div>

        <div className="mt-20 flex flex-col items-center gap-6 border-t border-ink/10 pt-16 text-center">
          <h3 className="max-w-md text-[1.6rem] leading-tight text-ink">
            Love what you see? Create yours with Zeonix eCards.
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Button href="#contact" variant="secondary">
              Get Started
            </Button>
            <Button href="#contact" variant="ghost">
              Order Now
            </Button>
          </div>
        </div>
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          designs={filtered}
          activeIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </section>
  );
}
