import { MessageCircle } from "lucide-react";
import { openWhatsApp } from "../../config";

interface WhatsAppButtonProps {
  variant?: "primary" | "secondary" | "floating";
  size?: "sm" | "md" | "lg";
  className?: string;
  children?: React.ReactNode;
}

export default function WhatsAppButton({
  variant = "primary",
  size = "md",
  className = "",
  children
}: WhatsAppButtonProps) {
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
      onClick={() => openWhatsApp()}
      className={buttonClasses}
      aria-label="Chat with us on WhatsApp"
    >
      <MessageCircle size={size === "sm" ? 16 : size === "md" ? 18 : 20} />
      {children || "Chat on WhatsApp"}
    </button>
  );
}
