import { useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { PortfolioDesign } from "../../types";

interface LightboxProps {
  designs: PortfolioDesign[];
  activeIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function Lightbox({
  designs,
  activeIndex,
  onClose,
  onNavigate,
}: LightboxProps) {
  const design = designs[activeIndex];

  const goPrev = useCallback(() => {
    onNavigate((activeIndex - 1 + designs.length) % designs.length);
  }, [activeIndex, designs.length, onNavigate]);

  const goNext = useCallback(() => {
    onNavigate((activeIndex + 1) % designs.length);
  }, [activeIndex, designs.length, onNavigate]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = original;
    };
  }, [onClose, goPrev, goNext]);

  if (!design) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/92 p-4 backdrop-blur-sm sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={`${design.title} — ${design.category} invitation, full preview`}
      onClick={onClose}
    >
      <button
        onClick={onClose}
        aria-label="Close preview"
        className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-paper/10 text-paper transition-colors hover:bg-paper/20 sm:right-8 sm:top-8"
      >
        <X size={20} />
      </button>

      {designs.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            aria-label="Previous design"
            className="absolute left-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-paper/10 text-paper transition-colors hover:bg-paper/20 sm:left-6"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            aria-label="Next design"
            className="absolute right-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-paper/10 text-paper transition-colors hover:bg-paper/20 sm:right-6"
          >
            <ChevronRight size={22} />
          </button>
        </>
      )}

      <div
        className="flex max-h-full max-w-full flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={design.image}
          alt={`${design.title} — ${design.category} invitation design by Zeonix eCards`}
          className="max-h-[78vh] w-auto max-w-full rounded-md object-contain shadow-card sm:max-h-[82vh]"
        />
        <p className="mt-5 text-center text-[14.5px] text-paper/80">
          <span className="text-paper">{design.title}</span>
          <span className="mx-2 opacity-40">&middot;</span>
          {design.category}
        </p>
      </div>
    </div>
  );
}
