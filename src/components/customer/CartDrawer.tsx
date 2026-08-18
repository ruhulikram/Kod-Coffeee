import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Receipt,
  AlertTriangle,
  FileText,
  Coffee,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatRupiah } from '../../utils/formatters';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onProceedToCheckout,
}) => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    cartTax,
    cartService,
    cartTotal,
    clearCart,
  } = useStore();

  // Confirmation state before clearing the cart
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  if (!isOpen) return null;

  const totalQuantity = cart.reduce((a, b) => a + b.quantity, 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-stretch justify-end bg-espresso-950/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-t-[32px] sm:rounded-none sm:rounded-l-[32px] max-h-[92vh] sm:max-h-full h-full shadow-floating flex flex-col justify-between overflow-hidden animate-slide-up sm:animate-fade-in border-t sm:border-t-0 sm:border-l border-espresso-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Drag Handle (Mobile visual cue) */}
        <div className="pt-2.5 pb-1 bg-espresso-950 flex justify-center sm:hidden">
          <div className="w-12 h-1.5 rounded-full bg-espresso-700/80" />
        </div>

        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-espresso-800 flex items-center justify-between bg-espresso-950 text-white shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-espresso-950 flex items-center justify-center font-bold shadow-xs shrink-0">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                <h2 className="font-black text-base sm:text-lg leading-tight font-display text-white truncate">
                  Keranjang Pesanan
                </h2>
                <span className="whitespace-nowrap text-[11px] bg-amber-400/20 text-amber-300 font-extrabold px-2.5 py-0.5 rounded-full border border-amber-400/30">
                  {totalQuantity} {totalQuantity === 1 ? 'Item' : 'Item'}
                </span>
              </div>
              <p className="text-xs text-espresso-300 mt-0.5 truncate">
                Periksa rincian menu pilihan Anda
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {cart.length > 0 && (
              <button
                type="button"
                onClick={() => setShowClearConfirm(true)}
                className="flex items-center gap-1 text-xs text-espresso-300 hover:text-ember-400 px-2.5 py-1.5 rounded-xl hover:bg-ember-500/10 border border-espresso-800 hover:border-ember-500/30 transition-all font-semibold active:scale-95"
                title="Hapus semua item"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden xs:inline sm:inline">Kosongkan</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-espresso-900 hover:bg-espresso-800 text-espresso-300 hover:text-white flex items-center justify-center border border-espresso-800 transition-colors shadow-xs active:scale-95"
              title="Tutup Keranjang"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content List */}
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-oat-50/50">
            <div className="w-20 h-20 rounded-3xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600 mb-3.5 shadow-sm">
              <Coffee className="w-10 h-10 stroke-[1.5]" />
            </div>
            <h3 className="font-extrabold text-base sm:text-lg text-espresso-950 mb-1 font-display">
              Keranjang Masih Kosong
            </h3>
            <p className="text-xs text-espresso-500 max-w-xs mb-6 leading-relaxed">
              Silakan jelajahi menu specialty coffee dan hidangan kami, lalu tambahkan item kesukaanmu ke sini.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-2xl bg-espresso-950 hover:bg-espresso-900 text-white font-extrabold text-xs shadow-md transition-all active:scale-95"
            >
              Mulai Pilih Menu
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-oat-50/40">
            {cart.map((item) => (
              <div
                key={`${item.menu.id}-${item.notes}`}
                className="p-3.5 sm:p-4 rounded-3xl bg-white border border-espresso-100 shadow-subtle flex gap-3 sm:gap-3.5 items-start justify-between group hover:border-espresso-300 transition-all"
              >
                {/* Thumb */}
                <img
                  src={item.menu.image || '/images/latte.jpg'}
                  alt={item.menu.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover bg-espresso-100 flex-shrink-0 shadow-xs border border-espresso-100"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/latte.jpg';
                  }}
                />

                {/* Details */}
                <div className="flex-1 min-w-0">
                  {/* Top Row: Title & Remove Item Button */}
                  <div className="flex items-start justify-between gap-1">
                    <h4 className="font-black text-xs sm:text-sm text-espresso-950 leading-snug line-clamp-1 font-display">
                      {item.menu.name}
                    </h4>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.menu.id)}
                      className="w-6 h-6 rounded-lg flex items-center justify-center text-espresso-300 hover:text-ember hover:bg-ember-50 transition-colors shrink-0 -mt-0.5 -mr-1"
                      title="Hapus menu ini"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Unit Price Info */}
                  <div className="flex items-center gap-1.5 mt-0.5 text-xs text-espresso-500">
                    <span className="font-medium">Harga:</span>
                    <span className="font-bold text-espresso-800 font-display">
                      {formatRupiah(item.menu.price)}
                    </span>
                    <span className="text-[11px] text-espresso-400">/ item</span>
                  </div>

                  {/* Notes badge if any */}
                  {item.notes && (
                    <div className="mt-1.5 flex items-start gap-1.5 bg-amber-50/90 border border-amber-200/70 rounded-xl px-2.5 py-1 text-[11px] text-amber-950">
                      <FileText className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span className="line-clamp-2 leading-tight">
                        <strong className="font-bold text-amber-900">Catatan:</strong> {item.notes}
                      </span>
                    </div>
                  )}

                  {/* Quantity Stepper & Item Subtotal Row */}
                  <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-espresso-50">
                    {/* Stepper pill */}
                    <div className="flex items-center gap-1 bg-espresso-950 text-white rounded-xl p-0.5 shadow-sm">
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.menu.id, -1)}
                        className="w-7 h-7 rounded-lg bg-espresso-900 hover:bg-espresso-800 text-espresso-200 hover:text-white flex items-center justify-center active:scale-90 transition-transform"
                        title="Kurangi"
                      >
                        <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>
                      <span className="text-xs font-black w-6 text-center text-amber-300 font-display">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.menu.id, 1)}
                        className="w-7 h-7 rounded-lg bg-amber-400 hover:bg-amber-300 text-espresso-950 flex items-center justify-center active:scale-90 transition-transform shadow-xs"
                        title="Tambah"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[3]" />
                      </button>
                    </div>

                    {/* Subtotal for this item */}
                    <div className="text-right">
                      <span className="text-[10px] font-semibold text-espresso-400 uppercase tracking-wider block">
                        Subtotal
                      </span>
                      <span className="text-xs sm:text-sm font-black text-espresso-950 font-display">
                        {formatRupiah(item.menu.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer with Calculation & CTA */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 bg-espresso-950 text-white border-t border-espresso-800 space-y-3.5 shrink-0">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-espresso-300">
                <span>Subtotal ({cart.length} menu • {totalQuantity} porsi)</span>
                <span className="font-bold text-white font-display">{formatRupiah(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between text-espresso-300">
                <span>Pajak Resto (PB1 10%)</span>
                <span className="font-bold text-white font-display">{formatRupiah(cartTax)}</span>
              </div>
              <div className="flex justify-between text-espresso-300">
                <span>Biaya Layanan Service (5%)</span>
                <span className="font-bold text-white font-display">{formatRupiah(cartService)}</span>
              </div>
              <div className="flex justify-between items-center text-sm sm:text-base font-bold text-white pt-2.5 border-t border-espresso-800">
                <span className="flex items-center gap-2 text-espresso-200">
                  <Receipt className="w-4 h-4 text-amber-400" />
                  Total Pembayaran
                </span>
                <span className="text-white font-black font-display text-lg sm:text-xl">
                  {formatRupiah(cartTotal)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onProceedToCheckout}
              className="w-full py-4 px-5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-espresso-950 font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-lg active:scale-95 transition-all"
            >
              <span>Lanjut ke Pembayaran QRIS</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        )}

        {/* Modal Validasi / Konfirmasi Kosongkan Keranjang */}
        {showClearConfirm && (
          <div
            className="absolute inset-0 z-50 bg-espresso-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setShowClearConfirm(false)}
          >
            <div
              className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-espresso-200 animate-slide-up text-center space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-14 h-14 rounded-2xl bg-ember-light text-ember flex items-center justify-center mx-auto border border-ember/20 shadow-xs">
                <AlertTriangle className="w-7 h-7 stroke-[2.2]" />
              </div>

              <div className="space-y-1.5">
                <h3 className="font-extrabold text-base sm:text-lg text-espresso-950 font-display">
                  Kosongkan Keranjang?
                </h3>
                <p className="text-xs text-espresso-600 leading-relaxed px-1">
                  Semua menu (<strong className="text-espresso-900 font-bold">{totalQuantity} item</strong>) yang telah Anda pilih akan dihapus dari keranjang pesanan.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(false)}
                  className="py-2.5 px-4 rounded-xl border border-espresso-200 text-espresso-700 hover:bg-espresso-100 font-bold text-xs transition-colors active:scale-95"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    clearCart();
                    setShowClearConfirm(false);
                  }}
                  className="py-2.5 px-4 rounded-xl bg-ember hover:bg-ember-dark text-white font-extrabold text-xs shadow-md shadow-ember/20 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Ya, Kosongkan</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

