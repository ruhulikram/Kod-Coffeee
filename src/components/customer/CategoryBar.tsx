import React, { useEffect, useRef } from 'react';
import { Sparkles, Coffee, CupSoda, UtensilsCrossed, Cake, Star, Search, X } from 'lucide-react';
import { Category } from '../../types';

interface CategoryBarProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (id: string | null) => void;
  hasFavorites?: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  hasFavorites = true,
  searchQuery,
  setSearchQuery,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case 'signature-coffee':
        return <Sparkles className="w-3.5 h-3.5 text-amber-500" />;
      case 'manual-brew':
        return <Coffee className="w-3.5 h-3.5 text-crema-600" />;
      case 'non-coffee':
        return <CupSoda className="w-3.5 h-3.5 text-brew" />;
      case 'bakery-toast':
        return <Cake className="w-3.5 h-3.5 text-amber-600" />;
      case 'hearty-meals':
        return <UtensilsCrossed className="w-3.5 h-3.5 text-espresso-700" />;
      default:
        return <Coffee className="w-3.5 h-3.5" />;
    }
  };

  const activeCategories = categories.filter((c) => c.is_active);

  // Auto-scroll active category pill into center view
  useEffect(() => {
    if (!scrollContainerRef.current || searchQuery) return;
    const activeBtn = scrollContainerRef.current.querySelector('[data-active="true"]') as HTMLElement;
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [selectedCategoryId, searchQuery]);

  const handlePillClick = (id: string | null) => {
    if (searchQuery) setSearchQuery(''); // Clear search on category pill click
    onSelectCategory(id);
    const targetElementId = id === 'favorites' || id === null ? 'sec-favorites' : `sec-${id}`;
    const targetElement = document.getElementById(targetElementId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="sticky top-0 z-20 bg-oat-50/95 backdrop-blur-md py-2.5 px-4 border-b border-espresso-200/70 shadow-xs space-y-2">
      <div className="max-w-4xl mx-auto space-y-2">
        {/* Instant Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-espresso-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kopi, hidangan, rasa kesukaanmu..."
            className="w-full pl-9 pr-9 py-2 text-xs font-medium rounded-2xl border border-espresso-200 focus:outline-none focus:border-amber-500 bg-white/90 shadow-2xs placeholder:text-espresso-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-espresso-200 hover:bg-espresso-300 text-espresso-700 flex items-center justify-center transition-colors"
              title="Hapus pencarian"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Category Horizontal Scroll Pills */}
        {!searchQuery && (
          <div
            ref={scrollContainerRef}
            className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5"
          >
            {/* Favorit / Rekomendasi Pill */}
            {hasFavorites && (
              <button
                onClick={() => handlePillClick('favorites')}
                data-active={selectedCategoryId === 'favorites' || selectedCategoryId === null}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black whitespace-nowrap transition-all duration-200 shrink-0 shadow-2xs ${
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
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black whitespace-nowrap transition-all duration-200 shrink-0 shadow-2xs ${
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
        )}
      </div>
    </div>
  );
};
