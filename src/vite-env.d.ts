/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Contact API endpoint (default: /api/contact — same origin as the site) */
  readonly VITE_CONTACT_API_URL?: string;
  /** WhatsApp number in international format without "+" (default: 255699068552) */
  readonly VITE_WHATSAPP_NUMBER?: string;
  /** Pre-filled WhatsApp message */
  readonly VITE_WHATSAPP_MESSAGE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
