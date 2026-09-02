import { useState, type FormEvent } from "react";
import { Phone, MapPin, MessageCircle, Mail } from "lucide-react";
import SectionHeading from "./ui/SectionHeading";
import InstagramIcon from "./ui/InstagramIcon";

const eventTypes = [
  "Wedding",
  "Birthday",
  "Send-off",
  "Kitchen Party",
  "Graduation",
  "Custom Event",
];

const API_URL = import.meta.env.VITE_CONTACT_API_URL || "/api/contact";

// WhatsApp configuration
const WHATSAPP_NUMBER = "255699068552";
const WHATSAPP_MESSAGE = "Hello Zeonix eCards, I'm interested in getting a digital invitation. I would like to know more about your services.";

export default function ContactOrder() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Frontend validation
  const validateForm = (formData: FormData) => {
    const errors: Record<string, string> = {};
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const name = formData.get("name") as string;
    const eventType = formData.get("eventType") as string;

    if (!name?.trim()) {
      errors.name = "Full name is required";
    }

    if (!phone?.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^[\d\s\-\+\(\)]{10,}$/.test(phone.replace(/\s/g, ''))) {
      errors.phone = "Please enter a valid phone number";
    }

    if (email?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!eventType?.trim()) {
      errors.eventType = "Event type is required";
    }

    return errors;
  };

  const openWhatsApp = () => {
    const encodedMessage = encodeURIComponent(WHATSAPP_MESSAGE);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setFormErrors({});

    const formData = new FormData(e.currentTarget);
    const validationErrors = validateForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Unable to send inquiry. Please try again.");
      }

      setSubmitted(true);
      e.currentTarget.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send inquiry. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="contact" className="bg-brand-soft py-24 sm:py-28">
      <div className="container-content grid gap-16 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <SectionHeading
            mark="Contact & order"
            title="Tell us about your event"
            description="Share a few details and we'll reach out within a day with design options and pricing."
          />

          <div className="mt-12 space-y-6">
            <button
              onClick={openWhatsApp}
              className="flex w-full items-center gap-4 group"
            >
              <span className="grid h-12 w-12 flex-none place-items-center rounded-full bg-ink text-paper transition-colors group-hover:bg-brand-deep">
                <MessageCircle size={19} strokeWidth={1.6} />
              </span>
              <span>
                <span className="block text-[13px] text-stone">WhatsApp Chat</span>
                <span className="block text-[15px] text-ink">0699 068 552</span>
              </span>
            </button>

            <a href="tel:+255699068552" className="flex items-center gap-4 group">
              <span className="grid h-12 w-12 flex-none place-items-center rounded-full bg-ink text-paper transition-colors group-hover:bg-brand-deep">
                <Phone size={18} strokeWidth={1.6} />
              </span>
              <span>
                <span className="block text-[13px] text-stone">Call us</span>
                <span className="block text-[15px] text-ink">0699 068 552</span>
              </span>
            </a>

            <a 
              href="mailto:info@zeonixecards.com" 
              className="flex items-center gap-4 group"
            >
              <span className="grid h-12 w-12 flex-none place-items-center rounded-full bg-ink text-paper transition-colors group-hover:bg-brand-deep">
                <Mail size={18} strokeWidth={1.6} />
              </span>
              <span>
                <span className="block text-[13px] text-stone">Email</span>
                <span className="block text-[15px] text-ink">info@zeonixecards.com</span>
              </span>
            </a>

            <a
              href="https://instagram.com/zeonix_ecards"
              className="flex items-center gap-4 group"
            >
              <span className="grid h-12 w-12 flex-none place-items-center rounded-full bg-ink text-paper transition-colors group-hover:bg-brand-deep">
                <InstagramIcon size={18} />
              </span>
              <span>
                <span className="block text-[13px] text-stone">Instagram</span>
                <span className="block text-[15px] text-ink">@zeonix_ecards</span>
              </span>
            </a>

            <div className="flex items-center gap-4">
              <span className="grid h-12 w-12 flex-none place-items-center rounded-full bg-ink text-paper">
                <MapPin size={18} strokeWidth={1.6} />
              </span>
              <span>
                <span className="block text-[13px] text-stone">Studio</span>
                <span className="block text-[15px] text-ink">
                  Kinondoni, Dar es Salaam
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-[10px] bg-paper p-8 shadow-soft sm:p-10">
          {submitted ? (
            <div className="flex h-full min-h-[320px] flex-col items-center justify-center text-center">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-brand-soft">
                <MessageCircle size={22} className="text-brand-deep" />
              </span>
              <h3 className="mt-5 text-xl text-ink">Thank you — message received</h3>
              <p className="mt-2 max-w-xs text-[14.5px] text-stone">
                We'll get back to you on WhatsApp or by email within a day
                with design options for your event.
              </p>
              <button
                onClick={openWhatsApp}
                className="mt-6 flex items-center gap-2 rounded-full bg-green-600 px-6 py-3 text-[15px] font-medium text-white transition-colors hover:bg-green-700"
              >
                <MessageCircle size={18} />
                Chat with us on WhatsApp
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field 
                  label="Full name" 
                  name="name" 
                  placeholder="Neema Mushi" 
                  required 
                  error={formErrors.name}
                />
                <Field
                  label="Phone / WhatsApp"
                  name="phone"
                  placeholder="0699 000 000"
                  required
                  error={formErrors.phone}
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field 
                  label="Email address" 
                  name="email" 
                  type="email" 
                  placeholder="neema@example.com" 
                  error={formErrors.email}
                />
                <div>
                  <label className="mb-2 block text-[13.5px] text-ink/70">
                    Event type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="eventType"
                    required
                    defaultValue=""
                    className={`w-full rounded-md border ${formErrors.eventType ? 'border-red-300' : 'border-ink/15'} bg-paper px-4 py-3 text-[14.5px] text-ink outline-none transition-colors focus:border-brand-deep`}
                  >
                    <option value="" disabled>
                      Select an event type
                    </option>
                    {eventTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  {formErrors.eventType && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.eventType}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Event date" name="date" type="date" />
                <Field
                  label="Estimated guests"
                  name="guests"
                  type="number"
                  placeholder="120"
                  min="1"
                />
              </div>

              <div>
                <label className="mb-2 block text-[13.5px] text-ink/70">
                  Tell us about your event
                </label>
                <textarea
                  name="message"
                  rows={4}
                  placeholder="Theme, colours, venue — anything that helps us design your card."
                  className="w-full resize-none rounded-md border border-ink/15 bg-paper px-4 py-3 text-[14.5px] text-ink outline-none transition-colors focus:border-brand-deep"
                />
              </div>

              {error ? (
                <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </p>
              ) : null}

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-full bg-ink px-6 py-3.5 text-[15px] font-medium text-paper transition-colors hover:bg-brand-deep disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                >
                  {isSubmitting ? "Sending..." : "Send inquiry"}
                </button>
                <button
                  type="button"
                  onClick={openWhatsApp}
                  className="flex items-center justify-center gap-2 rounded-full border border-green-600 bg-white px-6 py-3.5 text-[15px] font-medium text-green-600 transition-colors hover:bg-green-50"
                >
                  <MessageCircle size={18} />
                  Chat on WhatsApp
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

interface FieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  min?: string | number;
}

function Field({ label, name, type = "text", placeholder, required, error, min }: FieldProps) {
  return (
    <div>
      <label className="mb-2 block text-[13.5px] text-ink/70" htmlFor={name}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        min={min}
        className={`w-full rounded-md border ${error ? 'border-red-300' : 'border-ink/15'} bg-paper px-4 py-3 text-[14.5px] text-ink outline-none transition-colors focus:border-brand-deep`}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
