import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
  variant?: "primary" | "secondary" | "floating";
  size?: "sm" | "md" | "lg";
  className?: string;
  children?: React.ReactNode;
}

const WHATSAPP_NUMBER = "255699068552";
const WHATSAPP_MESSAGE = "Hello Zeonix eCards, I'm interested in getting a digital invitation. I would like to know more about your services.";

export default function WhatsAppButton({ 
  variant = "primary", 
  size = "md", 
  className = "",
  children 
}: WhatsAppButtonProps) {
  const openWhatsApp = () => {
    const encodedMessage = encodeURIComponent(WHATSAPP_MESSAGE);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
  };

  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 text-[15px]",
    lg: "px-6 py-3.5 text-[16px]"
  };

  const variantClasses = {
    primary: "bg-green-600 text-white hover:bg-green-700",
    secondary: "border border-green-600 bg-white text-green-600 hover:bg-green-50",
    floating: "rounded-full shadow-lg hover:shadow-xl"
  };

  const buttonClasses = `
    flex items-center justify-center gap-2 rounded-full font-medium transition-colors
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${className}
  `;

  return (
    <button
      onClick={openWhatsApp}
      className={buttonClasses}
      aria-label="Chat with us on WhatsApp"
    >
      <MessageCircle size={size === "sm" ? 16 : size === "md" ? 18 : 20} />
      {children || "Chat on WhatsApp"}
    </button>
  );
}