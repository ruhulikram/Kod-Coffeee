import React from 'react';
import { Coffee, QrCode, Search, ShieldAlert, ShoppingBag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface NavbarProps {
  onOpenTableSelector: () => void;
  onOpenCart: () => void;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
  onSwitchToAdmin: () => void;
  activeView: string;
  setActiveView: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenTableSelector,
  onOpenCart,
  searchQuery,
  setSearchQuery,
  onSwitchToAdmin,
  activeView,
  setActiveView,
}) => {
  const { currentTable, cartCount } = useStore();

  return (
    <header className="sticky top-0 z-30 bg-espresso-950/95 backdrop-blur-md text-white border-b border-espresso-800 shadow-elevated">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Brand */}
        <div
          onClick={() => setActiveView('menu')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-400 text-espresso-950 flex items-center justify-center font-bold group-hover:scale-105 transition-transform shadow-xs">
            <Coffee className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-lg tracking-tight text-white font-display">
                KOD<span className="text-amber-400">COFFEE</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider font-black px-1.5 py-0.5 rounded bg-white/10 text-amber-300 border border-white/10">
                Roastery
              </span>
            </div>
            <p className="text-[11px] text-espresso-300 font-medium">Artisan Table Ordering</p>
          </div>
        </div>

        {/* Center/Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Table Badge */}
          <button
            onClick={onOpenTableSelector}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-espresso-900 hover:bg-espresso-800 border border-espresso-700 transition-all text-xs font-semibold text-white shadow-xs active:scale-95"
            title="Ubah nomor meja atau scan QR"
          >
            <QrCode className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-extrabold text-white">
              {currentTable ? currentTable.table_number : 'Pilih Meja'}
            </span>
          </button>

          {/* Cart Icon in Navbar */}
          <button
            onClick={onOpenCart}
            className="relative p-2 rounded-xl bg-espresso-900 hover:bg-espresso-800 text-white border border-espresso-700 transition-all active:scale-95"
            title="Keranjang Pesanan"
          >
            <ShoppingBag className="w-5 h-5 text-white" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-400 text-espresso-950 font-black text-[11px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 shadow-md animate-scale">
                {cartCount}
              </span>
            )}
          </button>

          {/* Admin Toggle */}
          <button
            onClick={onSwitchToAdmin}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-espresso-900 hover:bg-espresso-800 text-espresso-300 hover:text-white border border-espresso-800 transition-colors"
            title="Portal Barista & Admin"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Staff Portal</span>
          </button>
        </div>
      </div>
    </header>
  );
};
