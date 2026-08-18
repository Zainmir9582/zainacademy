import React, { useState, useEffect } from "react";
import { BookOpen, Award, Target, History, Compass } from "lucide-react";
import { SiteSettings } from "../types";
import { DataService } from "../firebase/db";

export default function About() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-brand-teal border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 text-sm font-medium font-display">Loading About Details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Title Header */}
      <div className="bg-brand-blue py-16 px-4 sm:px-6 lg:px-8 text-white relative border-b border-blue-800">
        <div className="max-w-7xl mx-auto space-y-4 text-center">
          <h1 className="font-display text-4xl font-black uppercase tracking-tight text-white">
            About Our Academy
          </h1>
          <p className="text-slate-300 font-light max-w-2xl mx-auto text-sm sm:text-base">
            Discover the legacy, core values, and pedagogical vision that fuel Zain Academy's commitment to academic mastery.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        {/* Intro */}
        <section className="bg-white p-8 sm:p-12 rounded-md border border-slate-200 border-l-4 border-brand-blue shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-4 flex justify-center">
            <div className="bg-blue-50 text-brand-blue p-6 rounded border border-blue-100">
              <Compass className="w-16 h-16" />
            </div>
          </div>
          <div className="md:col-span-8 space-y-4">
            <h2 className="font-display font-bold text-brand-blue text-2xl uppercase tracking-tight">
              Transformative Education For Every Scholar
            </h2>
            <p className="text-slate-600 font-light leading-relaxed text-sm sm:text-base">
              {settings?.aboutText || "Zain Academy is a premier educational institute dedicated to academic excellence, career-oriented training, and personal development. We provide premium tuition and coaching services with highly experienced faculty, modern infrastructure, and interactive learning environments."}
            </p>
          </div>
        </section>

        {/* Mission and Vision Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mission */}
          <div className="bg-white p-8 rounded-md border border-slate-200 border-l-4 border-brand-gold shadow-sm flex flex-col justify-between hover:border-amber-300 transition-colors">
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 text-brand-gold rounded w-fit">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="font-display text-brand-blue font-black text-lg uppercase tracking-tight">Our Core Mission</h3>
              <p className="text-slate-600 font-light text-sm leading-relaxed">
                {settings?.missionText || "Our mission is to foster intellectual growth and academic excellence, equipping students with the knowledge and character required to excel in their chosen fields and lead with integrity."}
              </p>
            </div>
          </div>

          {/* Vision */}
          <div className="bg-white p-8 rounded-md border border-slate-200 border-l-4 border-brand-blue shadow-sm flex flex-col justify-between hover:border-blue-300 transition-colors">
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 text-brand-blue rounded w-fit">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-display text-brand-blue font-black text-lg uppercase tracking-tight">Our Forward Vision</h3>
              <p className="text-slate-600 font-light text-sm leading-relaxed">
                {settings?.visionText || "To be recognized globally as a vanguard of transformative learning, nurturing creative leaders and critical thinkers who contribute positively to society."}
              </p>
            </div>
          </div>
        </div>

        {/* History */}
        <section className="bg-white p-8 sm:p-12 rounded-md border border-slate-200 border-l-4 border-brand-blue shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-brand-blue text-white rounded">
              <History className="w-5 h-5" />
            </div>
            <h3 className="font-display text-brand-blue font-black text-xl uppercase tracking-tight">Our History</h3>
          </div>
          
          <div className="border-l border-slate-200 pl-6 space-y-4 font-light">
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              {settings?.historyText || "Founded in 2010 by visionary educators, Zain Academy began as a humble tutoring center and has evolved into a comprehensive academy known for delivering outstanding board examination results and IT skills training."}
            </p>
            <p className="text-slate-500 text-xs sm:text-sm">
              Today, Zain Academy continues to expand its pedagogical assets, investing heavily in modern computing facilities, chemistry laboratories, and dynamic remote-learning tools to provide premium student placement and development.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
