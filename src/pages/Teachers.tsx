import React, { useState, useEffect } from "react";
import { Users, GraduationCap, Award, Mail } from "lucide-react";
import { Teacher } from "../types";
import { DataService } from "../firebase/db";

export default function Teachers() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    DataService.getTeachers()
      .then((data) => {
        setTeachers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading teachers:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-brand-teal border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 text-sm font-medium font-display">Loading Faculty Records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* Title Header */}
      <div className="bg-brand-blue py-16 px-4 sm:px-6 lg:px-8 text-white text-center border-b border-blue-800">
        <div className="max-w-7xl mx-auto space-y-4">
          <h1 className="font-display text-4xl font-black uppercase tracking-tight text-white">
            Our Elite Faculty
          </h1>
          <p className="text-slate-300 font-light max-w-2xl mx-auto text-sm sm:text-base">
            Learn from dynamic, certified academics, researchers, and experts dedicated to elevating your academic potential.
          </p>
        </div>
      </div>

      {/* Grid List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {teachers.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-md border border-slate-200 shadow-sm max-w-md mx-auto space-y-3">
            <Users className="w-12 h-12 mx-auto text-slate-300" />
            <h3 className="font-display font-bold text-slate-900 text-lg uppercase tracking-wider">No Faculty Found</h3>
            <p className="text-slate-500 text-sm font-light">
              We are currently finalizing records for our professors. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teachers.map((t) => (
              <div 
                key={t.id} 
                className="bg-white rounded-md border border-slate-200 overflow-hidden shadow-sm hover:border-brand-blue transition-all flex flex-col h-full group"
              >
                {/* Info Section */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-1 rounded bg-blue-50 border border-blue-100 text-[9px] font-bold text-brand-blue uppercase tracking-widest font-mono">
                        {t.subject}
                      </span>
                    </div>
                    <h2 className="font-display font-bold text-brand-blue text-base uppercase tracking-tight transition-colors leading-tight">
                      {t.name}
                    </h2>
                    <p className="text-brand-gold text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <GraduationCap className="w-4 h-4 shrink-0 text-brand-gold" />
                      <span>{t.qualification}</span>
                    </p>
                    <p className="text-slate-600 text-xs font-light leading-relaxed pt-1 line-clamp-6">
                      {t.bio}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="flex items-center gap-1 font-bold font-mono uppercase tracking-wider">
                      <Award className="w-3.5 h-3.5 text-brand-gold" />
                      Academic Lecturer
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
