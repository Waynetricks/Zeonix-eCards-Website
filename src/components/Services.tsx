import { Heart, PartyPopper, Plane, ChefHat, GraduationCap, Sparkles, MessageCircle } from "lucide-react";
import SectionHeading from "./ui/SectionHeading";
import ServiceCard from "./ui/ServiceCard";
import { services } from "../data/services";

const icons = {
  wedding: Heart,
  birthday: PartyPopper,
  sendoff: Plane,
  "kitchen-party": ChefHat,
  graduation: GraduationCap,
  custom: Sparkles,
};

export default function Services() {
  return (
    <section id="services" className="bg-paper py-24 sm:py-28">
      <div className="container-content">
        <SectionHeading
          mark="Services"
          title="An invitation for every occasion"
          description="Whichever event you're planning, Zeonix eCards designs the invitation and builds the guest system behind it."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              icon={icons[service.id as keyof typeof icons]}
            />
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-center rounded-2xl bg-brand-soft px-6 py-10 text-center">
          <h3 className="text-2xl font-medium text-ink">Ready to create your perfect invitation?</h3>
          <p className="mt-3 max-w-md text-stone">
            Chat with us on WhatsApp to discuss your event requirements and get a custom quote.
          </p>
          <button
            onClick={() => window.open(`https://wa.me/255699068552?text=${encodeURIComponent("Hello Zeonix eCards, I'm interested in getting a digital invitation. I would like to know more about your services.")}`, '_blank')}
            className="mt-6 flex items-center gap-2 rounded-full bg-green-600 px-6 py-3.5 text-[15px] font-medium text-white transition-colors hover:bg-green-700"
            aria-label="Chat with us on WhatsApp"
          >
            <MessageCircle size={18} />
            Discuss Your Event on WhatsApp
          </button>
        </div>
      </div>
    </section>
  );
}
