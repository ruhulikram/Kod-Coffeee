import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Coffee,
  Sparkles,
  ArrowLeft,
  Receipt,
  RotateCcw,
  Check,
  Flame,
  BellRing,
  Volume2,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatRupiah, formatRelativeTime, getOrderStatusInfo } from '../../utils/formatters';

interface OrderStatusViewProps {
  orderNumber: string;
  onBackToMenu: () => void;
}

const STEPS = [
  { key: 'paid', label: 'Pembayaran Diterima', desc: 'Transaksi lunas dan masuk antrian barista' },
  { key: 'confirmed', label: 'Dikonfirmasi Barista', desc: 'Tiket pesanan telah dicetak & diterima kitchen' },
  { key: 'preparing', label: 'Sedang Diseduh & Dimasak', desc: 'Barista sedang meracik kopi & chef menyiapkan pesanan' },
  { key: 'ready', label: 'Siap Diantar ke Meja', desc: 'Pesanan selesai diseduh dan segera disajikan' },
  { key: 'completed', label: 'Pesanan Selesai', desc: 'Selamat menikmati sajian Kod Coffee!' },
];

export const OrderStatusView: React.FC<OrderStatusViewProps> = ({
  orderNumber,
  onBackToMenu,
}) => {
  const { getOrderByNumber, playChime } = useStore();
  const order = getOrderByNumber(orderNumber);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Play subtle chime when customer opens or views ready state
    if (order?.order_status === 'ready') {
      playChime();
    }
  }, [order?.order_status]);

  if (!order) {
    return (
      <div className="max-w-md mx-auto p-6 text-center animate-fade-in">
        <h2 className="text-lg font-bold text-espresso-900 mb-2">Pesanan Tidak Ditemukan</h2>
        <p className="text-xs text-espresso-500 mb-4">
          Nomor order {orderNumber} tidak terdaftar di sistem.
        </p>
        <button
          onClick={onBackToMenu}
          className="px-4 py-2 bg-espresso-900 text-white rounded-xl text-xs font-bold"
        >
          Kembali ke Menu
        </button>
      </div>
    );
  }

  const currentStatusInfo = getOrderStatusInfo(order.order_status);
  const currentStepIndex = STEPS.findIndex((s) => s.key === order.order_status);

  const handleCopyOrderNo = () => {
    navigator.clipboard.writeText(order.order_number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-5 pb-24 space-y-4 animate-fade-in">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToMenu}
          className="flex items-center gap-1.5 text-xs font-semibold text-espresso-700 hover:text-espresso-950 bg-white border border-espresso-200 px-3 py-1.5 rounded-full shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Menu</span>
        </button>

        <span className="text-[11px] text-espresso-400 font-medium">
          Dibuat: {formatRelativeTime(order.created_at)}
        </span>
      </div>

      {/* Main Status Hero Card */}
      <div className="bg-espresso-950 text-white rounded-3xl p-6 shadow-elevated border border-espresso-800 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-crema-500/20 text-crema border border-crema-500/30">
              {order.table?.table_number || 'Meja Dine-in'}
            </span>

            <button
              onClick={handleCopyOrderNo}
              className="text-xs text-espresso-300 hover:text-white flex items-center gap-1 bg-espresso-800/80 px-2 py-0.5 rounded-md border border-espresso-700 font-mono"
            >
              <span>{order.order_number}</span>
              {copied ? <Check className="w-3 h-3 text-brew" /> : null}
            </button>
          </div>

          <div className="flex items-center gap-3 my-2">
            {order.order_status === 'ready' ? (
              <div className="w-12 h-12 rounded-2xl bg-brew text-white flex items-center justify-center animate-bounce shadow-lg">
                <BellRing className="w-6 h-6" />
              </div>
            ) : order.order_status === 'preparing' ? (
              <div className="w-12 h-12 rounded-2xl bg-crema text-espresso-950 flex items-center justify-center animate-pulse shadow-lg">
                <Coffee className="w-6 h-6" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-espresso-800 text-crema flex items-center justify-center shadow-lg">
                <Clock className="w-6 h-6" />
              </div>
            )}

            <div>
              <span className="text-xs text-espresso-400 font-medium block">Status Pesanan</span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white font-display">
                {currentStatusInfo.label}
              </h1>
            </div>
          </div>

          {order.order_status === 'ready' && (
            <div className="mt-3 p-3 rounded-2xl bg-brew/20 border border-brew/40 text-brew-light text-xs flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-crema flex-shrink-0" />
              <span className="font-semibold">
                Pesanan Anda telah selesai diracik dan sedang diantarkan ke {order.table?.table_number}!
              </span>
            </div>
          )}

          {order.order_status === 'preparing' && (
            <p className="text-xs text-espresso-300 mt-2 leading-relaxed">
              Barista kami sedang melakukan ekstraksi kopi dan menyiapkan hidangan dengan seksama. Mohon tunggu sejenak di meja.
            </p>
          )}
        </div>
      </div>

      {/* Barista Step Timeline */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-espresso-100 shadow-subtle space-y-4">
        <h2 className="font-bold text-sm text-espresso-900 font-display flex items-center gap-2">
          <Flame className="w-4 h-4 text-crema" />
          <span>Progres Ekstraksi & Dapur</span>
        </h2>

        <div className="space-y-4 relative pl-3 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-espresso-100">
          {STEPS.map((step, idx) => {
            const isCompleted = currentStepIndex > idx || order.order_status === 'completed';
            const isCurrent = currentStepIndex === idx;

            return (
              <div key={step.key} className="relative flex items-start gap-3.5">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center z-10 text-xs font-bold transition-all duration-300 ${
                    isCompleted
                      ? 'bg-brew text-white shadow-sm ring-4 ring-brew/10'
                      : isCurrent
                      ? 'bg-espresso-900 text-crema ring-4 ring-crema/20 animate-pulse'
                      : 'bg-espresso-100 text-espresso-400'
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                </div>

                <div className="flex-1 -mt-0.5">
                  <h3
                    className={`text-xs font-bold leading-tight ${
                      isCurrent
                        ? 'text-espresso-950'
                        : isCompleted
                        ? 'text-espresso-800'
                        : 'text-espresso-400'
                    }`}
                  >
                    {step.label}
                  </h3>
                  <p className="text-[11px] text-espresso-500 mt-0.5 leading-snug">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Order Receipt */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-espresso-100 shadow-subtle space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-espresso-100">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-crema" />
            <h2 className="font-bold text-sm text-espresso-900 font-display">Struk Rincian Pesanan</h2>
          </div>
          <span className="text-xs font-bold text-brew bg-brew/10 px-2.5 py-0.5 rounded-full">
            Lunas (QRIS/E-Wallet)
          </span>
        </div>

        {/* Item List */}
        <div className="divide-y divide-espresso-100">
          {order.items.map((item) => (
            <div key={item.id} className="py-2.5 flex items-start justify-between gap-3 text-xs">
              <div>
                <p className="font-bold text-espresso-900">
                  {item.quantity}x {item.menu_name}
                </p>
                {item.notes && (
                  <p className="text-[10px] text-espresso-500 italic mt-0.5">
                    Catatan: {item.notes}
                  </p>
                )}
              </div>
              <span className="font-bold text-espresso-900 font-display">
                {formatRupiah(item.subtotal)}
              </span>
            </div>
          ))}
        </div>

        {/* Charges Breakdown */}
        <div className="pt-3 border-t border-espresso-100 space-y-1 text-xs">
          <div className="flex justify-between text-espresso-500">
            <span>Subtotal</span>
            <span>{formatRupiah(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-espresso-500">
            <span>Pajak Restoran (PB1 10%)</span>
            <span>{formatRupiah(order.tax)}</span>
          </div>
          <div className="flex justify-between text-espresso-500">
            <span>Biaya Layanan (5%)</span>
            <span>{formatRupiah(order.service_charge)}</span>
          </div>
          <div className="flex justify-between text-sm font-extrabold text-espresso-950 pt-2 border-t border-espresso-100">
            <span>Total Bayar</span>
            <span className="text-crema-600 font-display text-base">
              {formatRupiah(order.total)}
            </span>
          </div>
        </div>

        {order.notes && (
          <div className="p-3 rounded-xl bg-oat-50 border border-espresso-100 text-xs">
            <span className="font-bold text-espresso-800 block mb-0.5">Catatan Pesanan Meja:</span>
            <p className="text-espresso-600 italic">{order.notes}</p>
          </div>
        )}
      </div>

      {/* Action to Order More */}
      <div className="pt-2">
        <button
          onClick={onBackToMenu}
          className="w-full py-3.5 rounded-2xl bg-espresso-900 hover:bg-espresso-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Pesan Menu Tambahan dari Meja</span>
        </button>
      </div>
    </div>
  );
};
