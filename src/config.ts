/**
 * Central site configuration.
 *
 * Values can be overridden at build time via Vite environment variables
 * (see .env.example) — e.g. VITE_WHATSAPP_NUMBER=255612345678.
 * The defaults below match the current Zeonix eCards contact details.
 */

const rawNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "255699068552";

// Keep digits only so wa.me links stay valid whatever format the env var uses
export const WHATSAPP_NUMBER = rawNumber.replace(/\D/g, "");

export const WHATSAPP_MESSAGE =
  import.meta.env.VITE_WHATSAPP_MESSAGE ||
  "Hello Zeonix eCards, I'm interested in getting a digital invitation. I would like to know more about your services.";

/** Build a wa.me deep link that works on mobile (app) and desktop (web.whatsapp.com). */
export function whatsappLink(message?: string): string {
  const text = typeof message === "string" && message ? message : WHATSAPP_MESSAGE;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

/** Open a WhatsApp chat in a new tab (same behaviour the site has always had, with noopener). */
export function openWhatsApp(message?: string): void {
  window.open(whatsappLink(message), "_blank", "noopener,noreferrer");
}
