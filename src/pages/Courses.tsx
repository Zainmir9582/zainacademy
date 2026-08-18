import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BookOpen, ChevronRight, AlertCircle, Sparkles } from "lucide-react";
import { Course } from "../types";
import { DataService } from "../firebase/db";

function getConnectedSubjects(title: string): string[] {
  const norm = title.toLowerCase();
  if (norm.includes("1 to 8") || norm.includes("1-8")) {
    return ["General Science", "Mathematics", "English", "Urdu", "Social Studies"];
  }
  if (norm.includes("11") || norm.includes("12")) {
    return ["I.cs (Phy)", "I.cs (Eco)", "I.cs (stat)", "F.sc (Med)", "F.sc (Eng)", "I.com", "F.A"];
  }
  if (norm.includes("pre-9") || norm.includes("9th") || norm.includes("10th")) {
    if (norm.includes("arts")) {
      return ["Arts"];
    }
    return ["Biology", "Computer"];
  }
  return [];
}

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    DataService.getCourses()
      .then((data) => {
        setCourses(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading courses:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-brand-teal border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 text-sm font-medium font-display">Loading Academic Catalog...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* Title Header */}
      <div className="bg-brand-blue py-16 px-4 sm:px-6 lg:px-8 text-white text-center border-b border-purple-800">
        <div className="max-w-7xl mx-auto space-y-4">
          <h1 className="font-display text-4xl font-black uppercase tracking-tight text-white">
            Offered Classes & Courses
          </h1>
          <p className="text-purple-200 font-light max-w-2xl mx-auto text-sm sm:text-base">
            Structured syllabi, regular assessment trackers, and deep conceptual tutoring to support your academic success.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {courses.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-md border border-slate-200 shadow-sm max-w-md mx-auto space-y-3">
            <AlertCircle className="w-12 h-12 mx-auto text-slate-300" />
            <h3 className="font-display font-bold text-slate-900 text-lg uppercase tracking-wider">No Courses Available</h3>
            <p className="text-slate-500 text-sm font-light">
              We are currently re-aligning our course schedules for the upcoming terminal session.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.map((c) => {
              const subjects = getConnectedSubjects(c.title);
              return (
                <div 
                  key={c.id} 
                  className="bg-white rounded-md border border-slate-200 border-l-4 border-brand-blue shadow-sm hover:border-purple-300 transition-all flex flex-col justify-between h-full p-6 sm:p-8 space-y-6"
                >
                  <div className="space-y-4">
                    <div className="p-3 bg-purple-50 text-brand-blue rounded w-fit">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <h2 className="font-display font-bold text-brand-blue text-lg uppercase tracking-tight">
                      {c.title}
                    </h2>
                    <p className="text-slate-600 text-xs font-light leading-relaxed">
                      {c.description}
                    </p>
                  </div>

                  <div className="space-y-4 pt-5 border-t border-slate-150">
                    {subjects.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-brand-gold animate-pulse" />
                          <span>Connected Streams / Courses:</span>
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {subjects.map((subj, index) => (
                            <span 
                              key={index}
                              className="px-2.5 py-1 text-[11px] font-semibold bg-purple-50 text-brand-blue border border-purple-100 rounded-md transition-colors hover:bg-brand-blue hover:text-white"
                            >
                              {subj}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <Link
                      to="/contact"
                      className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-3 bg-brand-blue hover:bg-brand-gold text-white hover:text-brand-blue font-bold text-xs uppercase tracking-wider rounded transition-all"
                    >
                      <span>Enroll / Inquire Now</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
