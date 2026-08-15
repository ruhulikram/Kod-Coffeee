import React, { useEffect, useRef } from 'react';
import { Sparkles, Coffee, Flame, CupSoda, UtensilsCrossed, Cake, Star } from 'lucide-react';
import { Category } from '../../types';

interface CategoryBarProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (id: string | null) => void;
  hasFavorites?: boolean;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  hasFavorites = true,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case 'signature-coffee':
        return <Sparkles className="w-3.5 h-3.5" />;
      case 'manual-brew':
        return <Coffee className="w-3.5 h-3.5" />;
      case 'non-coffee':
        return <CupSoda className="w-3.5 h-3.5" />;
      case 'bakery-toast':
        return <Cake className="w-3.5 h-3.5" />;
      case 'hearty-meals':
        return <UtensilsCrossed className="w-3.5 h-3.5" />;
      default:
        return <Coffee className="w-3.5 h-3.5" />;
    }
  };

  const activeCategories = categories.filter((c) => c.is_active);

  // Auto-scroll active category pill into center view
  useEffect(() => {
    if (!scrollContainerRef.current) return;
    const activeBtn = scrollContainerRef.current.querySelector('[data-active="true"]') as HTMLElement;
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [selectedCategoryId]);

  const handlePillClick = (id: string | null) => {
    onSelectCategory(id);
    const targetElementId = id === 'favorites' || id === null ? 'sec-favorites' : `sec-${id}`;
    const targetElement = document.getElementById(targetElementId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="sticky top-[58px] z-20 bg-oat-50/95 backdrop-blur-md py-2.5 px-4 border-b border-espresso-200/60 shadow-xs">
      <div
        ref={scrollContainerRef}
        className="max-w-4xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5"
      >
        {/* Favorit / Rekomendasi Pill */}
        {hasFavorites && (
          <button
            onClick={() => handlePillClick('favorites')}
            data-active={selectedCategoryId === 'favorites' || selectedCategoryId === null}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-black whitespace-nowrap transition-all duration-200 shrink-0 shadow-sm ${
              selectedCategoryId === 'favorites' || selectedCategoryId === null
                ? 'bg-espresso-950 text-white ring-1 ring-espresso-800'
                : 'bg-white text-espresso-800 hover:bg-espresso-50 border border-espresso-200'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>Menu Favorit</span>
          </button>
        )}

        {/* Category Specific Pills */}
        {activeCategories.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handlePillClick(cat.id)}
              data-active={isSelected}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-black whitespace-nowrap transition-all duration-200 shrink-0 shadow-sm ${
                isSelected
                  ? 'bg-espresso-950 text-white ring-1 ring-espresso-800'
                  : 'bg-white text-espresso-800 hover:bg-espresso-50 border border-espresso-200'
              }`}
            >
              {getCategoryIcon(cat.slug)}
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
