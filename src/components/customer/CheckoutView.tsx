import React, { useState } from 'react';
import {
  ArrowLeft,
  QrCode,
  CheckCircle2,
  AlertCircle,
  User,
  Phone,
  Coffee,
  FileText,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { PaymentMethod } from '../../types';
import { formatRupiah } from '../../utils/formatters';

interface CheckoutViewProps {
  onBack: () => void;
  onOrderCreated: (orderId: string, method: PaymentMethod) => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  onBack,
  onOrderCreated,
}) => {
  const {
    cart,
    cartSubtotal,
    cartTax,
    cartService,
    cartTotal,
    currentTable,
    createOrder,
  } = useStore();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [selectedMethod] = useState<PaymentMethod>('qris');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Validation 1: Cart Items
    if (cart.length === 0) {
      setErrorMsg('Keranjang pesanan masih kosong. Silakan pilih menu terlebih dahulu.');
      return;
    }

    // Validation 2: Customer Name
    const trimmedName = customerName.trim();
    if (trimmedName && (trimmedName.length < 2 || trimmedName.length > 50)) {
      setErrorMsg('Nama panggilan harus 2 - 50 karakter.');
      return;
    }

    // Validation 3: WhatsApp Phone (Indonesian format 08xx / 628xx, 9-14 digits)
    const trimmedPhone = customerPhone.trim();
    if (trimmedPhone) {
      const cleanPhone = trimmedPhone.replace(/[\s-]/g, '');
      const waRegex = /^(\+62|62|0)8[1-9][0-9]{6,11}$/;
      if (!waRegex.test(cleanPhone)) {
        setErrorMsg('Format WhatsApp tidak valid (contoh: 081234567890).');
        return;
      }
    }

    // Validation 4: Notes Length
    if (orderNotes.length > 200) {
      setErrorMsg('Catatan tidak boleh lebih dari 200 karakter.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg('');
      const order = await createOrder(
        trimmedName || undefined,
        trimmedPhone || undefined,
        orderNotes.trim() || undefined
      );
      onOrderCreated(order.id, selectedMethod);
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan saat memproses pesanan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalQuantity = cart.reduce((a, b) => a + b.quantity, 0);

  return (
    <div className="w-full max-w-xl mx-auto px-4 sm:px-6 py-4 pb-36 animate-fade-in">
      {/* Clean Header */}
      <div className="flex items-center gap-3 mb-5">
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
            Konfirmasi Pesanan
          </h1>
          <p className="text-xs text-espresso-500 mt-0.5">
            Periksa rincian pesanan Anda sebelum membayar
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3.5 rounded-2xl bg-ember-light border border-ember/30 text-ember-dark text-xs flex items-center gap-2.5 animate-shake">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-ember" />
          <span className="font-bold">{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="space-y-4">
        {/* Card 1: Data Pemesan (with Table Number Badge inside) */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-espresso-200 shadow-subtle space-y-4">
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-espresso-100">
            <h2 className="font-extrabold text-sm sm:text-base text-espresso-900 font-display flex items-center gap-2">
              <User className="w-4 h-4 text-amber-600" />
              <span>Data Pemesan</span>
            </h2>

            {currentTable ? (
              <span className="text-xs font-black px-3 py-1 rounded-full bg-espresso-950 text-amber-300 border border-espresso-800 shadow-2xs flex items-center gap-1.5 shrink-0">
                <Coffee className="w-3.5 h-3.5 text-amber-400" />
                <span>{currentTable.table_number}</span>
              </span>
            ) : (
              <span className="text-[11px] text-espresso-400 font-medium">Opsional</span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-espresso-700 mb-1.5">
                Nama
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-espresso-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={customerName}
                  maxLength={50}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Nama kamu"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-2xl border border-espresso-200 focus:outline-none focus:border-amber-400 bg-oat-50/70"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-espresso-700 mb-1.5">
                No. WhatsApp
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-espresso-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="tel"
                  value={customerPhone}
                  maxLength={16}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="08xx (untuk e-struk)"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-2xl border border-espresso-200 focus:outline-none focus:border-amber-400 bg-oat-50/70"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-espresso-700 mb-1.5">
              Catatan Pesanan
            </label>
            <div className="relative">
              <textarea
                value={orderNotes}
                maxLength={200}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="Contoh: less ice, gula dipisah..."
                rows={2}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-2xl border border-espresso-200 focus:outline-none focus:border-amber-400 bg-oat-50/70 resize-none placeholder:text-espresso-400"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Rincian Pesanan */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-espresso-200 shadow-subtle space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-espresso-100">
            <h2 className="font-extrabold text-sm sm:text-base text-espresso-900 font-display">
              Rincian Pesanan
            </h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-espresso-100 text-espresso-800">
              {totalQuantity} {totalQuantity === 1 ? 'Porsi' : 'Porsi'}
            </span>
          </div>

          {/* List of items */}
          <div className="divide-y divide-espresso-100">
            {cart.map((item) => (
              <div
                key={`${item.menu.id}-${item.notes}`}
                className="py-3 flex items-center justify-between gap-3 text-xs sm:text-sm"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-espresso-100 shrink-0 border border-espresso-100">
                    <img
                      src={item.menu.image || '/images/latte.jpg'}
                      alt={item.menu.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/latte.jpg';
                      }}
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-black px-1.5 py-0.5 rounded bg-espresso-950 text-amber-300 shrink-0">
                        {item.quantity}x
                      </span>
                      <p className="font-bold text-espresso-950 truncate font-display">
                        {item.menu.name}
                      </p>
                    </div>
                    <p className="text-[11px] text-espresso-500 mt-0.5">
                      @ {formatRupiah(item.menu.price)}
                    </p>
                    {item.notes && (
                      <p className="text-[10px] text-amber-900 italic truncate mt-0.5">
                        Catatan: {item.notes}
                      </p>
                    )}
                  </div>
                </div>

                <span className="font-extrabold text-espresso-950 font-display shrink-0 text-xs sm:text-sm">
                  {formatRupiah(item.menu.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Price Calculation breakdown */}
          <div className="pt-3 border-t border-espresso-100 space-y-2 text-xs sm:text-sm">
            <div className="flex justify-between text-espresso-500">
              <span>Subtotal</span>
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

        {/* Card 3: Metode Pembayaran (Clean & Minimal) */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-espresso-200 shadow-subtle space-y-4">
          <h2 className="font-extrabold text-sm sm:text-base text-espresso-900 font-display flex items-center gap-2">
            <QrCode className="w-4 h-4 text-amber-500" />
            <span>Metode Pembayaran</span>
          </h2>

          <div className="p-4 rounded-2xl border-2 border-amber-400 bg-amber-50/60 flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-espresso-950 text-white flex items-center justify-center font-black shadow-xs shrink-0">
                <QrCode className="w-5 h-5 text-amber-400 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-xs sm:text-sm font-extrabold text-espresso-950 font-display block leading-tight">
                  QRIS Instant
                </span>
                <span className="text-xs text-espresso-600 font-medium mt-0.5 block">
                  Semua Bank & E-Wallet
                </span>
              </div>
            </div>

            <div className="w-6 h-6 rounded-full bg-espresso-950 text-amber-400 flex items-center justify-center shrink-0 shadow-2xs">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Floating Bottom Action - Spacious Upwards & Touch Friendly */}
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
              type="submit"
              disabled={isSubmitting || cart.length === 0}
              className="flex-1 max-w-xs py-3.5 sm:py-4 px-6 rounded-2xl bg-amber-400 hover:bg-amber-300 text-espresso-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-lg active:scale-95 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Memproses...</span>
              ) : (
                <>
                  <QrCode className="w-5 h-5 stroke-[2.5]" />
                  <span>Bayar via QRIS</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};


