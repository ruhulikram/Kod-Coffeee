import React, { useState } from 'react';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Coffee,
  QrCode,
  BarChart3,
  LogOut,
  Layers,
  ArrowLeft,
  Menu,
  X,
  ShoppingBag,
} from 'lucide-react';
import { AdminTab } from '../../types';
import { useStore } from '../../context/StoreContext';

interface AdminSidebarProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onLogout: () => void;
  onReturnToCustomer: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  onSelectTab,
  onLogout,
  onReturnToCustomer,
}) => {
  const { orders } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeOrdersCount = orders.filter((o) =>
    ['paid', 'confirmed', 'preparing'].includes(o.order_status)
  ).length;

  const NAV_ITEMS: { id: AdminTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'Ringkasan Bisnis', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'pos', label: 'Kasir POS (Walk-in)', icon: <ShoppingBag className="w-4 h-4" /> },
    {
      id: 'orders',
      label: 'Kitchen Orders',
      icon: <UtensilsCrossed className="w-4 h-4" />,
      badge: activeOrdersCount > 0 ? activeOrdersCount : undefined,
    },
    { id: 'menus', label: 'Kelola Menu & Stok', icon: <Coffee className="w-4 h-4" /> },
    { id: 'categories', label: 'Kelola Kategori', icon: <Layers className="w-4 h-4" /> },
    { id: 'tables', label: 'Meja & Cetak QR', icon: <QrCode className="w-4 h-4" /> },
    { id: 'reports', label: 'Laporan Penjualan', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  const handleSelect = (tab: AdminTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Top Header for Admin */}
      <div className="lg:hidden bg-espresso-950 text-white px-4 py-3 border-b border-espresso-800 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-400 text-espresso-950 flex items-center justify-center font-black shadow-xs">
            <Coffee className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-black text-sm font-display tracking-tight text-white">
                KOD<span className="text-amber-400">ADMIN</span>
              </span>
              <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-amber-400 text-espresso-950 uppercase">
                Staff
              </span>
            </div>
            <span className="text-[10px] text-espresso-400 block -mt-0.5 font-medium">
              {NAV_ITEMS.find((n) => n.id === currentTab)?.label}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onReturnToCustomer}
            className="text-[11px] bg-espresso-900 hover:bg-espresso-800 text-amber-300 px-3 py-1.5 rounded-xl border border-espresso-700 font-bold flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Customer</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-espresso-900 text-white hover:bg-espresso-800 border border-espresso-800 active:scale-95"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-amber-400" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[57px] z-40 bg-espresso-950/98 backdrop-blur-md p-4 flex flex-col justify-between animate-fade-in">
          <nav className="space-y-1.5">
            {NAV_ITEMS.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-amber-400 text-espresso-950 shadow-md font-black'
                      : 'text-espresso-300 hover:bg-espresso-900 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span className="text-sm">{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-xs font-black px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-espresso-950 text-amber-300 shadow-2xs'
                          : 'bg-amber-400 text-espresso-950'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-espresso-800 space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onReturnToCustomer();
              }}
              className="w-full py-3 rounded-2xl bg-espresso-900 hover:bg-espresso-800 text-white font-bold text-xs flex items-center justify-center gap-2 border border-espresso-800"
            >
              <ArrowLeft className="w-4 h-4 text-amber-400" />
              <span>Buka Menu Pelanggan</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onLogout();
              }}
              className="w-full py-2.5 rounded-2xl bg-ember/20 hover:bg-ember/30 text-ember font-bold text-xs flex items-center justify-center gap-2 border border-ember/30 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar (Logout Staff)</span>
            </button>
          </div>
        </div>
      )}

      {/* Desktop Sidebar (hidden on mobile, visible on lg) */}
      <aside className="hidden lg:flex w-64 bg-espresso-950 text-white flex-col justify-between border-r border-espresso-800 shrink-0 sticky top-0 h-screen">
        <div>
          {/* Brand */}
          <div className="p-5 border-b border-espresso-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-amber-400 text-espresso-950 flex items-center justify-center font-black shadow-xs">
                <Coffee className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-black text-base tracking-tight font-display text-white">
                  KOD<span className="text-amber-400">ADMIN</span>
                </h2>
                <p className="text-[10px] text-espresso-400 font-medium">Operations & Barista Portal</p>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1.5">
            {NAV_ITEMS.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs transition-all ${
                    isActive
                      ? 'bg-amber-400 text-espresso-950 shadow-md font-black'
                      : 'text-espresso-300 hover:bg-espresso-900 hover:text-white font-semibold'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-espresso-950 text-amber-300 shadow-2xs'
                          : 'bg-amber-400 text-espresso-950 font-black'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-espresso-800 space-y-2">
          <button
            onClick={onReturnToCustomer}
            className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-amber-300 hover:bg-espresso-900 border border-espresso-800/80 transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            <span>Buka Menu Pelanggan</span>
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-semibold text-espresso-400 hover:text-ember hover:bg-espresso-900 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout Staff</span>
          </button>
        </div>
      </aside>
    </>
  );
};
