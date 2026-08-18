import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Tag, ArrowRight, Flame, Award } from 'lucide-react';

interface PromoSlide {
  id: string;
  tag: string;
  tagIcon: 'sparkle' | 'promo' | 'fire' | 'award';
  title: string;
  subtitle: string;
  highlightText: string;
  image: string;
  ctaText?: string;
}

const PROMO_SLIDES: PromoSlide[] = [
  {
    id: 'promo-1',
    tag: 'PROMO SPESIAL HARI INI',
    tagIcon: 'promo',
    title: 'Diskon 20% Kod Palm Latte',
    subtitle: 'Signature espresso dengan gula aren organik & whipped cream lembut.',
    highlightText: 'Hemat s/d Rp 8.000',
    image: '/images/latte.jpg',
    ctaText: 'Pesan Sekarang',
  },
  {
    id: 'promo-2',
    tag: 'ARTISAN ROASTERY',
    tagIcon: 'sparkle',
    title: 'Single Origin Gayo & Toraja',
    subtitle: 'Biji kopi pilihan sangrai mingguan dengan profil rasa kompleks & floral.',
    highlightText: 'Fresh Roast 100% Arabica',
    image: '/images/hero.jpg',
    ctaText: 'Cek Manual Brew',
  },
  {
    id: 'promo-3',
    tag: 'COMBO HEMAT',
    tagIcon: 'fire',
    title: 'Paket Kopi + Pastry Croissant',
    subtitle: 'Nikmati Butter Croissant renyah bersama secangkir Hot Cappuccino hangat.',
    highlightText: 'Hanya Rp 45.000',
    image: '/images/pastry.jpg',
    ctaText: 'Lihat Menu',
  },
  {
    id: 'promo-4',
    tag: 'KOD COFFEE EXPERIENCE',
    tagIcon: 'award',
    title: 'Scan, Pesan & Santai di Meja',
    subtitle: 'Pesanan diantar langsung ke meja Anda tanpa perlu antre di kasir.',
    highlightText: 'Pelayanan Cepat & Higienis',
    image: '/images/hero.jpg',
    ctaText: 'Eksplor Menu',
  },
];

export const HeroBanner: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Auto slide interval (4.5 seconds)
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % PROMO_SLIDES.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [isPaused]);

  // Touch Swipe Handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const diff = touchStartX.current - touchEndX.current;
      // Min swipe threshold 50px
      if (diff > 50) {
        // Swiped Left -> Next slide
        setCurrentIdx((prev) => (prev + 1) % PROMO_SLIDES.length);
      } else if (diff < -50) {
        // Swiped Right -> Prev slide
        setCurrentIdx((prev) => (prev - 1 + PROMO_SLIDES.length) % PROMO_SLIDES.length);
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
    setIsPaused(false);
  };

  const currentSlide = PROMO_SLIDES[currentIdx];

  const renderTagIcon = (type: PromoSlide['tagIcon']) => {
    switch (type) {
      case 'promo':
        return <Tag className="w-3.5 h-3.5 text-amber-400" />;
      case 'fire':
        return <Flame className="w-3.5 h-3.5 text-amber-400" />;
      case 'award':
        return <Award className="w-3.5 h-3.5 text-amber-400" />;
      case 'sparkle':
      default:
        return <Sparkles className="w-3.5 h-3.5 text-amber-400" />;
    }
  };

  return (
    <div
      className="relative overflow-hidden bg-espresso-950 text-white rounded-3xl mx-4 mt-3 max-w-4xl sm:mx-auto shadow-elevated border border-espresso-800 select-none group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Image Carousel Container */}
      <div className="relative h-48 sm:h-56 md:h-64 w-full overflow-hidden">
        {PROMO_SLIDES.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              idx === currentIdx ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-7000 ease-out"
            />
            {/* Rich Gradient Overlay for strong typography contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-espresso-950 via-espresso-950/85 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-espresso-950/90 via-transparent to-black/30" />
          </div>
        ))}

        {/* Slide Content Layer */}
        <div className="relative z-20 h-full p-5 sm:p-7 flex flex-col justify-between max-w-xl">
          {/* Top Tag */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-espresso-900/90 border border-amber-400/40 text-amber-300 text-[10px] sm:text-xs font-black tracking-wider uppercase backdrop-blur-md shadow-2xs">
              {renderTagIcon(currentSlide.tagIcon)}
              <span>{currentSlide.tag}</span>
            </span>
          </div>

          {/* Main Headline & Description */}
          <div className="space-y-1.5 sm:space-y-2">
            <h2 className="text-lg sm:text-2xl md:text-3xl font-black text-white font-display leading-tight tracking-tight drop-shadow-md">
              {currentSlide.title}
            </h2>
            <p className="text-xs sm:text-sm text-espresso-200 line-clamp-2 max-w-md font-medium leading-relaxed drop-shadow-sm">
              {currentSlide.subtitle}
            </p>
          </div>

          {/* Bottom Highlight & Quick Info */}
          <div className="flex items-center gap-3 pt-1">
            <span className="text-[11px] sm:text-xs font-black text-amber-400 bg-amber-400/15 border border-amber-400/30 px-3 py-1 rounded-xl">
              {currentSlide.highlightText}
            </span>
            {currentSlide.ctaText && (
              <span className="text-xs text-white/90 font-bold flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                <span>{currentSlide.ctaText}</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
