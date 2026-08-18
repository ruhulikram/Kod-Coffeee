import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  QrCode,
  Printer,
  RefreshCw,
  CheckCircle2,
  Clock,
  Coffee,
  X,
  Smartphone,
  Search,
  Users,
  Check,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Table, TableStatus } from '../../types';

export const TableManagementView: React.FC = () => {
  const { tables, updateTableStatus, regenerateTableQR } = useStore();
  const [selectedTableForQR, setSelectedTableForQR] = useState<Table | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | TableStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [standeeTheme, setStandeeTheme] = useState<'dark' | 'light'>('light');
  const [isCopiedToken, setIsCopiedToken] = useState(false);

  // KPIs
  const totalTables = tables.length;
  const availableTables = tables.filter((t) => t.status === 'available').length;
  const occupiedTables = tables.filter((t) => t.status === 'occupied').length;
  const inactiveTables = tables.filter((t) => t.status === 'inactive').length;

  const filteredTables = tables.filter((t) => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.table_number.toLowerCase().includes(q) ||
        t.qr_token.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handlePrint = () => {
    window.print();
  };

  const getQRUrl = (table: Table) => {
    const origin = window.location.origin;
    return `${origin}?table=${encodeURIComponent(table.table_number)}&token=${encodeURIComponent(table.qr_token)}`;
  };

  const handleCopyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    setIsCopiedToken(true);
    setTimeout(() => setIsCopiedToken(false), 2000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-espresso-950 font-display tracking-tight">
              Manajemen Meja & QR Standee
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-600 text-[10px] font-black border border-amber-400/30">
              <Sparkles className="w-3 h-3" />
              <span>{totalTables} Meja Aktif</span>
            </span>
          </div>
          <p className="text-xs text-espresso-500 mt-1">
            Pantau status okupansi meja fisik, kelola token QR, dan cetak kartu standee meja akrilik.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {tables[0] && (
            <button
              onClick={() => setSelectedTableForQR(tables[0])}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-espresso-950 font-black text-xs shadow-md transition-all active:scale-95 border border-amber-300"
            >
              <Printer className="w-4 h-4 text-espresso-950" />
              <span>Preview & Cetak Standee</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-5 rounded-3xl border border-espresso-200 shadow-subtle flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-espresso-400 uppercase tracking-wider block">
              Total Meja
            </span>
            <span className="text-xl sm:text-2xl font-black text-espresso-950 font-display">
              {totalTables}
            </span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-espresso-950 text-amber-300 flex items-center justify-center shadow-2xs">
            <QrCode className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-espresso-200 shadow-subtle flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-espresso-400 uppercase tracking-wider block">
              Meja Kosong
            </span>
            <span className="text-xl sm:text-2xl font-black text-brew font-display">
              {availableTables}
            </span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-brew-light text-brew flex items-center justify-center border border-brew/20 shadow-2xs">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-espresso-200 shadow-subtle flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-espresso-400 uppercase tracking-wider block">
              Terisi (Dine-in)
            </span>
            <span className="text-xl sm:text-2xl font-black text-amber-600 font-display">
              {occupiedTables}
            </span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200 shadow-2xs">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-espresso-200 shadow-subtle flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-espresso-400 uppercase tracking-wider block">
              Nonaktif
            </span>
            <span className="text-xl sm:text-2xl font-black text-espresso-500 font-display">
              {inactiveTables}
            </span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-espresso-100 text-espresso-600 flex items-center justify-center shadow-2xs">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-espresso-200 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-espresso-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari Meja (cth: Table 04)..."
            className="w-full pl-10 pr-4 py-2.5 text-xs md:text-sm font-medium rounded-2xl border border-espresso-200 focus:outline-none focus:border-amber-400 bg-oat-50/70 transition-all placeholder-espresso-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-espresso-400 hover:text-espresso-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'Semua Meja', count: totalTables },
            { id: 'available', label: 'Kosong', count: availableTables },
            { id: 'occupied', label: 'Terisi', count: occupiedTables },
            { id: 'inactive', label: 'Nonaktif', count: inactiveTables },
          ].map((flt) => (
            <button
              key={flt.id}
              onClick={() => setStatusFilter(flt.id as any)}
              className={`px-3.5 py-2 rounded-2xl text-xs md:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 active:scale-95 ${
                statusFilter === flt.id
                  ? 'bg-espresso-950 text-amber-300 shadow-sm font-black'
                  : 'bg-oat-100/80 text-espresso-700 hover:bg-espresso-100 border border-espresso-100'
              }`}
            >
              <span>{flt.label}</span>
              <span
                className={`text-[10px] md:text-xs px-1.5 py-0.2 rounded-full ${
                  statusFilter === flt.id
                    ? 'bg-amber-400 text-espresso-950 font-black'
                    : 'bg-white text-espresso-600 font-semibold'
                }`}
              >
                {flt.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {filteredTables.map((table) => {
          const qrUrl = getQRUrl(table);

          return (
            <div
              key={table.id}
              className="bg-white rounded-3xl p-5 border border-espresso-200 shadow-subtle hover:shadow-elevated hover:border-amber-400/60 transition-all flex flex-col justify-between space-y-4 group"
            >
              {/* 1. Header: Table Number + Compact Status Dropdown */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-espresso-950 text-amber-300 flex items-center justify-center font-black text-sm shadow-xs font-display shrink-0">
                    {table.table_number.replace(/[^0-9]/g, '') || table.table_number}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-black text-sm text-espresso-950 font-display truncate">
                      {table.table_number}
                    </h3>
                    <p className="text-[10px] text-espresso-400 font-mono truncate max-w-[90px]">
                      {table.qr_token}
                    </p>
                  </div>
                </div>

                {/* Compact Status Pill Selector */}
                <div className="relative shrink-0">
                  <select
                    value={table.status}
                    onChange={(e) => updateTableStatus(table.id, e.target.value as TableStatus)}
                    className={`appearance-none text-[11px] font-black pl-3 pr-7 py-1.5 rounded-full border cursor-pointer focus:outline-none focus:border-amber-400 transition-all ${
                      table.status === 'occupied'
                        ? 'bg-amber-50 text-amber-900 border-amber-300'
                        : table.status === 'inactive'
                        ? 'bg-espresso-100 text-espresso-600 border-espresso-200'
                        : 'bg-brew-light text-brew border-brew/40'
                    }`}
                  >
                    <option value="available">● Kosong</option>
                    <option value="occupied">● Terisi</option>
                    <option value="inactive">✕ Tutup</option>
                  </select>
                  <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-espresso-500">
                    <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* 2. Center: Centered QR Preview Card */}
              <div
                onClick={() => setSelectedTableForQR(table)}
                className="bg-oat-50/70 rounded-2xl p-4 border border-espresso-100 hover:border-amber-400 hover:bg-amber-50/30 transition-all cursor-pointer flex flex-col items-center justify-center text-center group"
                title="Klik untuk membuka preview Standee Meja"
              >
                <div className="p-3 bg-white rounded-2xl border border-espresso-200 shadow-2xs group-hover:scale-105 transition-transform">
                  <QRCodeSVG value={qrUrl} size={100} level="M" />
                </div>
                <span className="text-[11px] font-bold text-espresso-500 group-hover:text-espresso-950 mt-2.5 transition-colors">
                  🔍 Preview Standee
                </span>
              </div>

              {/* 3. Footer Actions */}
              <div className="flex items-center gap-2 pt-1 border-t border-espresso-100">
                <button
                  type="button"
                  onClick={() => regenerateTableQR(table.id)}
                  className="w-9 h-9 rounded-xl border border-espresso-200 text-espresso-600 hover:text-espresso-950 hover:bg-espresso-50 flex items-center justify-center shrink-0 transition-colors"
                  title="Generate Token QR Baru"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedTableForQR(table)}
                  className="flex-1 py-2 px-3 rounded-xl bg-espresso-950 hover:bg-espresso-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-400" />
                  <span>Cetak Standee</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Printable QR Standee Modal */}
      {selectedTableForQR && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso-950/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedTableForQR(null)}
        >
          <div
            className="w-full max-w-md bg-white rounded-3xl shadow-floating overflow-hidden flex flex-col max-h-[90vh] animate-slide-up border border-espresso-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-espresso-950 text-white p-4 px-5 flex items-center justify-between border-b border-espresso-800">
              <div>
                <h3 className="font-black text-sm sm:text-base font-display text-white">
                  Standee Meja — {selectedTableForQR.table_number}
                </h3>
                <p className="text-[11px] text-espresso-400">
                  Desain kartu akrilik meja siap cetak dan scan
                </p>
              </div>
              <button
                onClick={() => setSelectedTableForQR(null)}
                className="w-8 h-8 rounded-xl bg-espresso-900 hover:bg-espresso-800 text-espresso-300 hover:text-white flex items-center justify-center transition-colors shadow-2xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body with Theme Switcher */}
            <div className="p-5 text-center space-y-4 overflow-y-auto">
              {/* Theme Toggle */}
              <div className="flex items-center justify-center gap-2 bg-oat-100 p-1.5 rounded-2xl w-fit mx-auto border border-espresso-100">
                <button
                  onClick={() => setStandeeTheme('light')}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                    standeeTheme === 'light'
                      ? 'bg-white text-espresso-950 shadow-xs font-black'
                      : 'text-espresso-600'
                  }`}
                >
                  📄 Kertas Putih (Hemat Tinta)
                </button>
                <button
                  onClick={() => setStandeeTheme('dark')}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                    standeeTheme === 'dark'
                      ? 'bg-espresso-950 text-amber-300 shadow-xs font-black'
                      : 'text-espresso-600'
                  }`}
                >
                  ✨ Luxury Dark (Akrilik)
                </button>
              </div>

              {/* Printable Card Area */}
              <div
                id="printable-qr-standee"
                className={`p-6 rounded-3xl text-center space-y-4 mx-auto max-w-[280px] transition-all ${
                  standeeTheme === 'dark'
                    ? 'bg-espresso-950 text-white border-2 border-amber-400/50 shadow-elevated'
                    : 'bg-white text-espresso-950 border-2 border-espresso-950 shadow-md'
                }`}
              >
                {/* Brand Header */}
                <div className="flex items-center justify-center gap-2.5">
                  <div
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center font-black shadow-sm ${
                      standeeTheme === 'dark'
                        ? 'bg-amber-400 text-espresso-950'
                        : 'bg-espresso-950 text-white'
                    }`}
                  >
                    <Coffee className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h2
                      className={`font-black text-lg tracking-tight font-display leading-none ${
                        standeeTheme === 'dark' ? 'text-white' : 'text-espresso-950'
                      }`}
                    >
                      KOD<span className="text-amber-400">COFFEE</span>
                    </h2>
                    <p
                      className={`text-[9px] uppercase tracking-widest font-bold mt-0.5 ${
                        standeeTheme === 'dark' ? 'text-espresso-300' : 'text-espresso-500'
                      }`}
                    >
                      Specialty Roastery & Cafe
                    </p>
                  </div>
                </div>

                {/* Table Pill */}
                <div
                  className={`py-1.5 px-5 rounded-full font-black text-sm font-display tracking-wider inline-block shadow-sm ${
                    standeeTheme === 'dark'
                      ? 'bg-amber-400 text-espresso-950'
                      : 'bg-espresso-950 text-white'
                  }`}
                >
                  {selectedTableForQR.table_number.toUpperCase()}
                </div>

                {/* QR Code Graphic */}
                <div className="p-3.5 bg-white rounded-2xl inline-block shadow-md border-2 border-amber-400">
                  <QRCodeSVG
                    value={getQRUrl(selectedTableForQR)}
                    size={160}
                    level="H"
                    includeMargin={true}
                    className="mx-auto rounded-lg"
                  />
                </div>

                {/* Call to Action */}
                <div className="space-y-1">
                  <div
                    className={`flex items-center justify-center gap-1.5 text-xs font-black ${
                      standeeTheme === 'dark' ? 'text-amber-300' : 'text-espresso-950'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                    <span>Pesan Langsung dari Meja</span>
                  </div>
                  <p
                    className={`text-[10px] leading-tight max-w-[210px] mx-auto font-medium ${
                      standeeTheme === 'dark' ? 'text-espresso-300' : 'text-espresso-600'
                    }`}
                  >
                    Scan QR dengan kamera HP, pilih menu favorit, dan bayar cepat via QRIS/E-Wallet.
                  </p>
                </div>

                {/* Token Footer */}
                <div
                  className={`pt-2 border-t text-[9px] font-mono ${
                    standeeTheme === 'dark'
                      ? 'border-espresso-800 text-espresso-400'
                      : 'border-espresso-200 text-espresso-500'
                  }`}
                >
                  Token: {selectedTableForQR.qr_token}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => handleCopyToken(selectedTableForQR.qr_token)}
                  className="flex-1 py-3 rounded-2xl border border-espresso-200 text-espresso-700 font-bold text-xs hover:bg-espresso-50 flex items-center justify-center gap-1.5 transition-colors"
                >
                  {isCopiedToken ? <Check className="w-3.5 h-3.5 text-brew" /> : null}
                  <span>{isCopiedToken ? 'Tersalin!' : 'Salin Token'}</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="flex-1 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-espresso-950 font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
                >
                  <Printer className="w-4 h-4 text-espresso-950" />
                  <span>Cetak Standee</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
