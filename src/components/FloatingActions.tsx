import React, { useState, useEffect } from "react";
import { MessageCircle, ArrowUp, Zap } from "lucide-react";
import { SiteSettings } from "../types";
import { DataService } from "../firebase/db";

export default function FloatingActions() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    DataService.getSettings().then(setSettings).catch(console.error);

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const contactNumber = settings?.contactNo || "+92 304 3881774";
  const cleanedPhone = contactNumber.replace(/\s+/g, "");

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
      {/* Scroll to Top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="p-3 bg-brand-blue text-white rounded-full shadow-lg hover:bg-brand-gold hover:text-brand-blue hover:-translate-y-1 border border-blue-900 transition-all duration-300"
          title="Scroll to Top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* WhatsApp Direct Chat */}
      <a
        href={`https://wa.me/${contactNumber.replace(/\D/g, "")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-3.5 bg-emerald-600 text-white rounded-full shadow-xl hover:bg-emerald-500 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center border border-emerald-700"
        title="Chat on WhatsApp"
      >
        <MessageCircle className="w-5.5 h-5.5 text-white" />
      </a>

      {/* WhatsApp Quick Action (Channel) */}
      <a
        href={settings?.whatsappLink || "https://whatsapp.com/channel/0029Vaq3TM38KMqhTVhWGO3o"}
        target="_blank"
        rel="noopener noreferrer"
        className="p-3.5 bg-whatsapp text-white rounded-full shadow-xl hover:bg-emerald-500 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center animate-bounce"
        style={{ animationDuration: "3s" }}
        title="Join WhatsApp Channel"
      >
        <Zap className="w-5.5 h-5.5 text-white" />
      </a>
    </div>
  );
}
