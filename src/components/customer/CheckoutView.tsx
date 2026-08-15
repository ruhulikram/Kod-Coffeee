import React, { useState } from 'react';
import {
  ArrowLeft,
  QrCode,
  ShieldCheck,
  CreditCard,
  Wallet,
  Building2,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
  Phone,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { PaymentMethod } from '../../types';
import { formatRupiah } from '../../utils/formatters';

interface CheckoutViewProps {
  onBack: () => void;
  onOrderCreated: (orderId: string, method: PaymentMethod) => void;
}

const PAYMENT_METHODS: {
  id: PaymentMethod;
  name: string;
  category: 'qris' | 'ewallet' | 'va';
  description: string;
  badge?: string;
}[] = [
  {
    id: 'qris',
    name: 'QRIS (Semua Bank & E-Wallet)',
    category: 'qris',
    description: 'BCA, Mandiri, BRI, GoPay, OVO, ShopeePay, Dana',
    badge: 'Paling Populer',
  },
  {
    id: 'gopay',
    name: 'GoPay',
    category: 'ewallet',
    description: 'Instant redirect & QR GoPay',
  },
  {
    id: 'ovo',
    name: 'OVO',
    category: 'ewallet',
    description: 'Notifikasi push ke aplikasi OVO',
  },
  {
    id: 'shopeepay',
    name: 'ShopeePay',
    category: 'ewallet',
    description: 'Cashback koin & instant pay',
  },
  {
    id: 'bca_va',
    name: 'BCA Virtual Account',
    category: 'va',
    description: 'Verifikasi otomatis 24 jam',
  },
  {
    id: 'mandiri_va',
    name: 'Mandiri Virtual Account',
    category: 'va',
    description: 'Transfer via Livin / ATM Mandiri',
  },
];

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
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('qris');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTable) {
      setErrorMsg('Nomor meja belum terdeteksi. Silakan pilih meja terlebih dahulu.');
      return;
    }
    if (cart.length === 0) {
      setErrorMsg('Keranjang kosong.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg('');
      const order = await createOrder(customerName, customerPhone, orderNotes);
      onOrderCreated(order.id, selectedMethod);
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan saat memproses pesanan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 pb-28 animate-fade-in">
      {/* Header Bar */}
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full bg-white border border-espresso-200 text-espresso-800 flex items-center justify-center hover:bg-espresso-50 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-espresso-950 font-display">
            Konfirmasi Pesanan
          </h1>
          <p className="text-xs text-espresso-500">Periksa rincian pesanan dan metode pembayaran</p>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3.5 rounded-2xl bg-ember-light border border-ember/20 text-ember-dark text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="space-y-4">
        {/* Table Confirmation Card */}
        <div className="bg-espresso-950 text-white rounded-2xl p-4 shadow-elevated border border-espresso-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-crema text-espresso-950 flex items-center justify-center font-black shadow-sm">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-espresso-300 font-medium block">Nomor Meja Terhubung</span>
              <span className="text-base font-black text-white font-display">
                {currentTable ? currentTable.table_number : 'Meja Tidak Valid'}
              </span>
            </div>
          </div>
          <span className="text-[11px] bg-brew-light text-brew-dark px-2.5 py-1 rounded-full font-extrabold border border-brew/30 shadow-xs">
            ● Dine-In Aktif
          </span>
        </div>

        {/* Customer Information Form */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-espresso-100 shadow-subtle space-y-3">
          <h2 className="font-bold text-sm text-espresso-900 font-display flex items-center gap-2">
            <User className="w-4 h-4 text-crema" />
            <span>Informasi Pemesan (Opsional)</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-espresso-700 mb-1">
                Nama Panggilan
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-espresso-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Contoh: Rian"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-espresso-200 focus:outline-none focus:border-crema bg-oat-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-espresso-700 mb-1">
                No. WhatsApp
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-espresso-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Contoh: 08123456789"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-espresso-200 focus:outline-none focus:border-crema bg-oat-50"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-espresso-700 mb-1">
              Catatan Khusus Meja
            </label>
            <input
              type="text"
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
              placeholder="Contoh: Tolong siapkan sedotan kertas ekstra & tisu"
              className="w-full px-3 py-2 text-xs rounded-xl border border-espresso-200 focus:outline-none focus:border-crema bg-oat-50"
            />
          </div>
        </div>

        {/* Order Items Review */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-espresso-100 shadow-subtle space-y-3">
          <h2 className="font-bold text-sm text-espresso-900 font-display">
            Ringkasan Item ({cart.length})
          </h2>

          <div className="divide-y divide-espresso-100">
            {cart.map((item) => (
              <div key={`${item.menu.id}-${item.notes}`} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-md bg-espresso-100 text-espresso-800 font-bold flex items-center justify-center text-[11px]">
                    {item.quantity}x
                  </span>
                  <div>
                    <p className="font-semibold text-espresso-900">{item.menu.name}</p>
                    {item.notes && (
                      <p className="text-[10px] text-espresso-500 italic">{item.notes}</p>
                    )}
                  </div>
                </div>
                <span className="font-bold text-espresso-900 font-display">
                  {formatRupiah(item.menu.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-espresso-100 space-y-1.5 text-xs">
            <div className="flex justify-between text-espresso-500">
              <span>Subtotal</span>
              <span>{formatRupiah(cartSubtotal)}</span>
            </div>
            <div className="flex justify-between text-espresso-500">
              <span>Pajak Restoran (PB1 10%)</span>
              <span>{formatRupiah(cartTax)}</span>
            </div>
            <div className="flex justify-between text-espresso-500">
              <span>Biaya Layanan (5%)</span>
              <span>{formatRupiah(cartService)}</span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-espresso-950 pt-2 border-t border-espresso-100">
              <span>Total Pembayaran</span>
              <span className="text-crema-600 font-display text-base">
                {formatRupiah(cartTotal)}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Method Selector */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-espresso-100 shadow-subtle space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-sm text-espresso-900 font-display flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-crema" />
              <span>Metode Pembayaran</span>
            </h2>
            <span className="text-[11px] text-brew font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Terenkripsi & Aman
            </span>
          </div>

          <div className="space-y-2">
            {PAYMENT_METHODS.map((pm) => {
              const isSelected = selectedMethod === pm.id;
              return (
                <div
                  key={pm.id}
                  onClick={() => setSelectedMethod(pm.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'border-crema bg-crema-50/50 shadow-sm ring-1 ring-crema'
                      : 'border-espresso-200 hover:border-espresso-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected
                          ? 'border-crema bg-crema text-white'
                          : 'border-espresso-300 bg-white'
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-espresso-950" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-espresso-900">{pm.name}</span>
                        {pm.badge && (
                          <span className="text-[10px] bg-espresso-100 text-espresso-800 px-1.5 py-0.2 rounded font-bold">
                            {pm.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-espresso-500">{pm.description}</p>
                    </div>
                  </div>

                  <div className="text-espresso-400">
                    {pm.category === 'qris' && <QrCode className="w-5 h-5 text-espresso-700" />}
                    {pm.category === 'ewallet' && <Wallet className="w-5 h-5 text-espresso-700" />}
                    {pm.category === 'va' && <Building2 className="w-5 h-5 text-espresso-700" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Floating Bottom Action */}
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-espresso-950/95 backdrop-blur-md p-4 border-t border-espresso-800">
          <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
            <div>
              <span className="text-[11px] text-espresso-400 block font-medium">Total Akhir</span>
              <span className="text-base font-extrabold text-white font-display">
                {formatRupiah(cartTotal)}
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 max-w-xs py-3.5 px-5 rounded-2xl bg-white hover:bg-espresso-100 text-espresso-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Membuat Pesanan...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-brew" />
                  <span>Bayar Sekarang</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
