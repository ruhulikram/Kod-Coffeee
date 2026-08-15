import React from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Receipt } from 'lucide-react';
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
    currentTable,
    clearCart,
  } = useStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-espresso-950/70 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-md bg-white h-full shadow-floating flex flex-col justify-between animate-slide-up sm:animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-espresso-800 flex items-center justify-between bg-espresso-950 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-espresso-950 flex items-center justify-center font-bold shadow-xs">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm leading-tight font-display text-white">Keranjang Pesanan</h2>
              <p className="text-[11px] text-amber-300 font-bold">
                {currentTable ? `Meja: ${currentTable.table_number}` : 'Belum memilih meja'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-[11px] text-espresso-300 hover:text-white px-2 py-1 rounded hover:bg-espresso-800 transition-colors"
                title="Hapus semua"
              >
                Kosongkan
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-espresso-800 hover:bg-espresso-700 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-oat-200 flex items-center justify-center text-espresso-400 mb-3">
              <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
            </div>
            <h3 className="font-bold text-base text-espresso-900 mb-1 font-display">
              Keranjang Masih Kosong
            </h3>
            <p className="text-xs text-espresso-500 max-w-xs mb-6 leading-relaxed">
              Jelajahi pilihan specialty coffee dan menu kami, lalu tambahkan item kesukaanmu ke sini.
            </p>
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-espresso-900 hover:bg-espresso-800 text-white font-bold text-xs shadow-sm transition-colors"
            >
              Mulai Pilih Menu
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.map((item) => (
              <div
                key={`${item.menu.id}-${item.notes}`}
                className="p-3.5 rounded-2xl bg-oat-50 border border-espresso-100 flex gap-3 items-start justify-between group hover:border-espresso-200 transition-colors"
              >
                {/* Thumb */}
                <img
                  src={item.menu.image || '/images/latte.jpg'}
                  alt={item.menu.name}
                  className="w-16 h-16 rounded-xl object-cover bg-espresso-100 flex-shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/latte.jpg';
                  }}
                />

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs text-espresso-900 leading-snug line-clamp-1">
                    {item.menu.name}
                  </h4>
                  <p className="text-xs font-semibold text-crema-600 font-display mt-0.5">
                    {formatRupiah(item.menu.price)}
                  </p>

                  {item.notes && (
                    <p className="text-[11px] text-espresso-500 bg-white/80 px-2 py-0.5 rounded-md border border-espresso-100 mt-1 italic line-clamp-1">
                      Catatan: {item.notes}
                    </p>
                  )}

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-2 mt-2.5">
                    <div className="flex items-center gap-2 bg-white rounded-lg border border-espresso-200 p-0.5">
                      <button
                        onClick={() => updateCartQuantity(item.menu.id, -1)}
                        className="w-6 h-6 rounded flex items-center justify-center text-espresso-700 hover:bg-espresso-100 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold w-4 text-center text-espresso-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.menu.id, 1)}
                        className="w-6 h-6 rounded flex items-center justify-center text-espresso-700 hover:bg-espresso-100 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-xs font-bold text-espresso-800 ml-auto font-display">
                      {formatRupiah(item.menu.price * item.quantity)}
                    </span>

                    <button
                      onClick={() => removeFromCart(item.menu.id)}
                      className="p-1 text-espresso-400 hover:text-ember transition-colors"
                      title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer with Calculation & CTA */}
        {cart.length > 0 && (
          <div className="p-4 bg-espresso-950 text-white border-t border-espresso-800 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-espresso-300">
                <span>Subtotal ({cart.length} item)</span>
                <span className="font-bold text-white">{formatRupiah(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between text-espresso-300">
                <span>Pajak Resto (PB1 10%)</span>
                <span className="font-bold text-white">{formatRupiah(cartTax)}</span>
              </div>
              <div className="flex justify-between text-espresso-300">
                <span>Biaya Layanan (5%)</span>
                <span className="font-bold text-white">{formatRupiah(cartService)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-2.5 border-t border-espresso-800">
                <span className="flex items-center gap-1.5 text-espresso-200">
                  <Receipt className="w-4 h-4 text-amber-400" />
                  Total Pembayaran
                </span>
                <span className="text-white font-black font-display text-lg">
                  {formatRupiah(cartTotal)}
                </span>
              </div>
            </div>

            <button
              onClick={onProceedToCheckout}
              className="w-full py-3.5 px-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-espresso-950 font-black text-sm flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
            >
              <span>Lanjut ke Pembayaran</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
