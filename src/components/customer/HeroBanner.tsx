import React from 'react';
import { Sparkles, MapPin, Coffee } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface HeroBannerProps {
  onOpenTableSelector: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onOpenTableSelector,
}) => {
  const { currentTable } = useStore();

  return (
    <div className="relative overflow-hidden bg-espresso-950 text-white rounded-3xl mx-4 mt-3 shadow-md border border-espresso-800">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero.jpg"
          alt="Kod Coffee Bar"
          className="w-full h-full object-cover object-center opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-espresso-950 via-espresso-950/85 to-espresso-900/60" />
      </div>

      <div className="relative z-10 p-4 sm:p-5 flex items-center justify-between gap-3">
        {/* Left: Brand Identity & Tagline */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-400 text-espresso-950 flex items-center justify-center font-bold shrink-0 shadow-sm">
            <Coffee className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-black text-base sm:text-lg tracking-tight text-white font-display">
                KOD<span className="text-amber-400">COFFEE</span>
              </h1>
              <span className="text-[9px] uppercase tracking-wider font-black px-1.5 py-0.5 rounded bg-amber-400 text-espresso-950 shadow-xs">
                Specialty
              </span>
            </div>
            <p className="text-[11px] text-espresso-200 font-medium">Artisan Roastery & Table Bar</p>
          </div>
        </div>

        {/* Right: Interactive Table Badge */}
        <button
          onClick={onOpenTableSelector}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-espresso-900/90 hover:bg-espresso-800 border border-espresso-700 text-white text-xs font-extrabold shadow-sm transition-all active:scale-95 shrink-0"
          title="Klik untuk ubah nomor meja"
        >
          <MapPin className="w-3.5 h-3.5 text-amber-400" />
          <span>{currentTable ? currentTable.table_number : 'Pilih Meja'}</span>
        </button>
      </div>
    </div>
  );
};
