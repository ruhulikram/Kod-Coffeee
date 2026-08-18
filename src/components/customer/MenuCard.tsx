import React from 'react';
import { Plus, Minus, Sparkles } from 'lucide-react';
import { MenuItem } from '../../types';
import { formatRupiah } from '../../utils/formatters';
import { useStore } from '../../context/StoreContext';

interface MenuCardProps {
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
}

export const MenuCard: React.FC<MenuCardProps> = ({ item, onSelect }) => {
  const { cart, addToCart, updateCartQuantity } = useStore();

  const totalQuantityInCart = cart
    .filter((c) => c.menu.id === item.id)
    .reduce((acc, c) => acc + c.quantity, 0);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.is_available) {
      addToCart(item, 1);
    }
  };

  const handleQuickReduce = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateCartQuantity(item.id, -1);
  };

  return (
    <div
      onClick={() => onSelect(item)}
      className={`group relative bg-white rounded-2xl p-3 border border-espresso-100 shadow-subtle hover:shadow-md hover:border-espresso-200 transition-all cursor-pointer flex items-center justify-between gap-3 ${!item.is_available ? 'opacity-60 grayscale-[30%]' : 'active:scale-[0.99]'
        }`}
    >
      {/* Left: Thumbnail with Signature Badge */}
      <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-xl overflow-hidden bg-espresso-100 shrink-0">
        <img
          src={item.image || '/images/latte.jpg'}
          alt={item.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/latte.jpg';
          }}
        />

        {item.is_signature && (
          <div className="absolute top-1.5 left-1.5 flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-400 text-espresso-950 text-[9px] font-black tracking-wider uppercase shadow-sm">
            <Sparkles className="w-2.5 h-2.5 fill-espresso-950" />
            <span>FAV</span>
          </div>
        )}

        {!item.is_available && (
          <div className="absolute inset-0 bg-espresso-950/80 backdrop-blur-[1px] flex items-center justify-center p-1">
            <span className="px-2 py-0.5 rounded bg-ember-dark text-white text-[9px] font-extrabold text-center shadow-xs">
              Habis
            </span>
          </div>
        )}
      </div>

      {/* Center: Details */}
      <div className="flex-1 min-w-0 pr-1">
        <h3 className="font-extrabold text-xs sm:text-sm text-espresso-950 leading-snug group-hover:text-crema-700 transition-colors line-clamp-1 font-display">
          {item.name}
        </h3>

        <p className="text-[11px] text-espresso-500 mt-0.5 line-clamp-1">
          {item.taste_notes || item.description}
        </p>

        <div className="mt-1.5 flex items-center gap-2">
          <span className="text-xs sm:text-sm font-black text-espresso-900 font-display">
            {formatRupiah(item.price)}
          </span>
          {item.taste_notes && (
            <span className="hidden sm:inline-block text-[9px] font-semibold bg-oat-100 text-espresso-600 px-1.5 py-0.2 rounded border border-espresso-100 truncate max-w-[120px]">
              {item.taste_notes.split(',')[0]}
            </span>
          )}
        </div>
      </div>

      {/* Right: Interactive Stepper (Add & Reduce directly from menu) */}
      <div className="shrink-0">
        {!item.is_available ? (
          <span className="text-[10px] font-bold text-espresso-400">Habis</span>
        ) : totalQuantityInCart === 0 ? (
          <button
            onClick={handleQuickAdd}
            className="w-8 h-8 rounded-xl bg-espresso-950 hover:bg-espresso-900 text-white flex items-center justify-center shadow-xs active:scale-90 transition-all"
            title="Tambah ke keranjang"
          >
            <Plus className="w-4 h-4 text-white stroke-[2.5]" />
          </button>
        ) : (
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 bg-espresso-950 text-white rounded-xl p-0.5 shadow-sm"
          >
            <button
              onClick={handleQuickReduce}
              className="w-7 h-7 rounded-lg bg-espresso-900 hover:bg-espresso-800 text-white flex items-center justify-center active:scale-90 transition-all"
              title="Kurangi 1"
            >
              <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
            <span className="text-xs font-black w-5 text-center text-amber-300 font-display">
              {totalQuantityInCart}
            </span>
            <button
              onClick={handleQuickAdd}
              className="w-7 h-7 rounded-lg bg-amber-400 hover:bg-amber-300 text-espresso-950 flex items-center justify-center active:scale-90 transition-all shadow-xs"
              title="Tambah 1"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
