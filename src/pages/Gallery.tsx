import React, { useState, useEffect } from "react";
import { Image, X, ZoomIn, Eye } from "lucide-react";
import { GalleryImage } from "../types";
import { DataService } from "../firebase/db";

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    DataService.getGallery()
      .then((data) => {
        setImages(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading gallery:", err);
        setLoading(false);
      });
  }, []);

  const categories = ["All", ...Array.from(new Set(images.map((img) => img.category)))];

  const filteredImages = selectedCategory === "All"
    ? images
    : images.filter((img) => img.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-brand-teal border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 text-sm font-medium font-display">Loading Campus Gallery...</p>
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
            Campus Life & Facilities
          </h1>
          <p className="text-slate-300 font-light max-w-2xl mx-auto text-sm sm:text-base">
            Take a visual tour of our spacious libraries, modern computing facilities, chemistry testing rooms, and dynamic school assemblies.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Category Filters */}
        {categories.length > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4.5 py-2 rounded text-xs font-bold uppercase tracking-wider border transition-all ${
                  selectedCategory === cat
                    ? "bg-brand-blue border-brand-blue text-white shadow-sm"
                    : "bg-white border-slate-200 hover:border-brand-blue text-slate-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Responsive Grid */}
        {filteredImages.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-md border border-slate-200 shadow-sm max-w-md mx-auto space-y-3">
            <Image className="w-12 h-12 mx-auto text-slate-300" />
            <h3 className="font-display font-bold text-slate-900 text-lg uppercase tracking-wider">No Images Found</h3>
            <p className="text-slate-500 text-sm font-light">
              We haven't added photos to this category yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((img) => (
              <div
                key={img.id}
                onClick={() => setLightboxImage(img)}
                className="bg-white rounded-md border border-slate-200 overflow-hidden shadow-sm hover:border-brand-blue transition-all cursor-pointer group relative"
              >
                <div className="aspect-video w-full overflow-hidden bg-brand-blue relative">
                  <img
                    src={img.url}
                    alt={img.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  {/* Hover mask */}
                  <div className="absolute inset-0 bg-slate-950/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <span className="p-2.5 bg-brand-gold text-brand-blue rounded border border-brand-gold/20">
                      <Eye className="w-5 h-5" />
                    </span>
                  </div>
                </div>
                
                <div className="p-4 flex items-center justify-between border-t border-slate-100">
                  <h3 className="font-display font-bold text-brand-blue text-sm truncate pr-2 uppercase tracking-tight">
                    {img.title}
                  </h3>
                  <span className="text-[9px] font-bold text-brand-gold bg-blue-50 border border-blue-100 px-2 py-0.5 rounded uppercase tracking-widest font-mono shrink-0">
                    {img.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setLightboxImage(null)}
        >
          <button 
            onClick={() => setLightboxImage(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all focus:outline-none"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div 
            className="max-w-5xl w-full max-h-[85vh] flex flex-col items-center gap-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={lightboxImage.url} 
              alt={lightboxImage.title} 
              className="max-w-full max-h-[75vh] object-contain rounded-md shadow-2xl border border-white/5"
              referrerPolicy="no-referrer"
            />
            <div className="text-center text-white space-y-1">
              <h2 className="font-display text-lg font-bold tracking-tight uppercase">{lightboxImage.title}</h2>
              <span className="text-xs text-brand-gold uppercase tracking-widest font-mono font-bold">{lightboxImage.category}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
