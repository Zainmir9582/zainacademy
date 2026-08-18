import React, { useState, useEffect } from "react";
import { Mail, MessageCircle, MapPin, Send, CheckCircle, AlertTriangle, ArrowUpRight } from "lucide-react";
import { SiteSettings, ContactMessage } from "../types";
import { DataService } from "../firebase/db";

export default function Contact() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    DataService.getSettings()
      .then((data) => {
        setSettings(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading settings:", err);
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess(false);

    // Basic Validation
    if (!name.trim() || !email.trim() || !message.trim()) {
      setSubmitError("Please fill out all required fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setSubmitError("Please provide a valid email address.");
      return;
    }

    setSubmitting(true);

    try {
      const newMessage: ContactMessage = {
        id: "msg_" + Date.now(),
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        date: new Date().toISOString().split("T")[0],
      };

      await DataService.addMessage(newMessage);
      setSubmitSuccess(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      console.error("Error saving message:", err);
      setSubmitError("There was an error saving your message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-brand-teal border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 text-sm font-medium font-display">Loading Contact Port...</p>
        </div>
      </div>
    );
  }

  const emailVal = settings?.email || "zainmir9582@gmail.com";
  const contactNoVal = settings?.contactNo || "+92 304 3881774";
  const addressVal = settings?.address || "nizamabad chownk zafar wal road near Insaf mohibullah hotal, sialkot, pakistan";

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* Title Header */}
      <div className="bg-brand-blue py-16 px-4 sm:px-6 lg:px-8 text-white text-center border-b border-blue-800">
        <div className="max-w-7xl mx-auto space-y-4">
          <h1 className="font-display text-4xl font-black uppercase tracking-tight text-white">
            Contact Zain Academy
          </h1>
          <p className="text-slate-300 font-light max-w-2xl mx-auto text-sm sm:text-base">
            Reach out for enrollment inquiries, fee structures, schedule reviews, or administrative details.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Contact info column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-4">
            <h2 className="font-display text-brand-blue font-black text-2xl uppercase tracking-tight">
              Get in Touch Directly
            </h2>
            <p className="text-slate-600 font-light text-sm sm:text-base leading-relaxed">
              We look forward to partnering with you on your academic journey. Use any of the direct lines below or fill out our digital form.
            </p>
          </div>

          <div className="space-y-4">
            {/* WhatsApp Contact */}
            <div className="bg-white p-5 rounded-md border border-slate-200 border-l-4 border-emerald-500 flex items-start gap-4 shadow-sm hover:border-emerald-300 transition-colors">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="space-y-1.5 flex-1">
                <h3 className="text-emerald-600 text-[10px] font-bold uppercase tracking-wider">WhatsApp Support</h3>
                <a 
                  href={`https://wa.me/${contactNoVal.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="block text-brand-blue font-black text-base hover:text-emerald-600 transition-colors"
                >
                  {contactNoVal}
                </a>
                <p className="text-[11px] text-slate-400 font-light leading-snug">Click to chat directly with our administration team</p>
              </div>
            </div>

            {/* Email */}
            <div className="bg-white p-5 rounded-md border border-slate-200 border-l-4 border-brand-blue flex items-start gap-4 shadow-sm hover:border-blue-350 transition-colors">
              <div className="p-3 bg-blue-50 text-brand-blue rounded shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Direct Email</h3>
                <a href={`mailto:${emailVal}`} className="block text-brand-blue font-black text-base hover:text-brand-gold transition-colors break-all">
                  {emailVal}
                </a>
              </div>
            </div>

            {/* Address */}
            <div className="bg-white p-5 rounded-md border border-slate-200 border-l-4 border-brand-blue flex items-start gap-4 shadow-sm hover:border-blue-350 transition-colors">
              <div className="p-3 bg-blue-50 text-brand-blue rounded shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="space-y-2 flex-1">
                <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Campus Address</h3>
                <p className="text-slate-900 font-bold leading-relaxed text-sm">
                  {addressVal}
                </p>
                <div className="pt-1.5">
                  <a
                    href="https://maps.app.goo.gl/TRT5x46sfjt5S4e57"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-brand-blue font-bold hover:text-brand-gold hover:underline transition-all"
                  >
                    <span>View on Google Maps</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* WhatsApp Channel CTA */}
          <div className="bg-emerald-50 border border-emerald-200 border-l-4 border-emerald-500 p-6 rounded-md flex items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1">
              <h4 className="text-emerald-800 font-black text-sm sm:text-base font-display uppercase tracking-tight">Official Broadcast Feed</h4>
              <p className="text-emerald-600 text-xs font-light">Join 1,000+ subscribers for rapid alerts and test notices.</p>
            </div>
            <a
              href={settings?.whatsappLink || "https://whatsapp.com/channel/0029Vaq3TM38KMqhTVhWGO3o"}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm transition-all whitespace-nowrap shrink-0"
            >
              <span>Join Channel</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Form and Map column */}
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-white p-8 sm:p-10 rounded-md border border-slate-200 border-t-4 border-brand-blue shadow-sm space-y-6">
            <h3 className="font-display font-black text-brand-blue text-xl uppercase tracking-tight">
              Send us a Message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {submitSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-md text-sm flex items-center gap-2.5">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Your message has been submitted successfully! Our administrative counselor will reply shortly.</span>
                </div>
              )}

              {submitError && (
                <div className="p-4 bg-amber-50 border border-amber-100 text-amber-800 rounded-md text-sm flex items-center gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="name-input" className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Your Name *</label>
                  <input
                    id="name-input"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Afnan Tayyab"
                    className="w-full bg-slate-50 border border-slate-200 hover:border-slate-350 focus:border-brand-blue focus:bg-white rounded px-4 py-3 text-slate-800 focus:outline-none text-sm transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="email-input" className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Your Email *</label>
                  <input
                    id="email-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. info@domain.com"
                    className="w-full bg-slate-50 border border-slate-200 hover:border-slate-350 focus:border-brand-blue focus:bg-white rounded px-4 py-3 text-slate-800 focus:outline-none text-sm transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="message-input" className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Message *</label>
                <textarea
                  id="message-input"
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about the courses or grade preparation you require..."
                  className="w-full bg-slate-50 border border-slate-200 hover:border-slate-350 focus:border-brand-blue focus:bg-white rounded px-4 py-3 text-slate-800 focus:outline-none text-sm transition-all resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-blue hover:bg-brand-gold hover:text-brand-blue text-white font-bold text-xs uppercase tracking-wider rounded transition-all disabled:opacity-50"
              >
                <span>{submitting ? "Sending Message..." : "Send Message"}</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Embedded Google Map with precise directions overlay */}
          <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm overflow-hidden space-y-3">
            <div className="h-72 relative">
              <iframe
                src={`https://maps.google.com/maps?q=${encodeURIComponent(addressVal)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                width="100%"
                height="100%"
                className="border-0 rounded"
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Map of Zain Academy Location"
              ></iframe>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-1 bg-slate-50 p-3.5 rounded-lg border border-slate-100">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-800">Looking for the exact location?</p>
                <p className="text-[11px] text-slate-500 font-light">Open our verified pin directly inside the Google Maps App</p>
              </div>
              <a
                href="https://maps.app.goo.gl/TRT5x46sfjt5S4e57"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-blue hover:bg-brand-gold text-white hover:text-brand-blue text-xs font-bold uppercase tracking-wider rounded transition-all whitespace-nowrap self-stretch sm:self-auto text-center justify-center shadow-sm"
              >
                <span>Get Directions</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
