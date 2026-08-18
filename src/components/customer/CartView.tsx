import React, { useState } from 'react';
import {
  ArrowLeft,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Coffee,
  AlertTriangle,
  FileText,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatRupiah } from '../../utils/formatters';

interface CartViewProps {
  onBack: () => void;
  onProceedToCheckout: () => void;
}

export const CartView: React.FC<CartViewProps> = ({
  onBack,
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
    currentTable,
  } = useStore();

  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="w-full max-w-xl mx-auto px-4 sm:px-6 py-4 pb-36 animate-fade-in">
      {/* Clean Header */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 rounded-2xl bg-white border border-espresso-200 text-espresso-800 flex items-center justify-center hover:bg-espresso-50 transition-colors shadow-2xs active:scale-95 shrink-0"
            title="Kembali ke Menu"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-espresso-950 font-display leading-tight">
              Keranjang Pesanan
            </h1>
            <p className="text-xs text-espresso-500 mt-0.5">
              Periksa dan atur rincian menu pesanan Anda
            </p>
          </div>
        </div>

        {cart.length > 0 && (
          <button
            type="button"
            onClick={() => setShowClearConfirm(true)}
            className="flex items-center gap-1.5 text-xs text-espresso-500 hover:text-ember px-3 py-2 rounded-xl hover:bg-ember-50 border border-espresso-200 hover:border-ember/30 transition-all font-bold active:scale-95 bg-white shadow-2xs shrink-0"
            title="Hapus semua item"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Kosongkan</span>
          </button>
        )}
      </div>

      {/* Main Content Area */}
      {cart.length === 0 ? (
        /* Empty Cart State */
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-espresso-200 shadow-subtle text-center space-y-4 animate-fade-in my-6">
          <div className="w-20 h-20 rounded-3xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600 mx-auto shadow-sm">
            <Coffee className="w-10 h-10 stroke-[1.5]" />
          </div>
          <div className="space-y-1">
            <h2 className="font-black text-base sm:text-lg text-espresso-950 font-display">
              Keranjang Masih Kosong
            </h2>
            <p className="text-xs text-espresso-500 max-w-xs mx-auto leading-relaxed">
              Silakan jelajahi menu specialty coffee dan hidangan kami, lalu tambahkan item kesukaanmu ke sini.
            </p>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 rounded-2xl bg-espresso-950 hover:bg-espresso-900 text-white font-black text-xs shadow-md transition-all active:scale-95"
          >
            Mulai Pilih Menu
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Card 1: Daftar Menu Pesanan (Card Layout aligned with CheckoutView) */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-espresso-200 shadow-subtle space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-espresso-100">
              <h2 className="font-extrabold text-sm sm:text-base text-espresso-900 font-display">
                Rincian Menu ({cart.length} menu)
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-espresso-100 text-espresso-800">
                  {totalQuantity} Porsi
                </span>
              </div>
            </div>

            {/* List of Cart Items */}
            <div className="divide-y divide-espresso-100">
              {cart.map((item) => (
                <div
                  key={`${item.menu.id}-${item.notes}`}
                  className="py-4 first:pt-1 last:pb-1 flex flex-col sm:flex-row gap-3.5 sm:items-center justify-between"
                >
                  {/* Left: Thumbnail & Info */}
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden bg-espresso-100 shrink-0 border border-espresso-100 shadow-2xs">
                      <img
                        src={item.menu.image || '/images/latte.jpg'}
                        alt={item.menu.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/latte.jpg';
                        }}
                      />
                    </div>

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-1">
                        <h3 className="font-black text-xs sm:text-sm text-espresso-950 font-display leading-snug truncate">
                          {item.menu.name}
                        </h3>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.menu.id)}
                          className="text-espresso-300 hover:text-ember p-1 rounded-lg hover:bg-ember-50 transition-colors shrink-0 -mt-1"
                          title="Hapus menu ini"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-[11px] text-espresso-500 font-medium">
                        Harga: <strong className="text-espresso-800 font-bold font-display">{formatRupiah(item.menu.price)}</strong> / porsi
                      </p>

                      {item.notes && (
                        <div className="mt-1 flex items-start gap-1.5 bg-amber-50/90 border border-amber-200/80 rounded-xl px-2 py-0.5 text-[10px] text-amber-950 max-w-md">
                          <FileText className="w-3 h-3 text-amber-600 shrink-0 mt-0.5" />
                          <span className="truncate">
                            <strong className="font-bold text-amber-900">Catatan:</strong> {item.notes}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Quantity Stepper & Item Subtotal */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-espresso-50">
                    {/* Stepper pill */}
                    <div className="flex items-center gap-0.5 sm:gap-1 bg-espresso-950 text-white rounded-xl p-0.5 shadow-sm ring-1 ring-espresso-800">
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
                    <div className="text-right min-w-[80px]">
                      <span className="text-[9px] font-bold text-espresso-400 uppercase tracking-wider block">
                        Subtotal
                      </span>
                      <span className="text-xs sm:text-sm font-black text-espresso-950 font-display">
                        {formatRupiah(item.menu.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Rincian Biaya (Aligned with CheckoutView) */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-espresso-200 shadow-subtle space-y-3">
            <h2 className="font-extrabold text-sm sm:text-base text-espresso-900 font-display pb-1 border-b border-espresso-100">
              Rincian Biaya
            </h2>

            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between text-espresso-500">
                <span>Subtotal ({totalQuantity} porsi)</span>
                <span className="font-semibold text-espresso-800 font-display">
                  {formatRupiah(cartSubtotal)}
                </span>
              </div>
              <div className="flex justify-between text-espresso-500">
                <span>Pajak Restoran (PB1 10%)</span>
                <span className="font-semibold text-espresso-800 font-display">
                  {formatRupiah(cartTax)}
                </span>
              </div>
              <div className="flex justify-between text-espresso-500">
                <span>Biaya Layanan (5%)</span>
                <span className="font-semibold text-espresso-800 font-display">
                  {formatRupiah(cartService)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm sm:text-base font-black text-espresso-950 pt-3 mt-1 border-t-2 border-espresso-100">
                <span>Total Pembayaran</span>
                <span className="text-base sm:text-lg text-amber-600 font-display font-black">
                  {formatRupiah(cartTotal)}
                </span>
              </div>
            </div>
          </div>

          {/* Floating Bottom Action Bar (Identical to CheckoutView) */}
          <div className="fixed bottom-0 left-0 right-0 z-30 bg-espresso-950/95 backdrop-blur-md p-4 sm:p-5 pb-6 border-t border-espresso-800 shadow-2xl">
            <div className="max-w-xl mx-auto flex items-center justify-between gap-4">
              <div>
                <span className="text-[11px] text-espresso-400 uppercase tracking-wider block font-bold mb-0.5">
                  Total Pembayaran
                </span>
                <span className="text-lg sm:text-xl font-black text-white font-display leading-tight">
                  {formatRupiah(cartTotal)}
                </span>
              </div>

              <button
                type="button"
                onClick={onProceedToCheckout}
                className="flex-1 max-w-xs py-3.5 sm:py-4 px-6 rounded-2xl bg-amber-400 hover:bg-amber-300 text-espresso-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-lg active:scale-95 transition-all"
              >
                <span>Lanjut ke Checkout</span>
                <ArrowRight className="w-4.5 h-4.5 stroke-[3]" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Kosongkan Keranjang */}
      {showClearConfirm && (
        <div
          className="fixed inset-0 z-50 bg-espresso-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
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
  );
};
