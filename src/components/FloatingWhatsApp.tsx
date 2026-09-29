import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { openWhatsApp } from "../config";

export default function FloatingWhatsApp() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show the button after a short delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 animate-fade-in">
      <button
        onClick={() => openWhatsApp()}
        className="group flex items-center gap-3 rounded-full bg-green-600 px-5 py-3.5 text-white shadow-lg transition-all hover:bg-green-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        aria-label="Chat with us on WhatsApp"
      >
        <div className="relative">
          <MessageCircle size={24} />
          <span className="absolute -right-0.5 -top-0.5 h-3 w-3 animate-pulse rounded-full bg-green-300" />
        </div>
        <span className="hidden text-[15px] font-medium sm:inline">
          Chat with us
        </span>
      </button>
      
      {/* Tooltip that appears on hover */}
      <div className="absolute bottom-full right-0 mb-2 hidden w-48 rounded-lg bg-ink p-3 text-sm text-paper shadow-lg group-hover:block">
        <p className="font-medium">Need help?</p>
        <p className="mt-1 text-paper/70">Click to chat with us on WhatsApp. We're here to help!</p>
        <div className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 translate-y-1 rotate-45 bg-ink" />
      </div>
    </div>
  );
}