import React, { useState } from 'react';
import {
  Search,
  Check,
  X,
  LayoutGrid,
  List,
  Coffee,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus } from '../../types';
import { formatRupiah, formatRelativeTime, getOrderStatusInfo } from '../../utils/formatters';

export const OrderManagementView: React.FC = () => {
  const { orders, updateOrderStatus, tables } = useStore();
  const [statusFilter, setStatusFilter] = useState<string>('active');
  const [tableFilter, setTableFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  const filteredOrders = orders.filter((o) => {
    // Status filter
    if (statusFilter === 'active') {
      if (['completed', 'cancelled'].includes(o.order_status)) return false;
    } else if (statusFilter !== 'all' && o.order_status !== statusFilter) {
      return false;
    }

    // Table filter
    if (tableFilter !== 'all' && o.table_id !== tableFilter) {
      return false;
    }

    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchNumber = o.order_number.toLowerCase().includes(q);
      const matchCustomer = o.customer_name?.toLowerCase().includes(q);
      const matchItems = o.items.some((i) => i.menu_name.toLowerCase().includes(q));
      if (!matchNumber && !matchCustomer && !matchItems) return false;
    }

    return true;
  });

  const getNextStatusAction = (order: Order) => {
    switch (order.order_status) {
      case 'paid':
        return {
          nextStatus: 'confirmed' as OrderStatus,
          label: 'Konfirmasi Pesanan',
          btnClass: 'bg-indigo-600 hover:bg-indigo-700 text-white',
        };
      case 'confirmed':
        return {
          nextStatus: 'preparing' as OrderStatus,
          label: 'Mulai Seduh / Masak',
          btnClass: 'bg-amber-400 hover:bg-amber-300 text-espresso-950 font-black shadow-xs',
        };
      case 'preparing':
        return {
          nextStatus: 'ready' as OrderStatus,
          label: 'Tandai Siap Diantar',
          btnClass: 'bg-brew hover:bg-brew-dark text-white font-bold',
        };
      case 'ready':
        return {
          nextStatus: 'completed' as OrderStatus,
          label: 'Selesaikan Pesanan',
          btnClass: 'bg-espresso-950 hover:bg-espresso-900 text-white font-bold',
        };
      default:
        return null;
    }
  };

  const KANBAN_COLS: { key: OrderStatus; title: string; badgeColor: string; bgCol: string }[] = [
    { key: 'paid', title: 'Terbayar / Baru', badgeColor: 'bg-blue-500', bgCol: 'bg-blue-50/40 border-blue-100' },
    { key: 'confirmed', title: 'Dikonfirmasi', badgeColor: 'bg-indigo-500', bgCol: 'bg-indigo-50/40 border-indigo-100' },
    { key: 'preparing', title: 'Sedang Diseduh', badgeColor: 'bg-amber-500', bgCol: 'bg-amber-50/40 border-amber-100' },
    { key: 'ready', title: 'Siap Di Meja', badgeColor: 'bg-brew', bgCol: 'bg-brew-light/40 border-brew/20' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-espresso-950 font-display tracking-tight">
              Kitchen & Barista Order Board
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-600 text-[10px] font-black border border-amber-400/30">
              <Sparkles className="w-3 h-3" />
              <span>Realtime Kitchen</span>
            </span>
          </div>
          <p className="text-xs text-espresso-500 mt-1">
            Kelola dan perbarui progres seduhan dan hidangan pesanan meja secara terpadu.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1.5 bg-espresso-100 p-1 rounded-2xl border border-espresso-200 shadow-2xs self-start sm:self-auto">
          <button
            onClick={() => setViewMode('kanban')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
              viewMode === 'kanban'
                ? 'bg-white text-espresso-950 shadow-xs'
                : 'text-espresso-600 hover:text-espresso-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Kanban Board</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
              viewMode === 'list'
                ? 'bg-white text-espresso-950 shadow-xs'
                : 'text-espresso-600 hover:text-espresso-900'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Tabel List</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-espresso-200 shadow-subtle flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative min-w-[220px] flex-1 max-w-sm">
          <Search className="w-4 h-4 text-espresso-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari order # atau nama pelanggan..."
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl border border-espresso-200 focus:outline-none focus:border-amber-400 bg-oat-50/70 font-medium transition-all"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'active', label: 'Aktif (Dapur)' },
            { id: 'all', label: 'Semua' },
            { id: 'paid', label: 'Terbayar' },
            { id: 'confirmed', label: 'Dikonfirmasi' },
            { id: 'preparing', label: 'Seduh' },
            { id: 'ready', label: 'Siap' },
            { id: 'completed', label: 'Selesai' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                statusFilter === st.id
                  ? 'bg-espresso-950 text-amber-300 shadow-sm font-black'
                  : 'bg-oat-100/80 text-espresso-700 hover:bg-espresso-100 border border-espresso-100'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* Table Filter with Custom Chevron */}
        <div className="relative shrink-0">
          <select
            value={tableFilter}
            onChange={(e) => setTableFilter(e.target.value)}
            className="appearance-none text-xs pl-3.5 pr-8 py-2.5 rounded-2xl border border-espresso-200 bg-white font-bold text-espresso-800 focus:outline-none focus:border-amber-400 cursor-pointer transition-all shadow-2xs"
          >
            <option value="all">Semua Meja</option>
            {tables.map((t) => (
              <option key={t.id} value={t.id}>
                {t.table_number}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-espresso-400">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
      </div>

      {/* KANBAN VIEW */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {KANBAN_COLS.map((col) => {
            const columnOrders = filteredOrders.filter((o) => o.order_status === col.key);

            return (
              <div
                key={col.key}
                className={`${col.bgCol} rounded-3xl p-4 border flex flex-col min-h-[520px] transition-all`}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-espresso-200/70">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${col.badgeColor} shadow-xs`} />
                    <h3 className="font-black text-xs uppercase tracking-wider text-espresso-950 font-display">
                      {col.title}
                    </h3>
                  </div>
                  <span className="w-6 h-6 rounded-full bg-white text-espresso-950 font-black text-xs flex items-center justify-center shadow-2xs border border-espresso-100">
                    {columnOrders.length}
                  </span>
                </div>

                {/* Column Cards */}
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {columnOrders.length === 0 ? (
                    <div className="h-32 flex items-center justify-center text-espresso-400 text-xs italic">
                      Tidak ada antrian
                    </div>
                  ) : (
                    columnOrders.map((order) => {
                      const nextAction = getNextStatusAction(order);
                      return (
                        <div
                          key={order.id}
                          className="bg-white rounded-3xl p-4 sm:p-5 border border-espresso-200 shadow-subtle hover:shadow-elevated hover:border-amber-400 transition-all space-y-3 cursor-pointer group"
                          onClick={() => setSelectedOrder(order)}
                        >
                          {/* Order Header */}
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="text-[10px] font-bold text-espresso-400 block font-mono">
                                {order.order_number}
                              </span>
                              <span className="font-black text-sm text-espresso-950 font-display">
                                {order.table?.table_number || 'Meja ?'}
                              </span>
                            </div>
                            <span className="text-[10px] font-bold text-espresso-600 bg-oat-100 px-2.5 py-0.5 rounded-full border border-espresso-100">
                              {formatRelativeTime(order.created_at)}
                            </span>
                          </div>

                          {/* Customer */}
                          {order.customer_name && (
                            <p className="text-xs font-semibold text-espresso-700">
                              Pemesan: <span className="text-amber-600 font-bold">{order.customer_name}</span>
                            </p>
                          )}

                          {/* Items List */}
                          <div className="space-y-1.5 py-2 border-y border-espresso-100 text-xs">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex justify-between items-start gap-1">
                                <span className="font-medium text-espresso-800">
                                  <b className="text-espresso-950 font-bold">{item.quantity}x</b>{' '}
                                  {item.menu_name}
                                </span>
                                {item.notes && (
                                  <span className="text-[10px] text-amber-950 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200 block font-bold">
                                    {item.notes}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>

                          {/* Total & Action */}
                          <div className="flex items-center justify-between pt-1 gap-2">
                            <span className="text-xs font-black text-espresso-950 font-display">
                              {formatRupiah(order.total)}
                            </span>

                            {nextAction && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateOrderStatus(order.id, nextAction.nextStatus);
                                }}
                                className={`text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-xs transition-all active:scale-95 shrink-0 ${nextAction.btnClass}`}
                              >
                                {nextAction.label}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* LIST TABLE VIEW */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-espresso-200 shadow-subtle overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-espresso-100 text-espresso-400 uppercase tracking-wider font-bold text-[10px]">
                <th className="pb-3 font-bold">Order #</th>
                <th className="pb-3 font-bold">Meja</th>
                <th className="pb-3 font-bold">Pemesan</th>
                <th className="pb-3 font-bold">Daftar Item</th>
                <th className="pb-3 font-bold">Total</th>
                <th className="pb-3 font-bold">Status</th>
                <th className="pb-3 font-bold">Waktu</th>
                <th className="pb-3 text-right font-bold">Aksi Cepat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-espresso-100">
              {filteredOrders.map((order) => {
                const statusInfo = getOrderStatusInfo(order.order_status);
                const nextAction = getNextStatusAction(order);

                return (
                  <tr
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className="hover:bg-oat-50 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 font-bold font-mono text-espresso-950">
                      {order.order_number}
                    </td>
                    <td className="py-3.5 font-black text-espresso-900">
                      {order.table?.table_number}
                    </td>
                    <td className="py-3.5 text-espresso-700 font-medium">{order.customer_name || '-'}</td>
                    <td className="py-3.5 max-w-[220px]">
                      <div className="truncate text-espresso-800 font-medium">
                        {order.items.map((i) => `${i.quantity}x ${i.menu_name}`).join(', ')}
                      </div>
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
                    <td className="py-3.5 text-espresso-400 font-medium">
                      {formatRelativeTime(order.created_at)}
                    </td>
                    <td className="py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                      {nextAction && (
                        <button
                          onClick={() => updateOrderStatus(order.id, nextAction.nextStatus)}
                          className={`text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-xs transition-all active:scale-95 ${nextAction.btnClass}`}
                        >
                          {nextAction.label}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso-950/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-3xl shadow-floating overflow-hidden flex flex-col animate-slide-up border border-espresso-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-espresso-950 text-white p-5 flex items-center justify-between border-b border-espresso-800">
              <div>
                <h3 className="font-black text-base font-display text-white">
                  Detail Order {selectedOrder.order_number}
                </h3>
                <p className="text-xs text-espresso-400 mt-0.5">
                  {selectedOrder.table?.table_number} • {selectedOrder.customer_name || 'Tamu Dine-in'}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-xl bg-espresso-900 hover:bg-espresso-800 text-espresso-300 hover:text-white flex items-center justify-center transition-colors shadow-2xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 max-h-[75vh]">
              {/* Status Switcher */}
              <div>
                <label className="block text-[11px] font-black text-espresso-400 uppercase tracking-wider mb-2">
                  Ubah Status Pesanan
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                  {(['paid', 'confirmed', 'preparing', 'ready', 'completed'] as OrderStatus[]).map(
                    (st) => {
                      const info = getOrderStatusInfo(st);
                      const isCurrent = selectedOrder.order_status === st;
                      return (
                        <button
                          key={st}
                          onClick={() => {
                            updateOrderStatus(selectedOrder.id, st);
                            setSelectedOrder((prev) => (prev ? { ...prev, order_status: st } : null));
                          }}
                          className={`p-2 rounded-2xl text-xs font-bold border transition-all ${
                            isCurrent
                              ? 'bg-amber-400 text-espresso-950 border-amber-400 shadow-sm font-black'
                              : 'bg-oat-50 hover:bg-espresso-100 text-espresso-700 border-espresso-200'
                          }`}
                        >
                          {info.label.split(' ')[0]}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Item Details */}
              <div className="border-t border-espresso-100 pt-4 space-y-2.5">
                <h4 className="font-black text-xs text-espresso-900 uppercase tracking-wider">
                  Daftar Hidangan & Catatan Barista
                </h4>
                <div className="divide-y divide-espresso-100">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="py-2.5 flex items-start justify-between gap-3 text-xs">
                      <div>
                        <p className="font-bold text-espresso-950">
                          {item.quantity}x {item.menu_name}
                        </p>
                        {item.notes && (
                          <p className="text-[11px] text-amber-950 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200 mt-1 font-medium">
                            📝 Catatan: {item.notes}
                          </p>
                        )}
                      </div>
                      <span className="font-black text-espresso-950 font-display">
                        {formatRupiah(item.subtotal)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-espresso-100 pt-3 space-y-1.5 text-xs">
                <div className="flex justify-between text-espresso-500">
                  <span>Subtotal</span>
                  <span className="font-semibold text-espresso-800">{formatRupiah(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-espresso-500">
                  <span>Pajak (PB1 10%)</span>
                  <span className="font-semibold text-espresso-800">{formatRupiah(selectedOrder.tax)}</span>
                </div>
                <div className="flex justify-between text-espresso-500">
                  <span>Layanan (5%)</span>
                  <span className="font-semibold text-espresso-800">{formatRupiah(selectedOrder.service_charge)}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-espresso-950 pt-2.5 border-t-2 border-espresso-100">
                  <span>Total Tagihan</span>
                  <span className="text-amber-600 font-display text-base font-black">
                    {formatRupiah(selectedOrder.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
