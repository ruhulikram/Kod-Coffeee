import React from 'react';
import {
  DollarSign,
  ShoppingBag,
  Clock,
  CheckCircle2,
  TrendingUp,
  Flame,
  Coffee,
  ArrowUpRight,
  Eye,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatRupiah, formatRelativeTime, getOrderStatusInfo } from '../../utils/formatters';
import { AdminTab } from '../../types';

interface DashboardViewProps {
  onNavigateTab: (tab: AdminTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigateTab }) => {
  const { orders, menus, tables } = useStore();

  const totalSales = orders
    .filter((o) => o.order_status !== 'cancelled' && o.order_status !== 'pending_payment')
    .reduce((acc, o) => acc + o.total, 0);

  const pendingCount = orders.filter((o) => o.order_status === 'pending_payment').length;
  const preparingCount = orders.filter((o) => ['paid', 'confirmed', 'preparing'].includes(o.order_status)).length;
  const readyCount = orders.filter((o) => o.order_status === 'ready').length;
  const completedCount = orders.filter((o) => o.order_status === 'completed').length;

  const occupiedTables = tables.filter((t) => t.status === 'occupied').length;

  // Calculate best seller count
  const menuSalesMap: Record<string, { name: string; count: number; revenue: number; image?: string }> = {};
  orders.forEach((o) => {
    if (o.order_status !== 'cancelled') {
      o.items.forEach((item) => {
        if (!menuSalesMap[item.menu_name]) {
          menuSalesMap[item.menu_name] = { name: item.menu_name, count: 0, revenue: 0, image: item.image };
        }
        menuSalesMap[item.menu_name].count += item.quantity;
        menuSalesMap[item.menu_name].revenue += item.subtotal;
      });
    }
  });

  const bestSellers = Object.values(menuSalesMap).sort((a, b) => b.count - a.count).slice(0, 4);

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-espresso-950 font-display">
            Ringkasan Operasional Hari Ini
          </h1>
          <p className="text-xs text-espresso-500 mt-0.5">
            Pantau arus kas, antrian pesanan meja, dan performa menu secara live.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('pos')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-crema-500 hover:bg-crema-600 text-white text-xs font-extrabold shadow-sm transition-all active:scale-95 border border-crema-600"
          >
            <ShoppingBag className="w-4 h-4 text-white" />
            <span>Buka Kasir POS</span>
          </button>

          <button
            onClick={() => onNavigateTab('orders')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-espresso-950 hover:bg-espresso-900 text-white text-xs font-extrabold shadow-sm transition-all active:scale-95"
          >
            <Coffee className="w-4 h-4 text-crema" />
            <span>Kitchen Orders ({preparingCount})</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales */}
        <div className="bg-white p-5 rounded-3xl border border-espresso-100 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-espresso-500 uppercase tracking-wider">
              Total Penjualan
            </span>
            <div className="w-8 h-8 rounded-xl bg-crema-100 text-crema-800 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-espresso-950 font-display">
              {formatRupiah(totalSales)}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-brew font-semibold mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Realtime dari {orders.length} transaksi</span>
            </div>
          </div>
        </div>

        {/* Sedang Diseduh */}
        <div className="bg-white p-5 rounded-3xl border border-espresso-100 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-espresso-500 uppercase tracking-wider">
              Antrian Dapur & Seduh
            </span>
            <div className="w-8 h-8 rounded-xl bg-crema-500/20 text-crema-600 flex items-center justify-center">
              <Coffee className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-espresso-950 font-display">
              {preparingCount} <span className="text-sm font-medium text-espresso-400">Order</span>
            </span>
            <p className="text-[11px] text-espresso-500 mt-1">Perlu perhatian barista & kitchen</p>
          </div>
        </div>

        {/* Siap Saji */}
        <div className="bg-white p-5 rounded-3xl border border-espresso-100 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-espresso-500 uppercase tracking-wider">
              Siap Diantar ke Meja
            </span>
            <div className="w-8 h-8 rounded-xl bg-brew-light text-brew flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-espresso-950 font-display">
              {readyCount} <span className="text-sm font-medium text-espresso-400">Order</span>
            </span>
            <p className="text-[11px] text-brew font-semibold mt-1">Siap disajikan ke meja</p>
          </div>
        </div>

        {/* Okupansi Meja */}
        <div className="bg-white p-5 rounded-3xl border border-espresso-100 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-espresso-500 uppercase tracking-wider">
              Okupansi Meja
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-espresso-950 font-display">
              {occupiedTables} / {tables.length}{' '}
              <span className="text-sm font-medium text-espresso-400">Meja</span>
            </span>
            <p className="text-[11px] text-espresso-500 mt-1">Dine-in saat ini aktif</p>
          </div>
        </div>
      </div>

      {/* Two Column Section: Live Stream & Best Sellers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders List (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-5 sm:p-6 border border-espresso-100 shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-base text-espresso-950 font-display">
                Aliran Pesanan Terbaru
              </h2>
              <p className="text-xs text-espresso-400">Status pesanan masuk langsung dari meja</p>
            </div>
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs font-bold text-crema-600 hover:text-crema-700 flex items-center gap-1"
            >
              <span>Lihat Semua</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-espresso-100 text-espresso-400 uppercase tracking-wider font-semibold">
                  <th className="pb-2.5">Order</th>
                  <th className="pb-2.5">Meja</th>
                  <th className="pb-2.5">Item</th>
                  <th className="pb-2.5">Total</th>
                  <th className="pb-2.5">Status</th>
                  <th className="pb-2.5 text-right">Waktu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-espresso-50">
                {orders.slice(0, 5).map((order) => {
                  const statusInfo = getOrderStatusInfo(order.order_status);
                  return (
                    <tr key={order.id} className="hover:bg-oat-50/60 transition-colors">
                      <td className="py-3 font-bold text-espresso-900 font-mono">
                        {order.order_number}
                      </td>
                      <td className="py-3 font-semibold text-espresso-800">
                        {order.table?.table_number || 'Meja ?'}
                      </td>
                      <td className="py-3 text-espresso-600 max-w-[160px] truncate">
                        {order.items.map((i) => `${i.quantity}x ${i.menu_name}`).join(', ')}
                      </td>
                      <td className="py-3 font-bold text-espresso-900 font-display">
                        {formatRupiah(order.total)}
                      </td>
                      <td className="py-3">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusInfo.color}`}
                        >
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="py-3 text-right text-espresso-400">
                        {formatRelativeTime(order.created_at)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Best Sellers Leaderboard (1 col) */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-espresso-100 shadow-subtle space-y-4">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-crema" />
            <div>
              <h2 className="font-bold text-base text-espresso-950 font-display">
                Menu Terlaris
              </h2>
              <p className="text-xs text-espresso-400">Berdasarkan volume penjualan</p>
            </div>
          </div>

          <div className="space-y-3">
            {bestSellers.map((item, idx) => (
              <div
                key={item.name}
                className="p-3 rounded-2xl bg-oat-50 border border-espresso-100 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                      idx === 0
                        ? 'bg-crema text-espresso-950'
                        : idx === 1
                        ? 'bg-espresso-200 text-espresso-800'
                        : 'bg-oat-200 text-espresso-700'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="font-bold text-xs text-espresso-900 line-clamp-1">{item.name}</h4>
                    <p className="text-[11px] text-espresso-500 font-display">
                      {formatRupiah(item.revenue)}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-extrabold text-espresso-950 bg-white px-2 py-1 rounded-lg border border-espresso-200">
                  {item.count} Terjual
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigateTab('menus')}
            className="w-full py-2.5 rounded-xl border border-espresso-200 text-espresso-700 hover:bg-espresso-50 font-bold text-xs transition-colors"
          >
            Kelola Stok & Katalog Menu
          </button>
        </div>
      </div>
    </div>
  );
};
