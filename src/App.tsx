import React, { useState, useEffect } from 'react';
import { useStore } from './context/StoreContext';
import { MenuItem, PaymentMethod, AdminTab } from './types';

// Customer Components
import { HeroBanner } from './components/customer/HeroBanner';
import { CategoryBar } from './components/customer/CategoryBar';
import { MenuCard } from './components/customer/MenuCard';
import { MenuDetailModal } from './components/customer/MenuDetailModal';
import { CartView } from './components/customer/CartView';
import { FloatingCartBar } from './components/customer/FloatingCartBar';
import { CheckoutView } from './components/customer/CheckoutView';
import { PaymentModal } from './components/customer/PaymentModal';
import { OrderStatusView } from './components/customer/OrderStatusView';

// Admin Components
import { AdminSidebar } from './components/admin/AdminSidebar';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { DashboardView } from './components/admin/DashboardView';
import { PosView } from './components/admin/PosView';
import { OrderManagementView } from './components/admin/OrderManagementView';
import { MenuManagementView } from './components/admin/MenuManagementView';
import { CategoryManagementView } from './components/admin/CategoryManagementView';
import { TableManagementView } from './components/admin/TableManagementView';
import { ReportsView } from './components/admin/ReportsView';

// Icons
import { Smartphone, Monitor, ShieldAlert, Sparkles, Coffee } from 'lucide-react';

