import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Mail, MessageCircle, MapPin, ArrowUpRight } from "lucide-react";
import { SiteSettings } from "../types";
import { DataService } from "../firebase/db";
import Logo from "./Logo";

export default function Footer() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const location = useLocation();

  useEffect(() => {
    DataService.getSettings().then(setSettings).catch(console.error);
  }, [location.pathname]);

  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-8 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand block */}
          <div className="md:col-span-1.5 space-y-4">
            <Link to="/" className="flex items-center gap-2 text-white">
              <Logo variant="full" iconSize={40} textColor="text-white" />
            </Link>
            <p className="text-sm text-slate-450 font-light leading-relaxed">
              {settings?.tagline || "Empowering Minds, Shaping Futures"}
            </p>
            <p className="text-xs text-slate-500 leading-relaxed font-light">
              Providing dynamic and holistic coaching and technical education to secure competitive academic and industry placement.
            </p>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <h3 className="font-display text-white font-bold text-xs uppercase tracking-widest">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-brand-gold transition-colors font-medium">Home</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-brand-gold transition-colors font-medium">About Academy</Link>
              </li>
              <li>
                <Link to="/teachers" className="hover:text-brand-gold transition-colors font-medium">Our Faculty</Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-brand-gold transition-colors font-medium">Offered Courses</Link>
              </li>
              <li>
                <Link to="/notices" className="hover:text-brand-gold transition-colors font-medium">Notices & Feed</Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-brand-gold transition-colors font-medium">Campus Gallery</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h3 className="font-display text-white font-bold text-xs uppercase tracking-widest">
              Contact Details
            </h3>
            <ul className="space-y-3 text-sm font-light">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-gold shrink-0 mt-1" />
                <div className="space-y-1 flex-1">
                  <span className="block leading-relaxed">{settings?.address || "nizamabad chownk zafar wal road near Insaf mohibullah hotal, sialkot, pakistan"}</span>
                  <a
                    href="https://maps.app.goo.gl/TRT5x46sfjt5S4e57"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-gold hover:underline mt-1 hover:text-white transition-colors"
                  >
                    <span>Open in Google Maps</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0" />
                <a 
                  href={`https://wa.me/${(settings?.contactNo || "+92 304 3881774").replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-gold transition-colors font-medium flex items-center gap-1"
                >
                  <span>{settings?.contactNo || "+92 304 3881774"}</span>
                  <span className="text-[10px] bg-emerald-500/10 text-[#25D366] px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wide">WhatsApp</span>
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-gold shrink-0" />
                <a href={`mailto:${settings?.email || "zainmir9582@gmail.com"}`} className="hover:text-brand-gold transition-colors break-all">
                  {settings?.email || "zainmir9582@gmail.com"}
                </a>
              </li>
            </ul>
          </div>

          {/* WhatsApp CTA */}
          <div className="space-y-4">
            <h3 className="font-display text-white font-bold text-xs uppercase tracking-widest">
              Stay Connected
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-light">
              Join our official WhatsApp channel to receive rapid updates regarding exams, announcements, and results.
            </p>
            <a
              href={settings?.whatsappLink || "https://whatsapp.com/channel/0029Vaq3TM38KMqhTVhWGO3o"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-between gap-2 px-4 py-2.5 bg-brand-blue border border-blue-900 hover:bg-brand-gold hover:text-brand-blue text-white font-bold text-[11px] uppercase tracking-wider rounded transition-all w-full shadow-md"
            >
              <span>Join WhatsApp Channel</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <div className="border-t border-slate-900 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600 font-light">
          <p>© {new Date().getFullYear()} Zain Academy. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/admin/dashboard" className="hover:text-slate-400">Admin Control Panel</Link>
            <span>•</span>
            <span className="text-slate-600">Secured with Firebase Integration</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
