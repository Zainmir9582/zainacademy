import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  Users, 
  Award, 
  BookOpen, 
  CheckCircle, 
  Bell, 
  ArrowUpRight, 
  Zap, 
  Calendar,
  Sparkles,
  GraduationCap,
  ExternalLink
} from "lucide-react";
import { SiteSettings, Teacher, Notice } from "../types";
import { DataService } from "../firebase/db";

export default function Home() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [loadedSettings, loadedTeachers, loadedNotices] = await Promise.all([
          DataService.getSettings(),
          DataService.getTeachers(),
          DataService.getNotices()
        ]);
        setSettings(loadedSettings);
        setTeachers(loadedTeachers.slice(0, 3)); // Only show first 3
        setNotices(loadedNotices.slice(0, 2)); // Only show top 2
      } catch (err) {
        console.error("Error loading home page content:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-brand-teal border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 text-sm font-medium font-display">Loading Academy Portal...</p>
        </div>
      </div>
    );
  }

  const stats = settings?.stats || { teachers: 4, courses: 8, experience: 16, students: 1200 };

  return (
    <div className="relative overflow-hidden bg-slate-50 pb-12">
      {/* 1. HERO SECTION */}
      <section className="relative bg-brand-blue text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-blue-800">
        {/* Abstract design elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl -ml-20 -mb-20"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-block px-3 py-1.5 bg-brand-gold text-brand-blue text-[10px] font-bold uppercase tracking-widest rounded">
              ADMISSIONS OPEN - SESSION 2026 / 2027
            </div>
            
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight uppercase">
              {settings?.instituteName || "Zain Academy"}
            </h1>
            
            <p className="font-display text-lg sm:text-xl text-amber-400 font-bold max-w-2xl mx-auto lg:mx-0">
              {settings?.tagline || "Empowering Minds, Shaping Futures"}
            </p>
            
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto lg:mx-0 font-light">
              We deliver elite board-preparation, secondary scientific curriculum, and advanced technological training designed to expand students' mental horizons and secure exceptional results.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link
                to="/courses"
                className="w-full sm:w-auto text-center px-6 py-3.5 bg-brand-gold hover:bg-white text-brand-blue font-bold uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-2 rounded-md shadow-lg shadow-amber-950/20"
              >
                <span>Explore Programs</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className="w-full sm:w-auto text-center px-6 py-3.5 bg-transparent border border-blue-700 hover:border-white text-slate-300 hover:text-white rounded-md font-bold uppercase tracking-wider text-xs transition-all"
              >
                Get in Touch
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none rounded-lg overflow-hidden shadow-2xl border-2 border-brand-gold bg-blue-950/60 p-2">
              <img
                src="/src/assets/images/zain_academy_building_1783445655510.jpg"
                alt="Zain Academy Campus"
                className="rounded-md object-cover w-full h-80 brightness-110 contrast-[1.02]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-lg bg-slate-950/90 border border-brand-gold/40 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="bg-brand-gold text-brand-blue p-2 rounded shrink-0">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-xs uppercase tracking-wider font-display">Zain Academy Campus</h4>
                    <p className="text-brand-gold text-[10px] font-bold">ESTD. 2010 • SIALKOT, PK</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FLOATING CONTRAST STATS STRIP */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-white rounded-xl border border-slate-200 shadow-xl grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-100 overflow-hidden">
          <div className="p-6 sm:p-8 text-center space-y-1.5 hover:bg-slate-50/40 transition-colors">
            <p className="text-4xl sm:text-5xl font-display font-black text-brand-blue tracking-tight">
              {stats.experience}<span className="text-brand-teal text-3xl font-bold">+</span>
            </p>
            <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest font-display">Years of Excellence</p>
          </div>
          <div className="p-6 sm:p-8 text-center space-y-1.5 hover:bg-slate-50/40 transition-colors">
            <p className="text-4xl sm:text-5xl font-display font-black text-brand-blue tracking-tight">
              {stats.teachers}<span className="text-brand-teal text-3xl font-bold">+</span>
            </p>
            <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest font-display">Expert Professors</p>
          </div>
          <div className="p-6 sm:p-8 text-center space-y-1.5 hover:bg-slate-50/40 transition-colors">
            <p className="text-4xl sm:text-5xl font-display font-black text-brand-blue tracking-tight">
              {stats.courses}<span className="text-brand-teal text-3xl font-bold">+</span>
            </p>
            <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest font-display">Academic Streams</p>
          </div>
          <div className="p-6 sm:p-8 text-center space-y-1.5 hover:bg-slate-50/40 transition-colors">
            <p className="text-4xl sm:text-5xl font-display font-black text-brand-blue tracking-tight">
              {stats.students}<span className="text-brand-teal text-3xl font-bold">+</span>
            </p>
            <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest font-display">Successful Scholars</p>
          </div>
        </div>
      </div>

      {/* 3. ABOUT SUMMARY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-brand-blue text-[10px] font-bold uppercase tracking-widest border border-emerald-100">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-brand-teal" />
              <span>THE ACADEMY BLUEPRINT</span>
            </span>
            <h2 className="text-4xl sm:text-5xl font-display font-black text-brand-blue leading-tight uppercase tracking-tight">
              Guiding Students to Academic Heights
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed font-light">
              {settings?.aboutText || "Zain Academy is a premier educational institute dedicated to academic excellence, career-oriented training, and personal development. We provide premium tuition and coaching services with highly experienced faculty, modern infrastructure, and interactive learning environments."}
            </p>
            <div className="pt-2">
              <Link
                to="/about"
                className="group inline-flex items-center gap-2 text-brand-blue hover:text-brand-gold font-bold text-xs uppercase tracking-wider transition-all"
              >
                <span>Read our Mission, Vision & History</span>
                <ArrowRight className="w-4 h-4 text-brand-teal group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* ASYMMETRICAL BENTO GRID */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Card 1: Giant Premium Dark Highlight (Spans 2 columns) */}
            <div className="sm:col-span-2 bg-brand-blue text-white p-8 rounded-xl border border-slate-800 shadow-xl shadow-slate-950/20 relative overflow-hidden group hover:shadow-2xl transition-all">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
              <div className="relative z-10 space-y-4">
                <div className="w-10 h-10 rounded-lg bg-brand-gold/15 border border-brand-gold/30 flex items-center justify-center text-brand-gold">
                  <Award className="w-5 h-5" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-display font-bold text-white text-base sm:text-lg uppercase tracking-wide">Elite Board Preparation</h4>
                  <p className="text-xs text-slate-350 font-light leading-relaxed">
                    Extensive curriculum mapping, daily evaluations, and intensive past papers workshops for secondary/higher secondary boards. Our students consistently secure top rankings and merit positions across major examination systems.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: Clean Minimalist Light */}
            <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm hover:border-brand-teal hover:shadow-md transition-all space-y-4 group">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-brand-teal group-hover:bg-brand-teal group-hover:text-white transition-colors">
                <Users className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <h4 className="font-display font-bold text-brand-blue text-sm uppercase tracking-wider">Expert Subject Pedagogy</h4>
                <p className="text-xs text-slate-500 font-light leading-relaxed">
                  Lectures delivered by seasoned professors holding research degrees in Mathematics, Languages, and Physics.
                </p>
              </div>
            </div>

            {/* Card 3: Deep Technical Slate Dark */}
            <div className="bg-slate-950 text-white p-6 rounded-xl border border-slate-800 shadow-md hover:border-brand-gold/40 transition-all space-y-4 group">
              <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-brand-gold">
                <Zap className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <h4 className="font-display font-bold text-brand-gold text-sm uppercase tracking-wider">Modern IT Foundations</h4>
                <p className="text-xs text-slate-400 font-light leading-relaxed">
                  Practical modules in coding, software paradigms, and computational skills that position students for the global digital economy.
                </p>
              </div>
            </div>

            {/* Card 4: Light Emerald Accent */}
            <div className="sm:col-span-2 bg-emerald-50/40 p-6 rounded-xl border border-emerald-100 shadow-sm hover:bg-emerald-50 transition-all space-y-4 group">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-brand-teal shrink-0">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-display font-bold text-brand-blue text-sm uppercase tracking-wide">Holistic Mentor Support</h4>
                    <p className="text-xs text-slate-650 font-light leading-relaxed">
                      Individual counseling, detailed performance diagnostics, and active parent-teacher reviews to ensure personalized progression for every student.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3.5 LEADERSHIP DESK (ACADEMIC DIRECTIVE) */}
      <section className="bg-gradient-to-br from-brand-blue via-slate-950 to-slate-950 text-white py-20 border-t border-b border-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#10B981_1px,transparent_1px)] [background-size:20px_20px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-8 sm:p-12 shadow-2xl backdrop-blur-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-6">
              <div className="space-y-2">
                <span className="text-brand-gold text-xs font-bold tracking-[0.3em] uppercase font-display block animate-pulse">
                  LEADERSHIP DESK
                </span>
                <h3 className="text-3xl sm:text-4xl font-display font-black uppercase tracking-tight text-white leading-tight">
                  Welcome to Zain Academy
                </h3>
              </div>
              <blockquote className="border-l-4 border-brand-gold pl-4 sm:pl-6 italic text-slate-200 text-sm sm:text-base leading-relaxed font-light">
                "Our single absolute core focus is nurturing each student's specific potential. Whether prepping for rigorous board examinations, mastering advanced science streams, or diving into computational science, we provide a structured assessment framework and specialized mentoring to ensure high position achievements. Excellence is a standard we strive for daily."
              </blockquote>
              <div className="pt-2">
                <p className="font-display font-bold text-white text-base tracking-wide uppercase">
                  Zain Mir
                </p>
                <p className="text-brand-gold text-[10px] font-bold tracking-widest uppercase mt-0.5">
                  FOUNDER & ACADEMIC DIRECTOR, ZAIN ACADEMY
                </p>
              </div>
            </div>
            
            <div className="lg:col-span-4 flex flex-col items-center justify-center text-center p-6 border border-slate-800 bg-slate-950/80 rounded-xl space-y-4">
              <div className="w-24 h-24 rounded-full bg-brand-gold/10 border-2 border-brand-gold flex items-center justify-center text-brand-gold text-3xl font-black font-display shadow-inner">
                ZM
              </div>
              <div className="space-y-1">
                <span className="text-xs uppercase font-bold text-slate-300 tracking-wider">Academic Quality Guarantee</span>
                <div className="flex items-center justify-center gap-1 text-brand-gold">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-[10px] text-brand-gold font-bold pt-1 uppercase tracking-wider">
                  100% Board Position Track Record
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. DYNAMIC SECTIONS: NOTICES & FEATURED TEACHERS */}
      <section className="bg-white border-b border-slate-200/80 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Latest Notices feed (High-Contrast Slate Sidebar) */}
          <div className="lg:col-span-5 space-y-6 bg-slate-50/80 p-6 sm:p-8 rounded-2xl border border-slate-200/60 shadow-inner">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-brand-blue animate-bounce" />
                <h3 className="font-display font-black text-brand-blue text-lg uppercase tracking-wide">Notices & Feed</h3>
              </div>
              <Link to="/notices" className="text-xs font-bold text-brand-teal hover:underline uppercase tracking-wider">
                View All
              </Link>
            </div>

            <div className="space-y-4">
              {notices.length === 0 ? (
                <div className="bg-white p-6 border border-slate-200 text-center text-slate-500 text-sm font-light rounded-xl">
                  No announcements recorded yet.
                </div>
              ) : (
                notices.map((n) => (
                  <div key={n.id} className="bg-white p-5 border border-slate-200 shadow-sm space-y-3 hover:border-brand-teal transition-colors rounded-xl">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-brand-teal border border-emerald-100 flex items-center gap-1 font-mono uppercase tracking-wider">
                        <Calendar className="w-3 h-3" />
                        {n.date}
                      </span>
                    </div>
                    <h4 className="font-display font-bold text-brand-blue text-sm uppercase tracking-tight">
                      {n.title}
                    </h4>
                    <p className="text-slate-650 text-xs font-light leading-relaxed line-clamp-3">
                      {n.description}
                    </p>
                    {n.link && (
                      <div className="pt-1.5">
                        <a 
                          href={n.link} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-teal hover:text-brand-blue transition-colors underline decoration-1 underline-offset-4"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>View Announcement Link</span>
                        </a>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Featured Teachers preview */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-display font-black text-brand-blue text-lg uppercase tracking-wide">Our Elite Faculty</h3>
              <Link to="/teachers" className="text-xs font-bold text-brand-teal hover:underline uppercase tracking-wider">
                Meet All Teachers
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {teachers.length === 0 ? (
                <div className="col-span-2 bg-slate-50 p-6 border border-slate-200 text-center text-slate-500 text-sm font-light rounded-xl">
                  No faculty records found.
                </div>
              ) : (
                teachers.map((t) => (
                  <div key={t.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:border-brand-blue hover:shadow-md transition-all group">
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-100 text-[9px] text-brand-teal font-bold uppercase tracking-widest font-mono">
                            {t.subject}
                          </span>
                        </div>
                        <h4 className="font-display font-bold text-brand-blue text-sm uppercase tracking-tight">
                          {t.name}
                        </h4>
                        <p className="text-brand-teal text-[10px] font-bold uppercase tracking-wider mt-1">
                          {t.qualification}
                        </p>
                        <p className="text-slate-500 text-xs font-light mt-2 line-clamp-2 leading-relaxed">
                          {t.bio}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </section>

      {/* 5. WHATSAPP CHANNEL CTA BANNER (Obsidian Contrast Theme) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-2xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl border border-slate-800">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#25D366]/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4 text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#25D366]/10 text-[#25D366] text-[10px] font-bold uppercase tracking-widest border border-[#25D366]/20">
                <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></span>
                <span>INSTANT BROADCAST ALERTS</span>
              </span>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white">
                Never Miss a Result or Notice: Join Zain Academy Channel
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-light max-w-2xl mx-auto lg:mx-0">
                Subscribe to our official broadcast channel to receive real-time notifications, datesheets, test-prep syllabi, and administrative updates directly on your phone.
              </p>
            </div>
            
            <div className="lg:col-span-4 flex items-center justify-center lg:justify-end">
              <a
                href={settings?.whatsappLink || "https://whatsapp.com/channel/0029Vaq3TM38KMqhTVhWGO3o"}
                target="_blank"
                rel="noopener noreferrer"
                className="group px-6 py-4 bg-[#25D366] hover:bg-white text-slate-950 font-black uppercase tracking-wider text-xs rounded-xl transition-all shadow-lg hover:shadow-[#25D366]/20 flex items-center gap-3"
              >
                <span>Join Channel on WhatsApp</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