export function App() {
  const {
    menus,
    categories,
    currentTable,
    getOrderById,
    setTableByToken,
    cart,
  } = useStore();

  // Mode: 'customer' | 'admin'
  const [appMode, setAppMode] = useState<'customer' | 'admin'>('customer');
  // Device Preview Frame (for desktop preview testing mobile frame)
  const [mobileFramePreview, setMobileFramePreview] = useState(false);

  // Customer sub-views: 'menu' | 'cart' | 'checkout' | 'order-status'
  const [customerView, setCustomerView] = useState<'menu' | 'cart' | 'checkout' | 'order-status'>('menu');
  const [activeOrderNumber, setActiveOrderNumber] = useState<string>('ORD-1001');

  // Customer Modals & UI states
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // Payment Modal state
  const [pendingPaymentOrderId, setPendingPaymentOrderId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('qris');

  // Admin Portal states
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');

  // Read URL parameters on mount (?table=Table 04 or ?token=...)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get('token');
    const tableParam = params.get('table');

    if (tokenParam) {
      setTableByToken(tokenParam);
    } else if (tableParam) {
      setTableByToken(tableParam);
    }
  }, []);

  // Scrollspy to auto-detect active category section as customer scrolls
  useEffect(() => {
    if (customerView !== 'menu') return;

    const handleScroll = () => {
      const sections: { id: string; top: number }[] = [];

      const favEl = document.getElementById('sec-favorites');
      if (favEl) {
        const rect = favEl.getBoundingClientRect();
        sections.push({ id: 'favorites', top: rect.top });
      }

      categories.forEach((cat) => {
        const el = document.getElementById(`sec-${cat.id}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          sections.push({ id: cat.id, top: rect.top });
        }
      });

      // Find section closest to top threshold (under sticky category bar)
      const activeSection = sections
        .filter((s) => s.top <= 80)
        .sort((a, b) => b.top - a.top)[0];

      if (activeSection && activeSection.id !== selectedCategoryId) {
        setSelectedCategoryId(activeSection.id);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [customerView, categories, selectedCategoryId]);

  const favoriteMenus = menus.filter((m) => m.is_signature);

  const filteredMenus = menus.filter((m) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchName = m.name.toLowerCase().includes(q);
    const matchDesc = (m.description || '').toLowerCase().includes(q);
    const matchNotes = (m.taste_notes || '').toLowerCase().includes(q);
    return matchName || matchDesc || matchNotes;
  });

  const handleOrderCreated = (orderId: string, method: PaymentMethod) => {
    setPendingPaymentOrderId(orderId);
    setPaymentMethod(method);
  };

  const handlePaymentSuccess = (orderNumber: string) => {
    setPendingPaymentOrderId(null);
    setActiveOrderNumber(orderNumber);
    setCustomerView('order-status');
  };

  const handleSwitchToAdmin = () => {
    if (!isAdminLoggedIn) {
      setIsLoginModalOpen(true);
    } else {
      setAppMode('admin');
    }
  };

  return (
    <div className="min-h-screen bg-oat-100 flex flex-col">
      {/* Top Universal Mode Switcher Bar */}
      <div className="bg-espresso-950 text-white border-b border-espresso-800 px-4 py-2 text-xs flex items-center justify-between z-40">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold font-display">
            <span className="w-2 h-2 rounded-full bg-brew animate-pulse" />
            <span className="text-white font-extrabold">KOD COFFEE</span>
            <span className="text-espresso-400 font-normal">| Live App Preview</span>
          </div>

          <span className="hidden sm:inline-block text-[11px] text-espresso-400">
            Meja Aktif: <b className="text-white">{currentTable ? currentTable.table_number : 'Belum Dipilih'}</b>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile frame simulator toggle */}
          {appMode === 'customer' && (
            <button
              onClick={() => setMobileFramePreview(!mobileFramePreview)}
              className={`hidden md:flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-colors ${mobileFramePreview
                  ? 'bg-white text-espresso-950 border-white font-bold'
                  : 'bg-espresso-900 text-espresso-300 border-espresso-700 hover:text-white'
                }`}
              title="Simulasi Tampilan Smartphone 390px"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{mobileFramePreview ? 'Mobile Frame: ON' : 'Mobile Frame: OFF'}</span>
            </button>
          )}

          {/* View Switcher buttons */}
          <div className="flex items-center bg-espresso-900 p-0.5 rounded-xl border border-espresso-800">
            <button
              onClick={() => setAppMode('customer')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold text-xs transition-all ${appMode === 'customer'
                  ? 'bg-white text-espresso-950 shadow-xs'
                  : 'text-espresso-300 hover:text-white'
                }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Customer View</span>
            </button>

            <button
              onClick={handleSwitchToAdmin}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold text-xs transition-all ${appMode === 'admin'
                  ? 'bg-white text-espresso-950 shadow-xs'
                  : 'text-espresso-300 hover:text-white'
                }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Admin / Kitchen View</span>
            </button>
          </div>
        </div>
      </div>

      {/* CUSTOMER MODE */}
      {appMode === 'customer' && (
        <div
          className={`flex-1 flex flex-col ${mobileFramePreview
              ? 'max-w-[430px] mx-auto my-4 bg-white rounded-[40px] shadow-floating border-8 border-espresso-900 overflow-hidden min-h-[860px]'
              : 'w-full'
            }`}
        >
          {/* View 1: Menu Catalog with Scrollspy & Favorites */}
          {customerView === 'menu' && (
            <main className="flex-1 pb-28 sm:pb-32">
              <HeroBanner />

              <CategoryBar
                categories={categories}
                selectedCategoryId={selectedCategoryId}
                onSelectCategory={setSelectedCategoryId}
                hasFavorites={favoriteMenus.length > 0}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />

              {/* Menu Catalog Container */}
              <div className="max-w-4xl mx-auto px-4 py-4 space-y-6">
                {/* Mode A: Active Search Results */}
                {searchQuery.trim() ? (
                  <section className="space-y-3">
                    <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-espresso-100 shadow-2xs">
                      <div>
                        <h2 className="font-black text-sm text-espresso-950 font-display">
                          Hasil Pencarian: "{searchQuery}"
                        </h2>
                        <p className="text-[11px] text-espresso-500">
                          Menampilkan {filteredMenus.length} menu yang cocok
                        </p>
                      </div>
                      <button
                        onClick={() => setSearchQuery('')}
                        className="text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-xl border border-amber-200/60 transition-colors"
                      >
                        Reset Filter
                      </button>
                    </div>

                    {filteredMenus.length === 0 ? (
                      <div className="bg-white rounded-3xl p-8 text-center border border-espresso-100 shadow-subtle space-y-3">
                        <div className="w-14 h-14 rounded-2xl bg-oat-200 text-espresso-400 flex items-center justify-center mx-auto text-2xl">
                          🔍
                        </div>
                        <h3 className="font-black text-base text-espresso-950 font-display">
                          Menu Tidak Ditemukan
                        </h3>
                        <p className="text-xs text-espresso-500 max-w-xs mx-auto">
                          Tidak ada menu yang cocok dengan kata kunci "{searchQuery}". Coba kata kunci lain atau reset filter.
                        </p>
                        <button
                          onClick={() => setSearchQuery('')}
                          className="px-5 py-2.5 bg-espresso-950 hover:bg-espresso-900 text-white rounded-2xl text-xs font-black shadow-sm transition-all"
                        >
                          Lihat Semua Menu
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                        {filteredMenus.map((item) => (
                          <MenuCard
                            key={`search-${item.id}`}
                            item={item}
                            onSelect={(it) => setSelectedMenuItem(it)}
                          />
                        ))}
                      </div>
                    )}
                  </section>
                ) : (
                  <>
                    {/* Mode B: Regular Categorized Sections with Scrollspy */}
                    {/* 1. Section: Menu Favorit / Rekomendasi Barista */}
                    {favoriteMenus.length > 0 && (
                      <section id="sec-favorites" className="scroll-mt-20">
                        <div className="flex items-center justify-between mb-2.5">
                          <h2 className="font-extrabold text-sm sm:text-base text-espresso-950 font-display">
                            Menu Favorit & Rekomendasi
                          </h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                          {favoriteMenus.map((item) => (
                            <MenuCard
                              key={`fav-${item.id}`}
                              item={item}
                              onSelect={(it) => setSelectedMenuItem(it)}
                            />
                          ))}
                        </div>
                      </section>
                    )}

                    {/* 2. Sequential Category Sections */}
                    {categories
                      .filter((c) => c.is_active)
                      .map((cat) => {
                        const catMenus = menus.filter((m) => m.category_id === cat.id);
                        if (catMenus.length === 0) return null;

                        return (
                          <section id={`sec-${cat.id}`} key={cat.id} className="scroll-mt-20">
                            <div className="flex items-center justify-between mb-2.5 pt-3 border-t border-espresso-100">
                              <h2 className="font-extrabold text-sm sm:text-base text-espresso-950 font-display">
                                {cat.name}
                              </h2>
                              <span className="text-[11px] text-espresso-400 font-medium">
                                {catMenus.length} Menu
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                              {catMenus.map((item) => (
                                <MenuCard
                                  key={item.id}
                                  item={item}
                                  onSelect={(it) => setSelectedMenuItem(it)}
                                />
                              ))}
                            </div>
                          </section>
                        );
                      })}
                  </>
                )}
              </div>

              {/* Floating Bottom Cart Bar (Full View Trigger) */}
              <FloatingCartBar onOpenCart={() => setCustomerView('cart')} />
            </main>
          )}

          {/* View 2: Full Cart View */}
          {customerView === 'cart' && (
            <CartView
              onBack={() => setCustomerView('menu')}
              onProceedToCheckout={() => setCustomerView('checkout')}
            />
          )}

          {/* View 3: Checkout */}
          {customerView === 'checkout' && (
            <CheckoutView
              onBack={() => setCustomerView('cart')}
              onOrderCreated={handleOrderCreated}
            />
          )}

          {/* View 4: Order Status */}
          {customerView === 'order-status' && (
            <OrderStatusView
              orderNumber={activeOrderNumber}
              onBackToMenu={() => setCustomerView('menu')}
            />
          )}

          {/* Customer Modals */}
          <MenuDetailModal
            item={selectedMenuItem}
            onClose={() => setSelectedMenuItem(null)}
          />

          {pendingPaymentOrderId && (
            <PaymentModal
              order={getOrderById(pendingPaymentOrderId) || null}
              paymentMethod={paymentMethod}
              onSuccess={handlePaymentSuccess}
              onClose={() => setPendingPaymentOrderId(null)}
            />
          )}
        </div>
      )}

      {/* ADMIN MODE */}
      {appMode === 'admin' && (
        <div className="flex-1 flex flex-col lg:flex-row bg-oat-50 min-h-screen">
          <AdminSidebar
            currentTab={adminTab}
            onSelectTab={setAdminTab}
            onLogout={() => {
              setIsAdminLoggedIn(false);
              setAppMode('customer');
            }}
            onReturnToCustomer={() => setAppMode('customer')}
          />

          <main className="flex-1 overflow-y-auto pb-12 w-full min-w-0">
            {adminTab === 'dashboard' && <DashboardView onNavigateTab={setAdminTab} />}
            {adminTab === 'pos' && <PosView />}
            {adminTab === 'orders' && <OrderManagementView />}
            {adminTab === 'menus' && <MenuManagementView />}
            {adminTab === 'categories' && <CategoryManagementView />}
            {adminTab === 'tables' && <TableManagementView />}
            {adminTab === 'reports' && <ReportsView />}
          </main>
        </div>
      )}

      {/* Admin Login Modal Guard */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onLoginSuccess={() => {
          setIsAdminLoggedIn(true);
          setIsLoginModalOpen(false);
          setAppMode('admin');
        }}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
}
