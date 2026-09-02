interface SectionHeadingProps {
  mark: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
}

export default function SectionHeading({
  mark,
  title,
  description,
  align = "left",
  tone = "light",
}: SectionHeadingProps) {
  const isCenter = align === "center";
  const isDark = tone === "dark";

  return (
    <div className={`max-w-xl ${isCenter ? "mx-auto text-center" : ""}`}>
      <div
        className={`mb-4 flex items-center gap-3 text-sm ${
          isCenter ? "justify-center" : ""
        } ${isDark ? "text-brand-bright" : "text-brand-deep"}`}
      >
        <span className="h-px w-8 bg-current opacity-60" />
        {mark}
      </div>
      <h2
        className={`text-[2.1rem] leading-[1.15] sm:text-4xl ${
          isDark ? "text-paper" : "text-ink"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-4 text-[15.5px] leading-relaxed ${
            isDark ? "text-paper/70" : "text-stone"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
