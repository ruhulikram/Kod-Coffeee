import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  QrCode,
  Printer,
  RefreshCw,
  Eye,
  CheckCircle2,
  Clock,
  Sparkles,
  Coffee,
  X,
  Smartphone,
  Download,
  Plus,
  Search,
  Filter,
  Users,
  AlertCircle,
  Check,
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
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-espresso-950 font-display">
            Manajemen Meja & QR Standee
          </h1>
          <p className="text-xs text-espresso-500 mt-0.5">
            Pantau status okupansi meja fisik, kelola token QR, dan cetak kartu standee meja
          </p>
        </div>

        <div className="flex items-center gap-2">
          {tables[0] && (
            <button
              onClick={() => setSelectedTableForQR(tables[0])}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-espresso-950 hover:bg-espresso-900 text-crema font-bold text-xs shadow-md transition-all active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Preview & Cetak Standee</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-espresso-100 shadow-subtle flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-espresso-500 uppercase tracking-wider block">
              Total Meja
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-espresso-950 font-display">
              {totalTables}
            </span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-espresso-100 text-espresso-700 flex items-center justify-center">
            <QrCode className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-espresso-100 shadow-subtle flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-espresso-500 uppercase tracking-wider block">
              Meja Kosong
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-brew font-display">
              {availableTables}
            </span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-brew-light text-brew flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-espresso-100 shadow-subtle flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-espresso-500 uppercase tracking-wider block">
              Terisi (Dine-in)
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-amber-700 font-display">
              {occupiedTables}
            </span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-espresso-100 shadow-subtle flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-espresso-500 uppercase tracking-wider block">
              Nonaktif
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-espresso-500 font-display">
              {inactiveTables}
            </span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-espresso-50 text-espresso-500 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-espresso-100 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-espresso-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari Meja (cth: Table 04)..."
            className="w-full pl-10 pr-4 py-2.5 text-xs md:text-sm font-medium rounded-2xl border border-espresso-200 focus:outline-none focus:ring-2 focus:ring-crema focus:border-crema bg-oat-50 transition-all placeholder-espresso-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-espresso-400 hover:text-espresso-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
          {[
            { id: 'all', label: 'Semua Meja', count: totalTables },
            { id: 'available', label: 'Kosong', count: availableTables },
            { id: 'occupied', label: 'Terisi', count: occupiedTables },
            { id: 'inactive', label: 'Nonaktif', count: inactiveTables },
          ].map((flt) => (
            <button
              key={flt.id}
              onClick={() => setStatusFilter(flt.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 active:scale-95 ${
                statusFilter === flt.id
                  ? 'bg-espresso-950 text-crema shadow-md'
                  : 'bg-oat-100 text-espresso-700 hover:bg-espresso-100'
              }`}
            >
              <span>{flt.label}</span>
              <span
                className={`text-[10px] md:text-xs px-1.5 py-0.2 rounded-full ${
                  statusFilter === flt.id
                    ? 'bg-crema text-espresso-950 font-extrabold'
                    : 'bg-white text-espresso-600 font-semibold'
                }`}
              >
                {flt.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Tables Grid - Clean Minimalist Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {filteredTables.map((table) => {
          const qrUrl = getQRUrl(table);

          return (
            <div
              key={table.id}
              className="bg-white rounded-3xl p-4 sm:p-5 border border-espresso-100 shadow-subtle hover:shadow-elevated hover:border-espresso-200 transition-all flex flex-col justify-between space-y-4"
            >
              {/* 1. Header: Table Number + Compact Status Dropdown */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-espresso-950 text-white flex items-center justify-center font-black text-sm shadow-xs font-display shrink-0">
                    {table.table_number.replace(/[^0-9]/g, '') || table.table_number}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-extrabold text-sm text-espresso-950 font-display truncate">
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
                    className={`appearance-none text-[11px] font-extrabold pl-2.5 pr-6 py-1.5 rounded-full border cursor-pointer focus:outline-none focus:ring-1 focus:ring-crema transition-all ${
                      table.status === 'occupied'
                        ? 'bg-amber-50 text-amber-900 border-amber-300'
                        : table.status === 'inactive'
                        ? 'bg-espresso-100 text-espresso-600 border-espresso-200'
                        : 'bg-brew-light text-brew-dark border-brew/40'
                    }`}
                  >
                    <option value="available">● Kosong</option>
                    <option value="occupied">● Terisi</option>
                    <option value="inactive">✕ Tutup</option>
                  </select>
                  <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-espresso-500">
                    <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* 2. Center: Centered QR Preview Card (Click to preview standee) */}
              <div
                onClick={() => setSelectedTableForQR(table)}
                className="bg-oat-50/70 rounded-2xl p-4 border border-espresso-100/80 hover:border-crema hover:bg-crema-50/30 transition-all cursor-pointer flex flex-col items-center justify-center text-center group"
                title="Klik untuk membuka preview Standee Meja"
              >
                <div className="p-2.5 bg-white rounded-2xl border border-espresso-100 shadow-xs group-hover:scale-105 transition-transform">
                  <QRCodeSVG value={qrUrl} size={96} level="M" />
                </div>
                <span className="text-[11px] font-bold text-espresso-500 group-hover:text-espresso-950 mt-2.5 transition-colors">
                  🔍 Preview Standee
                </span>
              </div>

              {/* 3. Footer Actions: Reset Icon Button + Cetak Standee Button */}
              <div className="flex items-center gap-2 pt-1 border-t border-espresso-50">
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
                  <Printer className="w-3.5 h-3.5 text-crema" />
                  <span>Cetak Standee</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Printable QR Standee Modal */}
      {selectedTableForQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso-950/80 backdrop-blur-sm animate-fade-in">
          <div
            className="w-full max-w-md bg-white rounded-3xl shadow-floating overflow-hidden flex flex-col max-h-[90vh] animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-espresso-950 text-white p-4 px-5 flex items-center justify-between border-b border-espresso-800">
              <div>
                <h3 className="font-extrabold text-sm sm:text-base font-display">
                  Standee Meja — {selectedTableForQR.table_number}
                </h3>
                <p className="text-[11px] text-espresso-400">
                  Desain kartu akrilik meja siap cetak dan scan
                </p>
              </div>
              <button
                onClick={() => setSelectedTableForQR(null)}
                className="w-8 h-8 rounded-full bg-espresso-800 text-espresso-300 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body with Theme Switcher */}
            <div className="p-5 text-center space-y-4 overflow-y-auto">
              {/* Theme Toggle */}
              <div className="flex items-center justify-center gap-2 bg-oat-100 p-1 rounded-xl w-fit mx-auto">
                <button
                  onClick={() => setStandeeTheme('light')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    standeeTheme === 'light'
                      ? 'bg-white text-espresso-950 shadow-sm'
                      : 'text-espresso-600'
                  }`}
                >
                  📄 Kertas Putih (Hemat Tinta)
                </button>
                <button
                  onClick={() => setStandeeTheme('dark')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    standeeTheme === 'dark'
                      ? 'bg-espresso-950 text-crema shadow-sm'
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
                    ? 'bg-espresso-950 text-white border-2 border-crema/40 shadow-elevated'
                    : 'bg-white text-espresso-950 border-2 border-espresso-900 shadow-md'
                }`}
              >
                {/* Brand Header */}
                <div className="flex items-center justify-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold shadow-sm ${
                      standeeTheme === 'dark'
                        ? 'bg-crema text-espresso-950'
                        : 'bg-espresso-950 text-crema'
                    }`}
                  >
                    <Coffee className="w-4 h-4" />
                  </div>
                  <div>
                    <h2
                      className={`font-black text-lg tracking-tight font-display ${
                        standeeTheme === 'dark' ? 'text-white' : 'text-espresso-950'
                      }`}
                    >
                      KOD<span className="text-crema">COFFEE</span>
                    </h2>
                    <p
                      className={`text-[9px] uppercase tracking-widest font-semibold ${
                        standeeTheme === 'dark' ? 'text-espresso-300' : 'text-espresso-500'
                      }`}
                    >
                      Specialty Roastery & Cafe
                    </p>
                  </div>
                </div>

                {/* Table Pill */}
                <div
                  className={`py-1 px-4 rounded-full font-black text-sm font-display tracking-wider inline-block shadow-sm ${
                    standeeTheme === 'dark'
                      ? 'bg-crema text-espresso-950'
                      : 'bg-espresso-950 text-crema'
                  }`}
                >
                  {selectedTableForQR.table_number.toUpperCase()}
                </div>

                {/* QR Code Graphic */}
                <div className="p-3.5 bg-white rounded-2xl inline-block shadow-md border-2 border-crema-500">
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
                    className={`flex items-center justify-center gap-1.5 text-xs font-bold ${
                      standeeTheme === 'dark' ? 'text-crema' : 'text-espresso-950'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5 text-crema" />
                    <span>Pesan Langsung dari Meja</span>
                  </div>
                  <p
                    className={`text-[10px] leading-tight max-w-[210px] mx-auto ${
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
                  className="flex-1 py-2.5 rounded-xl border border-espresso-200 text-espresso-700 font-bold text-xs hover:bg-espresso-50 flex items-center justify-center gap-1 transition-colors"
                >
                  {isCopiedToken ? <Check className="w-3.5 h-3.5 text-brew" /> : null}
                  <span>{isCopiedToken ? 'Tersalin!' : 'Salin Token'}</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="flex-1 py-2.5 rounded-xl bg-espresso-950 hover:bg-espresso-900 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95"
                >
                  <Printer className="w-4 h-4" />
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
