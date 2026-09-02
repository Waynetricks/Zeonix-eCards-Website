import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import type { ServiceItem } from "../../types";

interface ServiceCardProps {
  service: ServiceItem;
  icon: LucideIcon;
}

export default function ServiceCard({ service, icon: Icon }: ServiceCardProps) {
  return (
    <a
      href="#contact"
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-paper p-7 shadow-soft transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-transparent hover:bg-brand hover:shadow-card sm:p-8"
    >
      <span className="grid h-12 w-12 flex-none place-items-center rounded-full bg-brand-soft text-brand-deep transition-colors duration-300 group-hover:bg-ink/10 group-hover:text-ink">
        <Icon size={21} strokeWidth={1.6} />
      </span>

      <h3 className="mt-6 text-[1.2rem] text-ink transition-colors duration-300 group-hover:text-ink">
        {service.title}
      </h3>
      <p className="mt-2.5 text-[14.5px] leading-relaxed text-stone transition-colors duration-300 group-hover:text-ink/80">
        {service.description}
      </p>

      <span className="mt-6 inline-flex items-center gap-1.5 text-[13.5px] font-medium text-brand-deep transition-colors duration-300 group-hover:text-ink">
        Explore
        <ArrowRight
          size={15}
          strokeWidth={2}
          className="transition-transform duration-300 group-hover:translate-x-1"
        />
      </span>
    </a>
  );
}
