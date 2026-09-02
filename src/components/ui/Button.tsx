import type { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  href: string;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
}

export default function Button({
  children,
  href,
  variant = "primary",
  className = "",
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-[15px] font-medium transition-colors duration-200 focus-visible:outline-offset-4";

  const variants: Record<string, string> = {
    primary: "bg-ink text-paper hover:bg-brand-deep",
    secondary: "bg-brand-deep text-paper hover:bg-ink",
    ghost: "bg-transparent text-ink hover:text-brand-deep",
  };

  return (
    <a href={href} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </a>
  );
}
