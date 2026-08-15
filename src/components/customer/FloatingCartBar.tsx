import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatRupiah } from '../../utils/formatters';

interface FloatingCartBarProps {
  onOpenCart: () => void;
}

export const FloatingCartBar: React.FC<FloatingCartBarProps> = ({ onOpenCart }) => {
  const { cartCount, cartTotal, currentTable } = useStore();

  if (cartCount === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-30 max-w-md mx-auto animate-slide-up">
      <button
        onClick={onOpenCart}
        className="w-full bg-espresso-950/95 backdrop-blur-md text-white p-3.5 rounded-2xl shadow-floating border border-espresso-800 flex items-center justify-between gap-3 group active:scale-[0.98] transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl bg-amber-400 text-espresso-950 flex items-center justify-center font-bold text-sm shadow-sm">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-espresso-950 text-white text-[10px] font-black flex items-center justify-center border border-white">
              {cartCount}
            </span>
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-espresso-300 font-medium">Keranjang</span>
              <span className="text-[11px] px-2 py-0.2 rounded-full bg-white/15 text-amber-300 font-black border border-white/10">
                {currentTable ? currentTable.table_number : 'Meja ?'}
              </span>
            </div>
            <p className="text-sm font-black text-white font-display">
              {formatRupiah(cartTotal)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-espresso-100 text-espresso-950 font-black text-xs shadow-xs transition-colors">
          <span>Lihat Pesanan</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </button>
    </div>
  );
};
