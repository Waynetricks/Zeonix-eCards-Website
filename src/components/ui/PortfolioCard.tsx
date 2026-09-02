import { Expand } from "lucide-react";
import type { PortfolioDesign } from "../../types";

interface PortfolioCardProps {
  design: PortfolioDesign;
  onOpen: () => void;
}

export default function PortfolioCard({ design, onOpen }: PortfolioCardProps) {
  return (
    <button
      onClick={onOpen}
      className="group mb-5 block w-full break-inside-avoid overflow-hidden rounded-[8px] border border-ink/10 bg-paper text-left shadow-soft transition-shadow duration-300 hover:shadow-card sm:mb-7"
      aria-label={`View ${design.title} — ${design.category} invitation, full size`}
    >
      <div className="relative overflow-hidden bg-paper-dim">
        <img
          src={design.image}
          width={design.width}
          height={design.height}
          loading="lazy"
          alt={`${design.title} — ${design.category} invitation design by Zeonix eCards`}
          className="block w-full transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-ink/0 opacity-0 transition-all duration-300 group-hover:bg-ink/25 group-hover:opacity-100">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-paper/95 text-ink">
            <Expand size={17} strokeWidth={1.7} />
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 px-4 py-3.5">
        <span className="text-[14px] text-ink">{design.title}</span>
        <span className="whitespace-nowrap text-[11.5px] tracking-wide text-brand-deep">
          {design.category}
        </span>
      </div>
    </button>
  );
}
