import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import {
  X,
  CheckCircle2,
  Clock,
  QrCode,
  ShieldCheck,
  Smartphone,
  Copy,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { Order, PaymentMethod } from '../../types';
import { formatRupiah } from '../../utils/formatters';
import { useStore } from '../../context/StoreContext';

interface PaymentModalProps {
  order: Order | null;
  paymentMethod: PaymentMethod;
  onSuccess: (orderNumber: string) => void;
  onClose: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  order,
  paymentMethod,
  onSuccess,
  onClose,
}) => {
  const { processPayment } = useStore();
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 mins
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedVA, setCopiedVA] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!order) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const vaNumber = `88019${order.order_number.replace('ORD-', '')}${Math.floor(1000 + Math.random() * 9000)}`;

  const handleSimulateSuccess = async () => {
    setIsProcessing(true);
    const success = await processPayment(order.id, paymentMethod);
    if (success) {
      // Trigger festive celebratory confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#C88A36', '#FAF7F2', '#2D7A58', '#E5A952'],
      });

      setTimeout(() => {
        setIsProcessing(false);
        onSuccess(order.order_number);
      }, 700);
    } else {
      setIsProcessing(false);
    }
  };

  const handleCopyVA = () => {
    navigator.clipboard.writeText(vaNumber);
    setCopiedVA(true);
    setTimeout(() => setCopiedVA(false), 2000);
  };

  const qrPayload = `00020101021226590014ID.LINKAJA.WWW0118936009180000000000520458125303360540${order.total}5802ID5910KOD COFFEE6007JAKARTA62070703A016304${order.order_number}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso-950/80 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-floating overflow-hidden flex flex-col animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-espresso-950 text-white p-4 sm:p-5 flex items-center justify-between border-b border-espresso-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-crema animate-pulse" />
              <h2 className="font-bold text-sm sm:text-base font-display">Gateway Pembayaran</h2>
            </div>
            <p className="text-xs text-espresso-400 mt-0.5">
              Order {order.order_number} • {order.table?.table_number || 'Dine-in'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-espresso-800 text-espresso-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto max-h-[75vh] space-y-5 text-center">
          {/* Total & Countdown */}
          <div className="bg-oat-50 p-4 rounded-2xl border border-espresso-100">
            <span className="text-xs font-semibold text-espresso-500 block">Total Tagihan</span>
            <span className="text-2xl font-extrabold text-espresso-950 font-display block mt-0.5">
              {formatRupiah(order.total)}
            </span>
            <div className="flex items-center justify-center gap-1.5 text-xs text-ember font-bold mt-2 bg-ember-light py-1 px-3 rounded-full w-fit mx-auto border border-ember/20">
              <Clock className="w-3.5 h-3.5" />
              <span>Selesaikan dalam: {timeFormatted}</span>
            </div>
          </div>

          {/* Payment Method Content */}
          {paymentMethod === 'qris' && (
            <div className="space-y-3">
              <div className="p-4 bg-white rounded-2xl border-2 border-dashed border-espresso-200 inline-block shadow-subtle">
                <div className="flex items-center justify-between gap-4 mb-2 pb-2 border-b border-espresso-100">
                  <span className="text-[11px] font-extrabold tracking-widest text-espresso-900 uppercase">
                    QRIS
                  </span>
                  <span className="text-[10px] text-espresso-400 font-medium">NMID: ID1020304050</span>
                </div>
                <QRCodeSVG
                  value={qrPayload}
                  size={190}
                  level="M"
                  includeMargin={true}
                  className="mx-auto rounded-lg"
                />
                <p className="text-[11px] text-espresso-500 mt-2 font-medium">
                  Scan dengan GoPay, OVO, BCA, Livin, Dana, ShopeePay
                </p>
              </div>

              <div className="text-left text-xs text-espresso-600 bg-oat-100 p-3 rounded-xl space-y-1">
                <p className="font-bold text-espresso-900">Cara Pembayaran:</p>
                <ol className="list-decimal list-inside space-y-0.5 text-[11px]">
                  <li>Buka aplikasi m-Banking atau E-Wallet apa saja.</li>
                  <li>Pilih menu <b>Scan / QRIS</b> lalu arahkan kamera ke QR di atas.</li>
                  <li>Pastikan nama merchant adalah <b>KOD COFFEE</b> dan nominal sesuai.</li>
                </ol>
              </div>
            </div>
          )}

          {(paymentMethod === 'gopay' || paymentMethod === 'ovo' || paymentMethod === 'shopeepay') && (
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-espresso-900 text-crema flex items-center justify-center mx-auto shadow-md">
                <Smartphone className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-espresso-900 uppercase tracking-wide">
                  Pembayaran via {paymentMethod.toUpperCase()}
                </h3>
                <p className="text-xs text-espresso-500 mt-1 max-w-xs mx-auto">
                  Sistem telah mengirimkan instruksi pembayaran ke akun digital Anda.
                </p>
              </div>
            </div>
          )}

          {(paymentMethod === 'bca_va' || paymentMethod === 'mandiri_va') && (
            <div className="space-y-4 text-left">
              <div className="bg-oat-50 p-4 rounded-2xl border border-espresso-100">
                <span className="text-xs text-espresso-500 font-medium block">
                  Nomor {paymentMethod === 'bca_va' ? 'BCA Virtual Account' : 'Mandiri Virtual Account'}
                </span>
                <div className="flex items-center justify-between gap-2 mt-1">
                  <span className="text-base font-extrabold text-espresso-950 font-mono tracking-wider">
                    {vaNumber}
                  </span>
                  <button
                    onClick={handleCopyVA}
                    className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-espresso-900 text-crema hover:bg-espresso-800 transition-colors"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedVA ? 'Tersalin!' : 'Salin'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Instant Simulation Action (For testing / demonstration) */}
          <div className="pt-2 border-t border-espresso-100 space-y-2">
            <button
              onClick={handleSimulateSuccess}
              disabled={isProcessing}
              className="w-full py-3.5 px-4 rounded-2xl bg-brew hover:bg-brew-dark text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
            >
              {isProcessing ? (
                <span>Mengonfirmasi Pembayaran...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simulasikan Pembayaran Berhasil</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="text-xs text-espresso-500 hover:text-espresso-800 font-medium py-1"
            >
              Tutup & Bayar Nanti
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
