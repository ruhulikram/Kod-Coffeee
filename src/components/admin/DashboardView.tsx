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
  Sparkles,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatRupiah, formatRelativeTime, getOrderStatusInfo } from '../../utils/formatters';
import { AdminTab } from '../../types';

interface DashboardViewProps {
  onNavigateTab: (tab: AdminTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigateTab }) => {
  const { orders, tables } = useStore();

  const totalSales = orders
    .filter((o) => o.order_status !== 'cancelled' && o.order_status !== 'pending_payment')
    .reduce((acc, o) => acc + o.total, 0);

  const preparingCount = orders.filter((o) => ['paid', 'confirmed', 'preparing'].includes(o.order_status)).length;
  const readyCount = orders.filter((o) => o.order_status === 'ready').length;
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
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-espresso-950 font-display tracking-tight">
              Ringkasan Operasional Hari Ini
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brew-light text-brew text-[10px] font-black border border-brew/20">
              <Sparkles className="w-3 h-3" />
              <span>Live Monitor</span>
            </span>
          </div>
          <p className="text-xs text-espresso-500 mt-1">
            Pantau arus kas, antrian pesanan meja, dan performa menu secara real-time.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => onNavigateTab('pos')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-espresso-950 text-xs font-black shadow-md transition-all active:scale-95 border border-amber-300"
          >
            <ShoppingBag className="w-4 h-4 text-espresso-950" />
            <span>Buka Kasir POS</span>
          </button>

          <button
            onClick={() => onNavigateTab('orders')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-espresso-950 hover:bg-espresso-900 text-white text-xs font-black shadow-md transition-all active:scale-95 border border-espresso-800"
          >
            <Coffee className="w-4 h-4 text-amber-400" />
            <span>Kitchen Orders ({preparingCount})</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-espresso-200 shadow-subtle hover:shadow-elevated hover:border-amber-400/60 transition-all flex flex-col justify-between group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-espresso-400 uppercase tracking-wider">
              Total Penjualan
            </span>
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 text-amber-600 flex items-center justify-center font-bold shadow-2xs">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-black text-espresso-950 font-display">
              {formatRupiah(totalSales)}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-brew font-bold mt-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Realtime dari {orders.length} transaksi</span>
            </div>
          </div>
        </div>

        {/* Sedang Diseduh */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-espresso-200 shadow-subtle hover:shadow-elevated hover:border-amber-400/60 transition-all flex flex-col justify-between group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-espresso-400 uppercase tracking-wider">
              Antrian Dapur & Seduh
            </span>
            <div className="w-10 h-10 rounded-2xl bg-espresso-950 text-amber-300 flex items-center justify-center font-bold shadow-2xs">
              <Coffee className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-black text-espresso-950 font-display">
              {preparingCount} <span className="text-sm font-semibold text-espresso-400">Order</span>
            </span>
            <p className="text-xs text-espresso-500 mt-1.5 font-medium">Perlu perhatian barista & kitchen</p>
          </div>
        </div>

        {/* Siap Saji */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-espresso-200 shadow-subtle hover:shadow-elevated hover:border-amber-400/60 transition-all flex flex-col justify-between group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-espresso-400 uppercase tracking-wider">
              Siap Diantar ke Meja
            </span>
            <div className="w-10 h-10 rounded-2xl bg-brew-light text-brew flex items-center justify-center font-bold shadow-2xs border border-brew/20">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-black text-espresso-950 font-display">
              {readyCount} <span className="text-sm font-semibold text-espresso-400">Order</span>
            </span>
            <p className="text-xs text-brew font-bold mt-1.5">Siap disajikan ke pelanggan</p>
          </div>
        </div>

        {/* Okupansi Meja */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-espresso-200 shadow-subtle hover:shadow-elevated hover:border-amber-400/60 transition-all flex flex-col justify-between group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-espresso-400 uppercase tracking-wider">
              Okupansi Meja
            </span>
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold shadow-2xs border border-indigo-100">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-black text-espresso-950 font-display">
              {occupiedTables} / {tables.length}{' '}
              <span className="text-sm font-semibold text-espresso-400">Meja</span>
            </span>
            <p className="text-xs text-espresso-500 mt-1.5 font-medium">Dine-in saat ini aktif</p>
          </div>
        </div>
      </div>

      {/* Two Column Section: Live Stream & Best Sellers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders List (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-5 sm:p-6 border border-espresso-200 shadow-subtle space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-espresso-100">
            <div>
              <h2 className="font-black text-base sm:text-lg text-espresso-950 font-display leading-tight">
                Aliran Pesanan Terbaru
              </h2>
              <p className="text-xs text-espresso-400 mt-0.5">Status pesanan masuk langsung dari meja</p>
            </div>
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs font-black text-amber-600 hover:text-amber-700 flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200/60 transition-colors"
            >
              <span>Lihat Semua</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-espresso-100 text-espresso-400 uppercase tracking-wider font-bold text-[10px]">
                  <th className="pb-3 font-bold">No. Order</th>
                  <th className="pb-3 font-bold">Meja</th>
                  <th className="pb-3 font-bold">Item Pesanan</th>
                  <th className="pb-3 font-bold">Total</th>
                  <th className="pb-3 font-bold">Status</th>
                  <th className="pb-3 text-right font-bold">Waktu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-espresso-100">
                {orders.slice(0, 5).map((order) => {
                  const statusInfo = getOrderStatusInfo(order.order_status);
                  return (
                    <tr key={order.id} className="hover:bg-oat-50 transition-colors">
                      <td className="py-3.5 font-bold text-espresso-900 font-mono text-xs">
                        {order.order_number}
                      </td>
                      <td className="py-3.5">
                        <span className="font-bold px-2 py-0.5 rounded-lg bg-espresso-100 text-espresso-900 text-xs">
                          {order.table?.table_number || 'Meja ?'}
                        </span>
                      </td>
                      <td className="py-3.5 text-espresso-700 max-w-[200px] truncate font-medium">
                        {order.items.map((i) => `${i.quantity}x ${i.menu_name}`).join(', ')}
                      </td>
                      <td className="py-3.5 font-black text-espresso-950 font-display">
                        {formatRupiah(order.total)}
                      </td>
                      <td className="py-3.5">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black border ${statusInfo.color}`}
                        >
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="py-3.5 text-right text-espresso-400 font-medium">
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
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-espresso-200 shadow-subtle space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-espresso-100">
              <div className="w-8 h-8 rounded-xl bg-amber-400 text-espresso-950 flex items-center justify-center font-bold">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-black text-base text-espresso-950 font-display">
                  Menu Terlaris
                </h2>
                <p className="text-xs text-espresso-400">Berdasarkan volume penjualan</p>
              </div>
            </div>

            <div className="space-y-2.5">
              {bestSellers.map((item, idx) => (
                <div
                  key={item.name}
                  className="p-3 rounded-2xl bg-oat-50/80 border border-espresso-100 flex items-center justify-between gap-3 hover:border-espresso-300 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 shadow-2xs ${
                        idx === 0
                          ? 'bg-amber-400 text-espresso-950'
                          : idx === 1
                          ? 'bg-espresso-900 text-white'
                          : 'bg-espresso-100 text-espresso-800'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <h4 className="font-black text-xs text-espresso-950 line-clamp-1 font-display">{item.name}</h4>
                      <p className="text-[11px] text-espresso-500 font-semibold font-display">
                        {formatRupiah(item.revenue)}
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-black text-espresso-950 bg-white px-2.5 py-1 rounded-xl border border-espresso-200 shadow-2xs shrink-0">
                    {item.count} Porsi
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('menus')}
            className="w-full mt-4 py-3 rounded-2xl border border-espresso-200 text-espresso-800 hover:bg-espresso-50 font-bold text-xs transition-colors shadow-2xs active:scale-95"
          >
            Kelola Stok & Katalog Menu
          </button>
        </div>
      </div>
    </div>
  );
};
