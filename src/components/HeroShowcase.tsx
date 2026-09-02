import { useRef, useState, type CSSProperties, type MouseEvent as ReactMouseEvent } from "react";
import { portfolioDesigns } from "../data/portfolio";

const featured = [
  portfolioDesigns.find((d) => d.id === "p1")!, // Andrew & Janeth — black & gold
  portfolioDesigns.find((d) => d.id === "p6")!, // Mevis — white, teal & gold
  portfolioDesigns.find((d) => d.id === "p2")!, // Stanslaus & Mevis — burgundy & gold
];

interface CardSpec {
  design: (typeof featured)[number];
  className: string;
  rotate: number;
  z: number;
  delay: string;
}

const cards: CardSpec[] = [
  {
    design: featured[0],
    className: "left-[2%] top-[2%] w-[58%]",
    rotate: -7,
    z: 10,
    delay: "0s",
  },
  {
    design: featured[1],
    className: "bottom-[3%] right-[0%] w-[52%]",
    rotate: 6,
    z: 20,
    delay: "0.6s",
  },
  {
    design: featured[2],
    className: "bottom-[16%] left-[20%] w-[34%]",
    rotate: -4,
    z: 30,
    delay: "1.1s",
  },
];

function FramedCard({
  design,
  rotate,
}: {
  design: (typeof featured)[number];
  rotate: number;
}) {
  return (
    <div
      className="group/card overflow-hidden rounded-[10px] border border-ink/10 bg-paper p-1.5 shadow-card ring-1 ring-brand/10 transition-all duration-500 ease-out [transform:rotate(var(--rot))] hover:z-40 hover:[transform:translateY(-10px)_scale(1.06)_rotate(0deg)] hover:shadow-[0_32px_70px_-20px_rgba(12,37,33,0.45)] hover:ring-brand/30"
      style={{ "--rot": `${rotate}deg` } as CSSProperties}
    >
      <div
        className="overflow-hidden rounded-[6px] bg-paper-dim"
        style={{ aspectRatio: `${design.width} / ${design.height}` }}
      >
        <img
          src={design.image}
          alt={`${design.title} — invitation design by Zeonix eCards`}
          className="h-full w-full object-contain"
          loading="eager"
        />
      </div>
    </div>
  );
}

export default function HeroShowcase() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  function handleMouseMove(e: ReactMouseEvent<HTMLDivElement>) {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: px * 7, y: py * -7 });
  }

  function handleMouseLeave() {
    setTilt({ x: 0, y: 0 });
  }

  return (
    <div className="relative mx-auto w-full max-w-[420px]">
      {/* soft brand-colored glow behind the cluster */}
      <div className="pointer-events-none absolute inset-[6%] -z-10 rounded-full bg-brand/20 blur-3xl" />

      {/* Desktop / tablet: layered floating cluster */}
      <div
        ref={wrapRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative hidden h-[460px] sm:h-[520px] lg:block"
        style={{ perspective: "1200px" }}
      >
        <div
          className="relative h-full w-full transition-transform duration-300 ease-out"
          style={{
            transform: `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          {cards.map((card) => (
            <div
              key={card.design.id}
              className={`absolute animate-drift ${card.className} hover:[animation-play-state:paused]`}
              style={{ zIndex: card.z, animationDelay: card.delay }}
            >
              <FramedCard design={card.design} rotate={card.rotate} />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile: compact horizontal-scroll strip so the page doesn't grow tall */}
      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden">
        {featured.map((design) => (
          <div key={design.id} className="w-[72%] flex-none snap-center">
            <FramedCard design={design} rotate={0} />
          </div>
        ))}
      </div>
    </div>
  );
}
