import React, { useState, useEffect } from "react";
import { Bell, Calendar, Search, Info, ExternalLink } from "lucide-react";
import { Notice } from "../types";
import { DataService } from "../firebase/db";

export default function Notices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    DataService.getNotices()
      .then((data) => {
        // Sort by date newest first (robust string or date sort)
        const sorted = [...data].sort((a, b) => {
          const dateA = a.date || "";
          const dateB = b.date || "";
          return dateB.localeCompare(dateA);
        });
        setNotices(sorted);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading notices:", err);
        setLoading(false);
      });
  }, []);

  const filteredNotices = notices.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.date.includes(searchQuery)
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-brand-teal border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 text-sm font-medium font-display">Loading Notices Feed...</p>
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
            Notices & Announcements
          </h1>
          <p className="text-slate-300 font-light max-w-2xl mx-auto text-sm sm:text-base">
            Stay up to date with real-time academic calendars, test dates, registration instructions, and terminal timelines.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        {/* Search bar */}
        <div className="relative bg-white rounded-md border border-slate-200 shadow-sm p-2 flex items-center">
          <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
          <input
            type="text"
            placeholder="Search announcements by title, keyphrase, or date..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none text-sm"
          />
        </div>

        {/* Notices list */}
        {filteredNotices.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-md border border-slate-200 shadow-sm space-y-3">
            <Info className="w-12 h-12 mx-auto text-slate-300" />
            <h3 className="font-display font-bold text-slate-900 text-lg uppercase tracking-wider">No Announcements Matching Search</h3>
            <p className="text-slate-500 text-sm font-light">
              Try search keywords like "admission", "session", or scroll through alternative dates.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotices.map((n) => (
              <article 
                key={n.id} 
                className="bg-white p-6 sm:p-8 rounded-md border border-slate-200 border-l-4 border-brand-gold shadow-sm hover:border-amber-300 transition-colors space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-150">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4.5 h-4.5 text-brand-gold shrink-0 animate-pulse" />
                    <span className="text-xs font-bold text-brand-blue uppercase tracking-wider font-display">
                      Academic Bulletin
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    PUBLISHED: {n.date}
                  </span>
                </div>

                <div className="space-y-3">
                  <h2 className="font-display font-bold text-brand-blue text-lg sm:text-xl uppercase tracking-tight leading-snug">
                    {n.title}
                  </h2>
                  <p className="text-slate-600 text-xs sm:text-sm font-light leading-relaxed whitespace-pre-line">
                    {n.description}
                  </p>
                  {n.link && (
                    <div className="pt-2">
                      <a 
                        href={n.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-teal/10 border border-brand-teal/25 text-xs font-semibold text-brand-teal hover:bg-brand-teal/20 hover:text-brand-blue transition-all"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Visit Link / Reference</span>
                      </a>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
