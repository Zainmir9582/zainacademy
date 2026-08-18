import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, BookOpen, ShieldAlert, CheckCircle2, MessageCircle } from "lucide-react";
import { FIREBASE_ACTIVE } from "../firebase/db";
import { SiteSettings } from "../types";
import { DataService } from "../firebase/db";
import Logo from "./Logo";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const location = useLocation();

  useEffect(() => {
    DataService.getSettings().then(setSettings).catch(console.error);
  }, [location.pathname]); // Re-fetch when navigating to ensure updates reflect

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Faculty", path: "/teachers" },
    { label: "Courses", path: "/courses" },
    { label: "Notices", path: "/notices" },
    { label: "Gallery", path: "/gallery" },
    { label: "Contact Us", path: "/contact" },
  ];

  const activeClass = "text-brand-gold font-bold border-b-2 border-brand-gold pb-1 uppercase tracking-wider text-xs transition-colors";
  const inactiveClass = "text-slate-100 hover:text-brand-gold transition-colors pb-1 uppercase tracking-wider text-xs font-semibold";

  return (
    <header className="sticky top-0 z-50 bg-brand-blue text-white border-b border-blue-900/60 shadow-md">
      {/* Top Banner for Firebase status */}
      <div className={`py-1 text-[10px] text-center font-bold uppercase tracking-wider border-b ${FIREBASE_ACTIVE ? 'bg-emerald-950/80 text-emerald-400 border-emerald-900' : 'bg-amber-950/85 text-brand-gold border-amber-900'}`}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-1.5">
          {FIREBASE_ACTIVE ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>☁️ Cloud Mode: Live Cloud Sync Enabled</span>
            </>
          ) : (
            <>
              <ShieldAlert className="w-3.5 h-3.5 text-brand-gold" />
              <span>⚡ Sandbox Active: local storage on-device. Click <Link to="/admin/dashboard" className="underline hover:text-white">Admin Panel</Link> to configure!</span>
            </>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <Logo variant="full" iconSize={36} />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-5">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={isActive ? activeClass : inactiveClass}
                  id={`nav-link-${link.label.toLowerCase().replace(" ", "-")}`}
                >
                  {link.label}
                </Link>
              );
            })}
            
            {/* WhatsApp Header Option */}
            <a
              href={`https://wa.me/${(settings?.contactNo || "+92 304 3881774").replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all duration-300 shadow-md shadow-emerald-950/20"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-4 h-4 text-white" />
              <span>WhatsApp Chat</span>
            </a>

            <Link
              to="/admin/dashboard"
              className="px-3 py-1.5 bg-white text-brand-blue hover:bg-brand-gold hover:text-white border border-white rounded text-xs font-bold uppercase tracking-wider transition-all duration-300"
              id="nav-link-admin-panel"
            >
              Admin Panel
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            {/* Direct Mobile WhatsApp Quick Link */}
            <a
              href={`https://wa.me/${(settings?.contactNo || "+92 304 3881774").replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 bg-emerald-600 text-white rounded shadow-md"
              title="WhatsApp Chat"
            >
              <MessageCircle className="w-5 h-5" />
            </a>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-100 hover:text-brand-gold focus:outline-none p-1.5"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-blue-900 bg-brand-blue animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded text-sm font-bold uppercase tracking-wider ${
                    isActive
                      ? "bg-blue-800 text-brand-gold"
                      : "text-slate-200 hover:bg-blue-800 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-2 border-t border-blue-800 mt-2 space-y-2">
              <a
                href={`https://wa.me/${(settings?.contactNo || "+92 304 3881774").replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full text-center px-4 py-2.5 bg-emerald-600 text-white rounded text-xs font-bold uppercase tracking-wider hover:bg-emerald-500 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>

              <Link
                to="/admin/dashboard"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center px-4 py-2.5 bg-white text-brand-blue rounded text-xs font-bold uppercase tracking-wider hover:bg-brand-gold hover:text-white transition-all"
              >
                Admin Panel
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
