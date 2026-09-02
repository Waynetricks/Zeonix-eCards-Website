import type { GalleryDesign } from "../../types";

const DARK_BACKGROUNDS = new Set(["#0C2521"]);

function Motif({ motif, stroke }: { motif: GalleryDesign["motif"]; stroke: string }) {
  switch (motif) {
    case "botanical":
      return (
        <g stroke={stroke} strokeWidth="1.1" fill="none" opacity="0.85">
          <path d="M28 30 C 45 55, 40 85, 60 105" />
          <path d="M34 40 C 44 42, 50 50, 46 60" />
          <path d="M40 60 C 50 60, 56 68, 52 78" />
          <path d="M272 390 C 255 365, 260 335, 240 315" />
          <path d="M266 380 C 256 378, 250 370, 254 360" />
          <path d="M260 360 C 250 360, 244 352, 248 342" />
          <circle cx="60" cy="105" r="2.4" fill={stroke} stroke="none" />
          <circle cx="240" cy="315" r="2.4" fill={stroke} stroke="none" />
        </g>
      );
    case "geometric":
      return (
        <g stroke={stroke} strokeWidth="1" fill="none" opacity="0.8">
          <polygon points="150,42 178,66 150,90 122,66" />
          <polygon points="150,330 178,354 150,378 122,354" />
          <line x1="150" y1="90" x2="150" y2="330" strokeDasharray="2 6" opacity="0.5" />
        </g>
      );
    case "arch":
      return (
        <g stroke={stroke} strokeWidth="1.1" fill="none" opacity="0.85">
          <path d="M90 200 A 60 60 0 0 1 210 200 L210 260 L90 260 Z" />
          <path d="M104 200 A 46 46 0 0 1 196 200" opacity="0.5" />
          <line x1="70" y1="260" x2="230" y2="260" />
        </g>
      );
    case "wave":
      return (
        <g stroke={stroke} strokeWidth="1" fill="none" opacity="0.75">
          {[150, 168, 186].map((y) => (
            <path
              key={y}
              d={`M20 ${y} Q 75 ${y - 14} 150 ${y} T 280 ${y}`}
            />
          ))}
        </g>
      );
    case "frame":
      return (
        <g stroke={stroke} strokeWidth="1" fill="none" opacity="0.8">
          <rect x="22" y="22" width="256" height="376" />
          <rect x="30" y="30" width="240" height="360" />
          <path d="M22 22 L38 22 M22 22 L22 38" />
          <path d="M278 22 L262 22 M278 22 L278 38" />
          <path d="M22 398 L38 398 M22 398 L22 382" />
          <path d="M278 398 L262 398 M278 398 L278 382" />
        </g>
      );
    case "confetti":
      return (
        <g fill={stroke} opacity="0.85">
          <circle cx="48" cy="60" r="3" />
          <circle cx="80" cy="42" r="2" />
          <circle cx="252" cy="70" r="2.5" />
          <circle cx="230" cy="340" r="3" />
          <circle cx="60" cy="350" r="2" />
          <rect x="66" y="90" width="8" height="2.4" transform="rotate(30 66 90)" />
          <rect x="220" y="110" width="8" height="2.4" transform="rotate(-20 220 110)" />
          <rect x="90" y="320" width="8" height="2.4" transform="rotate(-15 90 320)" />
        </g>
      );
    default:
      return null;
  }
}

interface InvitationCardProps {
  design: GalleryDesign;
  className?: string;
}

export default function InvitationCard({ design, className = "" }: InvitationCardProps) {
  const bg = design.palette[1];
  const accent = design.palette[0];
  const isDark = DARK_BACKGROUNDS.has(bg);
  const textColor = isDark ? "#FAF8F2" : "#0B1310";

  return (
    <div
      className={`group relative aspect-[5/7] w-full overflow-hidden rounded-[6px] shadow-card ${className}`}
      style={{
        transform: `rotate(${design.rotation}deg)`,
        backgroundColor: bg,
      }}
    >
      <svg viewBox="0 0 300 420" className="absolute inset-0 h-full w-full">
        <Motif motif={design.motif} stroke={accent} />
      </svg>

      <div className="absolute inset-0 flex flex-col justify-between p-6">
        <div className="flex items-center justify-between">
          <span
            className="text-[10.5px] tracking-[0.08em]"
            style={{ color: textColor, opacity: 0.65 }}
          >
            {design.category}
          </span>
          <span
            className="grid h-6 w-6 grid-cols-2 grid-rows-2 gap-[2px] rounded-[3px] p-[3px]"
            style={{ backgroundColor: `${accent}22` }}
            aria-hidden
          >
            <span className="rounded-[1px]" style={{ backgroundColor: accent }} />
            <span className="rounded-[1px] opacity-30" style={{ backgroundColor: accent }} />
            <span className="rounded-[1px] opacity-30" style={{ backgroundColor: accent }} />
            <span className="rounded-[1px]" style={{ backgroundColor: accent }} />
          </span>
        </div>

        <div>
          <p
            className="font-display text-[1.35rem] leading-tight"
            style={{ color: textColor }}
          >
            {design.title}
          </p>
          <p
            className="mt-1.5 text-[11px]"
            style={{ color: textColor, opacity: 0.55 }}
          >
            Zeonix eCards — Dar es Salaam
          </p>
        </div>
      </div>
    </div>
  );
}
