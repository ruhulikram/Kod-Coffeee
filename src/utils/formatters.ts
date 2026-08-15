import { OrderStatus, PaymentStatus } from '../types';

export const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace('IDR', 'Rp');
};

export const formatRelativeTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffSec < 60) return 'Baru saja';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} mnt lalu`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} jam lalu`;
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
};

export const formatDateTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getOrderStatusInfo = (status: OrderStatus) => {
  switch (status) {
    case 'pending_payment':
      return {
        label: 'Menunggu Pembayaran',
        color: 'bg-amber-50 text-amber-700 border-amber-200',
        badgeClass: 'bg-amber-500',
        step: 0,
      };
    case 'paid':
      return {
        label: 'Terbayar / Menunggu Konfirmasi',
        color: 'bg-blue-50 text-blue-700 border-blue-200',
        badgeClass: 'bg-blue-500',
        step: 1,
      };
    case 'confirmed':
      return {
        label: 'Pesanan Dikonfirmasi',
        color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        badgeClass: 'bg-indigo-500',
        step: 2,
      };
    case 'preparing':
      return {
        label: 'Sedang Diseduh / Dimasak',
        color: 'bg-crema-50 text-crema-700 border-crema-200',
        badgeClass: 'bg-crema-500',
        step: 3,
      };
    case 'ready':
      return {
        label: 'Siap Diantar ke Meja',
        color: 'bg-brew-light text-brew-dark border-brew/20',
        badgeClass: 'bg-brew',
        step: 4,
      };
    case 'completed':
      return {
        label: 'Pesanan Selesai',
        color: 'bg-espresso-100 text-espresso-800 border-espresso-200',
        badgeClass: 'bg-espresso-600',
        step: 5,
      };
    case 'cancelled':
      return {
        label: 'Dibatalkan',
        color: 'bg-ember-light text-ember-dark border-ember/20',
        badgeClass: 'bg-ember',
        step: -1,
      };
    default:
      return {
        label: status,
        color: 'bg-gray-100 text-gray-700 border-gray-200',
        badgeClass: 'bg-gray-400',
        step: 0,
      };
  }
};

export const getPaymentStatusInfo = (status: PaymentStatus) => {
  switch (status) {
    case 'paid':
      return { label: 'Lunas', color: 'text-brew bg-brew/10' };
    case 'pending':
      return { label: 'Pending', color: 'text-amber-600 bg-amber-50' };
    case 'failed':
      return { label: 'Gagal', color: 'text-ember bg-ember/10' };
    case 'expired':
      return { label: 'Kedaluwarsa', color: 'text-gray-500 bg-gray-100' };
    default:
      return { label: status, color: 'text-gray-600 bg-gray-100' };
  }
};
