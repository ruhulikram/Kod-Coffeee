import React, { useState } from 'react';
import { X, QrCode, CheckCircle2, ScanLine, AlertCircle, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Table } from '../../types';

interface TableSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TableSelectorModal: React.FC<TableSelectorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { tables, currentTable, setCurrentTable, setTableByToken } = useStore();
  const [tokenInput, setTokenInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'grid' | 'qr_scan'>('grid');
  const [isScanning, setIsScanning] = useState(false);

  if (!isOpen) return null;

  const handleSelectTable = (table: Table) => {
    setCurrentTable(table);
    setErrorMsg('');
    onClose();
  };

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) return;

    const matched = setTableByToken(tokenInput.trim());
    if (matched) {
      setErrorMsg('');
      setTokenInput('');
      onClose();
    } else {
      setErrorMsg('Token atau nomor meja tidak valid. Silakan coba lagi.');
    }
  };

  const handleSimulateScan = (table: Table) => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setCurrentTable(table);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso-950/80 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-md bg-white rounded-3xl shadow-floating overflow-hidden flex flex-col max-h-[85vh] animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-espresso-950 text-white flex items-center justify-between border-b border-espresso-800">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-crema" />
            <div>
              <h2 className="font-bold text-sm font-display">Identifikasi Meja</h2>
              <p className="text-[11px] text-espresso-400">Pilih atau scan QR meja Anda</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-espresso-800 text-espresso-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-espresso-100 bg-oat-50 p-1">
          <button
            onClick={() => setActiveTab('grid')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'grid'
                ? 'bg-white text-espresso-950 shadow-sm'
                : 'text-espresso-500 hover:text-espresso-800'
            }`}
          >
            Daftar Meja (1–12)
          </button>
          <button
            onClick={() => setActiveTab('qr_scan')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'qr_scan'
                ? 'bg-white text-espresso-950 shadow-sm'
                : 'text-espresso-500 hover:text-espresso-800'
            }`}
          >
            <ScanLine className="w-3.5 h-3.5 text-crema" />
            <span>Simulasi Scan QR</span>
          </button>
        </div>

        {errorMsg && (
          <div className="mx-4 mt-3 p-2.5 rounded-xl bg-ember-light border border-ember/20 text-ember-dark text-xs flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Body */}
        <div className="p-4 overflow-y-auto space-y-4">
          {activeTab === 'grid' && (
            <div>
              <p className="text-xs text-espresso-600 mb-3">
                Pilih meja tempat Anda duduk saat ini untuk memulai pemesanan:
              </p>

              <div className="grid grid-cols-3 gap-2.5">
                {tables.map((table) => {
                  const isSelected = currentTable?.id === table.id;
                  return (
                    <button
                      key={table.id}
                      onClick={() => handleSelectTable(table)}
                      className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                        isSelected
                          ? 'bg-espresso-950 text-white border-espresso-950 shadow-md ring-2 ring-crema'
                          : 'bg-oat-50 hover:bg-white text-espresso-900 border-espresso-200 hover:border-espresso-300'
                      }`}
                    >
                      <span className="text-xs font-extrabold font-display">
                        {table.table_number}
                      </span>
                      <span
                        className={`text-[9px] uppercase font-extrabold tracking-wider px-1.5 py-0.2 rounded-full ${
                          isSelected
                            ? 'bg-crema text-espresso-950'
                            : table.status === 'occupied'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-brew-light text-brew-dark'
                        }`}
                      >
                        {isSelected ? 'Aktif' : table.status === 'occupied' ? 'Terisi' : 'Kosong'}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Token manual input */}
              <div className="mt-4 pt-4 border-t border-espresso-100">
                <form onSubmit={handleTokenSubmit} className="space-y-2">
                  <label className="block text-[11px] font-bold text-espresso-700 uppercase tracking-wider">
                    Atau Masukkan Token QR Meja
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tokenInput}
                      onChange={(e) => setTokenInput(e.target.value)}
                      placeholder="Contoh: kod_tbl_04_tok atau Table 04"
                      className="flex-1 px-3 py-2 text-xs rounded-xl border border-espresso-200 focus:outline-none focus:border-crema bg-oat-50"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-2 rounded-xl bg-espresso-900 text-white font-bold text-xs hover:bg-espresso-800 transition-colors shadow-sm"
                    >
                      Terapkan
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'qr_scan' && (
            <div className="text-center space-y-4">
              <div className="relative aspect-square max-w-[220px] mx-auto bg-espresso-950 rounded-3xl overflow-hidden border-2 border-crema flex flex-col items-center justify-center p-4 text-white shadow-elevated">
                {isScanning ? (
                  <div className="space-y-2">
                    <div className="w-8 h-8 border-3 border-crema border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-xs font-bold text-crema">Membaca QR Meja...</p>
                  </div>
                ) : (
                  <>
                    <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 h-0.5 bg-crema shadow-[0_0_8px_#C88A36] animate-pulse" />
                    <QrCode className="w-20 h-20 text-espresso-700" />
                    <p className="text-[11px] text-espresso-300 mt-3 font-medium">
                      Arahkan kamera ke QR Code meja fisik Kod Coffee
                    </p>
                  </>
                )}
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-espresso-800 block">
                  Simulasi Cepat Pindai Meja:
                </span>
                <div className="flex flex-wrap justify-center gap-1.5">
                  {tables.slice(0, 6).map((t) => (
                    <button
                      key={t.id}
                      onClick={() => handleSimulateScan(t)}
                      className="text-xs px-2.5 py-1 rounded-lg bg-oat-100 hover:bg-crema hover:text-espresso-950 text-espresso-800 border border-espresso-200 transition-colors font-medium"
                    >
                      Scan {t.table_number}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
