import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatRupiah } from '../../utils/formatters';

interface FloatingCartBarProps {
  onOpenCart: () => void;
}

export const FloatingCartBar: React.FC<FloatingCartBarProps> = ({ onOpenCart }) => {
  const { cart, cartCount, cartTotal } = useStore();

  if (cartCount === 0) return null;

  const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-3 right-3 sm:left-4 sm:right-4 z-40 max-w-xl mx-auto animate-slide-up">
      <button
        onClick={onOpenCart}
        className="w-full bg-espresso-950 text-white p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl shadow-2xl shadow-espresso-950/30 border border-espresso-800 ring-1 ring-black/40 flex items-center justify-between gap-3 active:scale-[0.98] hover:border-espresso-700 transition-all group"
      >
        {/* Left: Bag Icon & Order Details */}
        <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
          <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-400 text-espresso-950 flex items-center justify-center font-bold text-base shadow-sm shrink-0">
            <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
            <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] px-1 rounded-full bg-espresso-950 text-amber-300 text-[10px] font-black flex items-center justify-center border-2 border-amber-400 shadow-sm">
              {totalQuantity}
            </span>
          </div>

          <div className="text-left min-w-0">
            <span className="block text-[11px] sm:text-xs font-semibold text-espresso-300 mb-0.5 truncate">
              {cart.length} Menu • {totalQuantity} Porsi
            </span>
            <p className="text-sm sm:text-base font-black text-white font-display tracking-tight">
              {formatRupiah(cartTotal)}
            </p>
          </div>
        </div>

        {/* Right: Clean Action Button */}
        <div className="flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-amber-400 hover:bg-amber-300 text-espresso-950 font-black text-xs sm:text-sm shadow-sm transition-all shrink-0">
          <span>Lihat Pesanan</span>
          <ArrowRight className="w-4 h-4 stroke-[3] group-hover:translate-x-1 transition-transform" />
        </div>
      </button>
    </div>
  );
};
