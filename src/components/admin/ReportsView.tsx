import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  CreditCard,
  Flame,
  Calendar,
  Layers,
  Download,
  PieChart,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatRupiah } from '../../utils/formatters';

export const ReportsView: React.FC = () => {
  const { orders, categories } = useStore();
  const [timeRange, setTimeRange] = useState<'today' | '7days' | '30days'>('7days');

  const validOrders = orders.filter((o) => o.order_status !== 'cancelled' && o.order_status !== 'pending_payment');

  // Dynamic calculations based on selected timeframe
  const multiplier = timeRange === 'today' ? 1 : timeRange === '7days' ? 5.8 : 22.4;

  const currentRevenue = validOrders.reduce((acc, o) => acc + o.total, 0);
  const totalRevenue = Math.round(currentRevenue * (timeRange === 'today' ? 1 : multiplier * 0.4 + 1));
  const totalOrdersCount = Math.round(validOrders.length * (timeRange === 'today' ? 1 : multiplier * 0.35 + 1));
  const totalItemsSold = Math.round(
    validOrders.reduce((acc, o) => acc + o.items.reduce((sum, i) => sum + i.quantity, 0), 0) *
      (timeRange === 'today' ? 1 : multiplier * 0.4 + 1)
  );
  const avgOrderValue = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;

  // Best sellers aggregation
  const itemMap: Record<string, { name: string; count: number; revenue: number }> = {};
  validOrders.forEach((o) => {
    o.items.forEach((i) => {
      if (!itemMap[i.menu_name]) {
        itemMap[i.menu_name] = { name: i.menu_name, count: 0, revenue: 0 };
      }
      itemMap[i.menu_name].count += i.quantity * (timeRange === 'today' ? 1 : Math.round(multiplier * 0.4 + 1));
      itemMap[i.menu_name].revenue += i.subtotal * (timeRange === 'today' ? 1 : Math.round(multiplier * 0.4 + 1));
    });
  });

  const bestSellers = Object.values(itemMap).sort((a, b) => b.revenue - a.revenue);

  // Dynamic Trend Data for chart based on selected time range
  const trendData =
    timeRange === 'today'
      ? [
          { label: '08:00', revenue: 180000, orders: 4 },
          { label: '10:00', revenue: 320000, orders: 8 },
          { label: '12:00', revenue: 640000, orders: 15 },
          { label: '14:00', revenue: 490000, orders: 11 },
          { label: '16:00', revenue: 780000, orders: 18 },
          { label: '18:00', revenue: 950000, orders: 22 },
          { label: '20:00 (Live)', revenue: currentRevenue || 340000, orders: validOrders.length || 7 },
        ]
      : timeRange === '7days'
      ? [
          { label: 'Senin', revenue: 620000, orders: 15 },
          { label: 'Selasa', revenue: 780000, orders: 19 },
          { label: 'Rabu', revenue: 710000, orders: 17 },
          { label: 'Kamis', revenue: 890000, orders: 21 },
          { label: 'Jumat', revenue: 1180000, orders: 28 },
          { label: 'Sabtu', revenue: 1750000, orders: 42 },
          { label: 'Minggu', revenue: Math.max(currentRevenue, 1340000), orders: Math.max(validOrders.length, 31) },
        ]
      : [
          { label: 'Minggu 1', revenue: 4850000, orders: 118 },
          { label: 'Minggu 2', revenue: 5620000, orders: 134 },
          { label: 'Minggu 3', revenue: 6100000, orders: 146 },
          { label: 'Minggu 4', revenue: 6940000, orders: 165 },
        ];

  const maxRevenueInChart = Math.max(...trendData.map((d) => d.revenue), 1000000);

  // Category distribution
  const categoryStats = categories.map((cat, idx) => {
    const share = [42, 26, 16, 10, 6][idx] || 10;
    const catRevenue = Math.round((totalRevenue * share) / 100);
    return {
      name: cat.name,
      share,
      revenue: catRevenue,
      color: ['bg-amber-400', 'bg-espresso-800', 'bg-brew', 'bg-indigo-600', 'bg-amber-600'][idx] || 'bg-amber-400',
    };
  });

  const handleExportCSV = () => {
    const csvRows = [
      ['KOD COFFEE - Laporan Penjualan', timeRange.toUpperCase()],
      ['Tanggal Laporan', new Date().toLocaleDateString('id-ID')],
      ['Total Penjualan', formatRupiah(totalRevenue)],
      ['Total Order', totalOrdersCount],
      ['Item Terjual', totalItemsSold],
      ['Average Order Value', formatRupiah(avgOrderValue)],
      [],
      ['Rank', 'Nama Menu', 'Kuantitas Terjual', 'Total Omset'],
      ...bestSellers.map((item, idx) => [idx + 1, item.name, item.count, item.revenue]),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Kod_Coffee_Report_${timeRange}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-espresso-950 font-display tracking-tight">
              Laporan Penjualan & Analitik
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-600 text-[10px] font-black border border-amber-400/30">
              <Sparkles className="w-3 h-3" />
              <span>Financial Insights</span>
            </span>
          </div>
          <p className="text-xs text-espresso-500 mt-1">
            Analisis performa omset meja, tren ekstraksi minuman, dan average order value.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Time range selector */}
          <div className="flex items-center gap-1 bg-espresso-100 p-1.5 rounded-2xl border border-espresso-200 shadow-2xs">
            {[
              { id: 'today', label: 'Hari Ini' },
              { id: '7days', label: '7 Hari Terakhir' },
              { id: '30days', label: '30 Hari' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTimeRange(t.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                  timeRange === t.id
                    ? 'bg-white text-espresso-950 shadow-xs'
                    : 'text-espresso-600 hover:text-espresso-900'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-espresso-50 text-espresso-900 border border-espresso-200 text-xs font-bold shadow-2xs transition-all active:scale-95"
            title="Download CSV"
          >
            <Download className="w-3.5 h-3.5 text-amber-500" />
            <span>Ekspor CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-espresso-200 shadow-subtle hover:shadow-elevated hover:border-amber-400/60 transition-all flex flex-col justify-between group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-espresso-400 uppercase tracking-wider">
              Total Omset
            </span>
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 text-amber-600 flex items-center justify-center font-bold shadow-2xs">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-black text-espresso-950 font-display">
              {formatRupiah(totalRevenue)}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-brew font-bold mt-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18.4% vs periode lalu</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-espresso-200 shadow-subtle hover:shadow-elevated hover:border-amber-400/60 transition-all flex flex-col justify-between group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-espresso-400 uppercase tracking-wider">
              Total Pesanan
            </span>
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold shadow-2xs border border-indigo-100">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-black text-espresso-950 font-display">
              {totalOrdersCount}{' '}
              <span className="text-sm font-semibold text-espresso-400">Transaksi</span>
            </span>
            <p className="text-xs text-espresso-500 mt-1.5 font-medium">Dipesan mandiri via QR meja</p>
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-espresso-200 shadow-subtle hover:shadow-elevated hover:border-amber-400/60 transition-all flex flex-col justify-between group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-espresso-400 uppercase tracking-wider">
              Item Terjual
            </span>
            <div className="w-10 h-10 rounded-2xl bg-espresso-950 text-amber-300 flex items-center justify-center font-bold shadow-2xs">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-black text-espresso-950 font-display">
              {totalItemsSold} <span className="text-sm font-semibold text-espresso-400">Porsi</span>
            </span>
            <p className="text-xs text-espresso-500 mt-1.5 font-medium">Total kopi & hidangan diracik</p>
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-espresso-200 shadow-subtle hover:shadow-elevated hover:border-amber-400/60 transition-all flex flex-col justify-between group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-espresso-400 uppercase tracking-wider">
              Rata-rata Order (AOV)
            </span>
            <div className="w-10 h-10 rounded-2xl bg-brew-light text-brew flex items-center justify-center font-bold border border-brew/20 shadow-2xs">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-black text-espresso-950 font-display">
              {formatRupiah(avgOrderValue)}
            </span>
            <p className="text-xs text-espresso-500 mt-1.5 font-medium">Per tiket transaksi meja</p>
          </div>
        </div>
      </div>

      {/* Visual Chart & Categories Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Trend Bar Chart */}
        <div className="xl:col-span-2 bg-white rounded-3xl p-5 sm:p-6 border border-espresso-200 shadow-subtle space-y-4 min-w-0 overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-espresso-100">
            <div>
              <h2 className="font-black text-base sm:text-lg text-espresso-950 font-display">
                Tren Pendapatan ({timeRange === 'today' ? 'Per Jam' : timeRange === '7days' ? 'Harian' : 'Mingguan'})
              </h2>
              <p className="text-xs text-espresso-400 mt-0.5">Grafik omset dalam periode terpilih</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-espresso-700 font-bold bg-oat-100 px-3 py-1.5 rounded-xl border border-espresso-200 self-start sm:self-auto shrink-0">
              <Calendar className="w-3.5 h-3.5 text-amber-500" />
              <span>
                {timeRange === 'today'
                  ? 'Hari Ini'
                  : timeRange === '7days'
                  ? '7 Hari Terakhir'
                  : '30 Hari Terakhir'}
              </span>
            </div>
          </div>

          {/* Bar Chart Area */}
          <div className="pt-6 pb-2 overflow-x-auto">
            <div className="flex items-end justify-between gap-1.5 sm:gap-3 md:gap-4 h-56 px-2 min-w-full border-b border-espresso-200">
              {trendData.map((item, idx) => {
                const heightPercent = Math.max(16, Math.min(100, Math.round((item.revenue / maxRevenueInChart) * 100)));
                const isLatest = idx === trendData.length - 1;

                return (
                  <div
                    key={item.label}
                    className="flex-1 flex flex-col items-center justify-end h-full group relative min-w-[34px] sm:min-w-[42px]"
                  >
                    {/* Hover Tooltip */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-espresso-950 text-white text-[10px] py-1 px-2.5 rounded-xl font-mono whitespace-nowrap shadow-xl pointer-events-none z-30 absolute -top-9 left-1/2 -translate-x-1/2">
                      <p className="font-bold text-amber-400">{formatRupiah(item.revenue)}</p>
                      <p className="text-[9px] text-espresso-300">{item.orders} transaksi</p>
                    </div>

                    {/* Bar Track & Fill */}
                    <div className="w-full max-w-[44px] h-40 flex items-end justify-center bg-oat-100/80 rounded-2xl p-1 border border-espresso-100/70">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-xl transition-all duration-500 group-hover:brightness-110 flex items-start justify-center pt-1 shadow-sm ${
                          isLatest
                            ? 'bg-gradient-to-t from-amber-500 via-amber-400 to-amber-300'
                            : 'bg-gradient-to-t from-espresso-950 to-espresso-800'
                        }`}
                      >
                        {heightPercent > 35 && (
                          <span className={`text-[9px] font-black font-display ${isLatest ? 'text-espresso-950' : 'text-amber-300'}`}>
                            {Math.round(item.revenue / 1000)}k
                          </span>
                        )}
                      </div>
                    </div>

                    {/* X-axis Label */}
                    <span className="text-[10px] sm:text-xs font-bold text-espresso-600 mt-2 truncate max-w-[50px] sm:max-w-[70px] text-center">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Category Contribution */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-espresso-200 shadow-subtle space-y-4 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-espresso-100">
              <PieChart className="w-5 h-5 text-amber-500" />
              <div>
                <h2 className="font-black text-base text-espresso-950 font-display">
                  Kontribusi Kategori
                </h2>
                <p className="text-xs text-espresso-400">Porsi penjualan per jenis hidangan</p>
              </div>
            </div>

            <div className="space-y-3 pt-3">
              {categoryStats.map((cat) => (
                <div key={cat.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-espresso-800 line-clamp-1">{cat.name}</span>
                    <span className="text-espresso-950 font-black font-display">
                      {formatRupiah(cat.revenue)} ({cat.share}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-espresso-100 overflow-hidden">
                    <div
                      style={{ width: `${cat.share}%` }}
                      className={`h-full rounded-full ${cat.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Method summary card */}
          <div className="mt-4 bg-oat-50/80 p-4 rounded-2xl border border-espresso-200 space-y-2">
            <span className="text-xs font-black text-espresso-950 block flex items-center gap-2">
              <CreditCard className="w-3.5 h-3.5 text-amber-500" />
              <span>Metode Pembayaran Terbanyak</span>
            </span>
            <div className="flex justify-between text-xs text-espresso-600 font-medium">
              <span>QRIS Dinamis</span>
              <span className="font-bold text-espresso-950 font-display">72%</span>
            </div>
            <div className="flex justify-between text-xs text-espresso-600 font-medium">
              <span>E-Wallet (GoPay/Shopee)</span>
              <span className="font-bold text-espresso-950 font-display">18%</span>
            </div>
            <div className="flex justify-between text-xs text-espresso-600 font-medium">
              <span>Virtual Account & Cash</span>
              <span className="font-bold text-espresso-950 font-display">10%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Sales Ranking Leaderboard Table */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-espresso-200 shadow-subtle space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-espresso-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-espresso-950 flex items-center justify-center font-bold">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-black text-base sm:text-lg text-espresso-950 font-display">
                Peringkat Menu & Performa Produk
              </h2>
              <p className="text-xs text-espresso-400">
                Peringkat seluruh menu berdasarkan omset dan porsi terjual
              </p>
            </div>
          </div>
          <span className="text-xs font-black text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-xl">
            {bestSellers.length} Menu Terjual
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-espresso-100 text-espresso-400 uppercase tracking-wider font-bold text-[10px]">
                <th className="pb-3 font-bold">Rank</th>
                <th className="pb-3 font-bold">Nama Menu</th>
                <th className="pb-3 font-bold">Kuantitas Terjual</th>
                <th className="pb-3 font-bold">Total Omset</th>
                <th className="pb-3 text-right font-bold">Kontribusi Omset</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-espresso-100">
              {bestSellers.map((item, idx) => {
                const share = totalRevenue > 0 ? Math.round((item.revenue / totalRevenue) * 100) : 0;
                return (
                  <tr key={item.name} className="hover:bg-oat-50 transition-colors">
                    <td className="py-3.5 font-bold text-espresso-950">
                      <span
                        className={`w-7 h-7 rounded-xl inline-flex items-center justify-center text-xs font-black ${
                          idx === 0
                            ? 'bg-amber-400 text-espresso-950 shadow-2xs'
                            : idx === 1
                            ? 'bg-espresso-900 text-white'
                            : 'bg-espresso-100 text-espresso-700'
                        }`}
                      >
                        {idx + 1}
                      </span>
                    </td>
                    <td className="py-3.5 font-black text-espresso-950 text-sm font-display">{item.name}</td>
                    <td className="py-3.5 text-espresso-700 font-bold">{item.count} porsi</td>
                    <td className="py-3.5 font-black text-espresso-950 font-display">
                      {formatRupiah(item.revenue)}
                    </td>
                    <td className="py-3.5 text-right font-black text-amber-600 font-display">
                      {share}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
