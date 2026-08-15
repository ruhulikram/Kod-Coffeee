import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  Coffee,
  ShoppingBag,
  UtensilsCrossed,
  DollarSign,
  QrCode,
  CreditCard,
  Printer,
  CheckCircle2,
  X,
  Sparkles,
  RotateCcw,
  Receipt,
  User,
  MessageSquareQuote,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { MenuItem, PaymentMethod, Order } from '../../types';
import { formatRupiah, formatDateTime } from '../../utils/formatters';

interface PosCartItem {
  menu: MenuItem;
  quantity: number;
  notes: string;
}

export const PosView: React.FC = () => {
  const { menus, categories, tables, createPosOrder } = useStore();

  // Filter states
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // POS Order Form states
  const [orderType, setOrderType] = useState<'dine_in' | 'takeaway'>('dine_in');
  const [selectedTableId, setSelectedTableId] = useState<string>(tables[0]?.id || '');
  const [customerName, setCustomerName] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [posCart, setPosCart] = useState<PosCartItem[]>([]);

  // Payment & Receipt Modals
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('cash');
  const [cashReceived, setCashReceived] = useState<number>(0);
  const [customCashInput, setCustomCashInput] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Success / Receipt Modal
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  // Filtered menu items
  const filteredMenus = useMemo(() => {
    return menus.filter((item) => {
      if (!item.is_available) return false;
      if (selectedCategoryId && item.category_id !== selectedCategoryId) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchNotes = item.taste_notes?.toLowerCase().includes(q);
        if (!matchName && !matchDesc && !matchNotes) return false;
      }
      return true;
    });
  }, [menus, selectedCategoryId, searchQuery]);

  // Cart calculations
  const subtotal = useMemo(() => {
    return posCart.reduce((acc, item) => acc + item.menu.price * item.quantity, 0);
  }, [posCart]);

  const tax = useMemo(() => Math.round(subtotal * 0.1), [subtotal]); // PB1 10%
  const service = useMemo(() => Math.round(subtotal * 0.05), [subtotal]); // Service 5%
  const grandTotal = useMemo(() => subtotal + tax + service, [subtotal, tax, service]);
  const totalItemsCount = useMemo(() => posCart.reduce((acc, item) => acc + item.quantity, 0), [posCart]);

  // Calculate change
  const currentCashAmount = customCashInput ? parseInt(customCashInput, 10) || 0 : cashReceived;
  const changeAmount = Math.max(0, currentCashAmount - grandTotal);
  const isCashSufficient = currentCashAmount >= grandTotal;

  // Cart operations
  const addToCart = (menu: MenuItem) => {
    setPosCart((prev) => {
      const existing = prev.find((item) => item.menu.id === menu.id);
      if (existing) {
        return prev.map((item) =>
          item.menu.id === menu.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { menu, quantity: 1, notes: '' }];
    });
  };

  const updateQuantity = (menuId: string, delta: number) => {
    setPosCart((prev) => {
      return prev
        .map((item) => {
          if (item.menu.id === menuId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as PosCartItem[];
    });
  };

  const updateItemNotes = (menuId: string, notes: string) => {
    setPosCart((prev) =>
      prev.map((item) => (item.menu.id === menuId ? { ...item, notes } : item))
    );
  };

  const removeItem = (menuId: string) => {
    setPosCart((prev) => prev.filter((item) => item.menu.id !== menuId));
  };

  const clearAll = () => {
    if (posCart.length === 0) return;
    if (confirm('Kosongkan semua pesanan di tiket kasir saat ini?')) {
      setPosCart([]);
      setCustomerName('');
      setOrderNotes('');
    }
  };

  // Open Payment dialog
  const handleOpenPayment = (method: PaymentMethod) => {
    if (posCart.length === 0) return;
    setSelectedPaymentMethod(method);
    setCashReceived(grandTotal); // default to exact amount
    setCustomCashInput(grandTotal.toString());
    setIsPaymentModalOpen(true);
  };

  // Set quick cash preset
  const setQuickCash = (amount: number) => {
    setCashReceived(amount);
    setCustomCashInput(amount.toString());
  };

  // Process Final Order Creation
  const handleCompleteTransaction = async () => {
    if (posCart.length === 0 || isSubmitting) return;

    if (selectedPaymentMethod === 'cash' && !isCashSufficient) {
      alert('Jumlah uang tunai yang diterima masih kurang!');
      return;
    }

    try {
      setIsSubmitting(true);
      const newOrder = await createPosOrder({
        items: posCart,
        orderType,
        tableId: orderType === 'dine_in' ? selectedTableId : undefined,
        customerName: customerName.trim() || undefined,
        notes: orderNotes.trim() || undefined,
        paymentMethod: selectedPaymentMethod,
        cashReceived: selectedPaymentMethod === 'cash' ? currentCashAmount : undefined,
        changeAmount: selectedPaymentMethod === 'cash' ? changeAmount : undefined,
      });

      setCompletedOrder(newOrder);
      setIsPaymentModalOpen(false);
      setIsReceiptOpen(true);

      // Reset cart
      setPosCart([]);
      setCustomerName('');
      setOrderNotes('');
    } catch (err: any) {
      alert(`Gagal memproses pesanan: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4">
      {/* Top POS Header */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-espresso-100 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-espresso-950 text-crema flex items-center justify-center font-extrabold shadow-sm">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-espresso-950 font-display">
                Kasir POS (Point of Sale)
              </h1>
              <span className="bg-brew-light text-brew text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-brew/20">
                LIVE TERMINAL
              </span>
            </div>
            <p className="text-xs text-espresso-500 mt-0.5">
              Input pesanan walk-in langsung untuk Dine In (Meja) dan Takeaway (Bungkus).
            </p>
          </div>
        </div>

        {/* Quick Shift Bar */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="px-3 py-1.5 rounded-xl bg-oat-50 border border-espresso-100 text-xs font-semibold text-espresso-700 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-brew animate-pulse" />
            <span>Kasir Utama (Shift 1)</span>
          </div>
          {posCart.length > 0 && (
            <button
              onClick={clearAll}
              className="px-3 py-1.5 rounded-xl border border-ember/30 text-ember-dark hover:bg-ember-light/20 text-xs font-bold transition-all flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Tiket</span>
            </button>
          )}
        </div>
      </div>

      {/* Main 2-Column POS Layout (Optimized for iPad Horizontal & Desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Menu Catalog & Categories (7 cols on lg / iPad landscape) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Search & Category Pills */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-espresso-100 shadow-subtle space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-espresso-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama kopi, makanan, atau rasa (misal: caramel, oat)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-oat-50 rounded-2xl border border-espresso-100 text-xs md:text-sm text-espresso-950 font-medium placeholder-espresso-400 focus:outline-none focus:ring-2 focus:ring-crema focus:border-crema transition-all"
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

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <button
                onClick={() => setSelectedCategoryId(null)}
                className={`px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold shrink-0 transition-all ${
                  selectedCategoryId === null
                    ? 'bg-espresso-950 text-crema shadow-sm'
                    : 'bg-oat-100 text-espresso-700 hover:bg-oat-200'
                }`}
              >
                Semua ({menus.filter((m) => m.is_available).length})
              </button>
              {categories.map((cat) => {
                const count = menus.filter((m) => m.category_id === cat.id && m.is_available).length;
                const isSelected = selectedCategoryId === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategoryId(cat.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold shrink-0 transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-espresso-950 text-crema shadow-sm'
                        : 'bg-oat-100 text-espresso-700 hover:bg-oat-200'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span
                      className={`text-[10px] md:text-xs px-1.5 py-0.2 rounded-full ${
                        isSelected ? 'bg-espresso-800 text-white font-extrabold' : 'bg-white text-espresso-600'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Menu Items Grid - 2 col on phone, 3 col on iPad, 3/4 col on desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-3 gap-3.5">
            {filteredMenus.map((menu) => {
              const inCart = posCart.find((item) => item.menu.id === menu.id);
              return (
                <div
                  key={menu.id}
                  onClick={() => addToCart(menu)}
                  className={`group relative bg-white rounded-3xl p-3.5 border transition-all cursor-pointer select-none hover:shadow-md active:scale-98 flex flex-col justify-between ${
                    inCart
                      ? 'border-espresso-950 ring-2 ring-espresso-950/20 bg-espresso-50/40'
                      : 'border-espresso-100 hover:border-espresso-300'
                  }`}
                >
                  <div>
                    <div className="relative aspect-video rounded-2xl overflow-hidden mb-2.5 bg-oat-100">
                      <img
                        src={menu.image}
                        alt={menu.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      {menu.is_signature && (
                        <span className="absolute top-2 left-2 bg-espresso-950/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          <span>Fav</span>
                        </span>
                      )}
                      {inCart && (
                        <span className="absolute top-2 right-2 bg-espresso-950 text-white text-xs font-black w-7 h-7 rounded-full flex items-center justify-center shadow-lg animate-fade-in">
                          {inCart.quantity}
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-xs md:text-sm text-espresso-950 line-clamp-1 font-display">
                      {menu.name}
                    </h3>
                    <p className="text-[10px] md:text-xs text-espresso-400 line-clamp-1 mt-0.5">
                      {menu.taste_notes || menu.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-espresso-50">
                    <span className="text-xs md:text-sm font-black text-espresso-900 font-display">
                      {formatRupiah(menu.price)}
                    </span>
                    <button
                      type="button"
                      className="w-7 h-7 md:w-8 md:h-8 rounded-xl bg-espresso-900 group-hover:bg-espresso-950 text-white flex items-center justify-center shadow-sm active:scale-95 transition-transform"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredMenus.length === 0 && (
            <div className="bg-white rounded-3xl p-8 text-center border border-espresso-100">
              <Coffee className="w-8 h-8 text-espresso-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-espresso-700">Tidak ada menu yang sesuai</p>
              <p className="text-[11px] text-espresso-400 mt-0.5">
                Coba ubah kata kunci pencarian atau pilih kategori lain.
              </p>
            </div>
          )}
        </div>

        {/* Right Column: POS Active Ticket / Slip (5 cols on lg / iPad - fixed viewport height) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-4 sm:p-5 border border-espresso-100 shadow-subtle flex flex-col justify-between lg:sticky lg:top-14 h-auto lg:h-[calc(100vh-90px)]">
          {/* Top Form Header */}
          <div className="space-y-3 pb-3 border-b border-espresso-100">
            <div className="flex items-center justify-between">
              <span className="text-xs md:text-sm font-extrabold text-espresso-900 font-display uppercase tracking-wider flex items-center gap-1.5">
                <Receipt className="w-4 h-4 text-crema-600" />
                <span>Tiket Pesanan Kasir</span>
              </span>
              <span className="text-xs font-bold text-espresso-600 bg-oat-100 px-2.5 py-1 rounded-xl">
                {totalItemsCount} Item
              </span>
            </div>

            {/* Order Type Toggle (Dine In vs Takeaway) */}
            <div className="grid grid-cols-2 gap-1.5 bg-oat-100 p-1.5 rounded-2xl">
              <button
                onClick={() => setOrderType('dine_in')}
                className={`py-2 px-3 rounded-xl text-xs md:text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  orderType === 'dine_in'
                    ? 'bg-espresso-950 text-crema shadow-sm'
                    : 'text-espresso-600 hover:text-espresso-900'
                }`}
              >
                <UtensilsCrossed className="w-3.5 h-3.5" />
                <span>Dine In (Meja)</span>
              </button>
              <button
                onClick={() => setOrderType('takeaway')}
                className={`py-2 px-3 rounded-xl text-xs md:text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  orderType === 'takeaway'
                    ? 'bg-espresso-950 text-crema shadow-sm'
                    : 'text-espresso-600 hover:text-espresso-900'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Takeaway (Bungkus)</span>
              </button>
            </div>

            {/* If Dine In: iPad Touch-Friendly Table Dropdown */}
            {orderType === 'dine_in' ? (
              <div>
                <label className="block text-[11px] font-bold text-espresso-700 mb-1">
                  Pilih Meja Customer:
                </label>
                <div className="relative">
                  <select
                    value={selectedTableId}
                    onChange={(e) => setSelectedTableId(e.target.value)}
                    className="w-full appearance-none pl-3.5 pr-9 py-2.5 bg-oat-50 border border-espresso-200 rounded-2xl text-xs md:text-sm font-bold text-espresso-900 focus:outline-none focus:ring-2 focus:ring-crema cursor-pointer"
                  >
                    {tables.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.table_number} — ({t.status === 'occupied' ? '● Sedang Terisi' : '✓ Tersedia'})
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-espresso-500">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-2.5 rounded-2xl bg-crema-50/60 border border-crema-200 text-xs text-espresso-700 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-crema-600 shrink-0" />
                <span>Pesanan akan dikemas takeaway / cup to-go untuk dibawa pulang.</span>
              </div>
            )}

            {/* Customer Name Input */}
            <div className="relative">
              <User className="w-3.5 h-3.5 text-espresso-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Nama Pelanggan (opsional)..."
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-oat-50 border border-espresso-100 rounded-xl text-xs md:text-sm text-espresso-900 font-medium placeholder-espresso-400 focus:outline-none focus:ring-1 focus:ring-crema"
              />
            </div>
          </div>

          {/* Cart Item List (Scrollable Area) */}
          <div className="flex-1 overflow-y-auto my-2 space-y-2 pr-1 divide-y divide-espresso-50 min-h-[140px] max-h-[280px] lg:max-h-none">
            {posCart.map((item) => (
              <div key={item.menu.id} className="pt-2.5 first:pt-0 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-xs md:text-sm text-espresso-950 truncate">
                      {item.menu.name}
                    </h4>
                    <span className="text-[11px] md:text-xs text-espresso-500 font-display font-semibold">
                      {formatRupiah(item.menu.price)}
                    </span>
                  </div>

                  {/* iPad Touch-Friendly Stepper Buttons */}
                  <div className="flex items-center gap-1 bg-oat-100 rounded-xl p-1 border border-espresso-100">
                    <button
                      onClick={() => updateQuantity(item.menu.id, -1)}
                      className="w-7 h-7 rounded-lg bg-white text-espresso-800 hover:bg-espresso-900 hover:text-white flex items-center justify-center shadow-xs transition-colors active:scale-95"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-7 text-center text-xs md:text-sm font-black text-espresso-950">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.menu.id, 1)}
                      className="w-7 h-7 rounded-lg bg-white text-espresso-800 hover:bg-espresso-900 hover:text-white flex items-center justify-center shadow-xs transition-colors active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Item Subtotal */}
                  <span className="font-black text-xs md:text-sm text-espresso-900 font-display w-20 text-right">
                    {formatRupiah(item.menu.price * item.quantity)}
                  </span>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.menu.id)}
                    className="text-espresso-300 hover:text-ember-dark p-1.5 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Optional Note */}
                <div className="flex items-center gap-1.5">
                  <MessageSquareQuote className="w-3.5 h-3.5 text-espresso-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Catatan (misal: Less ice, gula aren 50%)..."
                    value={item.notes}
                    onChange={(e) => updateItemNotes(item.menu.id, e.target.value)}
                    className="w-full text-[11px] bg-oat-50/70 border border-espresso-100 rounded-lg px-2.5 py-1 text-espresso-700 placeholder-espresso-400 focus:outline-none focus:ring-1 focus:ring-crema"
                  />
                </div>
              </div>
            ))}

            {posCart.length === 0 && (
              <div className="py-10 text-center text-espresso-400 space-y-1.5">
                <Coffee className="w-8 h-8 mx-auto text-espresso-300 mb-1" />
                <p className="text-xs font-bold text-espresso-700">Tiket kasir masih kosong</p>
                <p className="text-[11px]">Sentuh menu di katalog untuk menambahkan ke tiket</p>
              </div>
            )}
          </div>

          {/* Bottom Billing & Action Footer */}
          <div className="space-y-3 pt-2 border-t border-dashed border-espresso-200">
            {/* Pricing Breakdown */}
            <div className="space-y-1 text-xs text-espresso-600">
              <div className="flex justify-between">
                <span>Subtotal Item</span>
                <span className="font-bold text-espresso-900 font-display">{formatRupiah(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span>Pajak Resto PB1 (10%)</span>
                <span className="font-medium">{formatRupiah(tax)}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span>Biaya Layanan Service (5%)</span>
                <span className="font-medium">{formatRupiah(service)}</span>
              </div>
              <div className="flex justify-between items-center text-sm md:text-base font-extrabold text-espresso-950 pt-1.5 border-t border-espresso-100">
                <span className="font-display">Total Tagihan</span>
                <span className="text-lg md:text-xl font-black text-espresso-950 font-display text-crema-800">
                  {formatRupiah(grandTotal)}
                </span>
              </div>
            </div>

            {/* iPad Touch-Friendly Payment Buttons */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                disabled={posCart.length === 0}
                onClick={() => handleOpenPayment('cash')}
                className="py-3.5 md:py-4 rounded-2xl bg-espresso-950 hover:bg-espresso-900 disabled:opacity-40 text-white font-extrabold text-xs md:text-xs flex flex-col items-center justify-center gap-1 shadow-md transition-all active:scale-95"
              >
                <DollarSign className="w-4 h-4 text-crema" />
                <span>Tunai (Cash)</span>
              </button>

              <button
                disabled={posCart.length === 0}
                onClick={() => handleOpenPayment('qris')}
                className="py-3.5 md:py-4 rounded-2xl bg-crema-100 hover:bg-crema-200 disabled:opacity-40 text-crema-900 font-extrabold text-xs md:text-xs flex flex-col items-center justify-center gap-1 border border-crema-300 shadow-sm transition-all active:scale-95"
              >
                <QrCode className="w-4 h-4 text-crema-800" />
                <span>QRIS Instant</span>
              </button>

              <button
                disabled={posCart.length === 0}
                onClick={() => handleOpenPayment('debit')}
                className="py-3.5 md:py-4 rounded-2xl bg-indigo-50 hover:bg-indigo-100 disabled:opacity-40 text-indigo-900 font-extrabold text-xs md:text-xs flex flex-col items-center justify-center gap-1 border border-indigo-200 shadow-sm transition-all active:scale-95"
              >
                <CreditCard className="w-4 h-4 text-indigo-700" />
                <span>Debit / EDC</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: PROSES PEMBAYARAN KASIR (CASH / QRIS / DEBIT)                    */}
      {/* ========================================================================= */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 bg-espresso-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-espresso-100 shadow-floating space-y-5">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-espresso-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-espresso-950 text-crema flex items-center justify-center font-bold">
                  {selectedPaymentMethod === 'cash' ? (
                    <DollarSign className="w-5 h-5" />
                  ) : selectedPaymentMethod === 'qris' ? (
                    <QrCode className="w-5 h-5" />
                  ) : (
                    <CreditCard className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-espresso-950 font-display">
                    {selectedPaymentMethod === 'cash'
                      ? 'Pembayaran Tunai (Cash)'
                      : selectedPaymentMethod === 'qris'
                      ? 'Pembayaran QRIS Kasir'
                      : 'Pembayaran Kartu Debit / EDC'}
                  </h3>
                  <p className="text-xs text-espresso-500">
                    {orderType === 'dine_in'
                      ? `Dine In - Meja ${tables.find((t) => t.id === selectedTableId)?.table_number || '?'}`
                      : 'Takeaway (Bungkus)'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="p-1 rounded-xl text-espresso-400 hover:text-espresso-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Total Tagihan Box */}
            <div className="bg-oat-50 p-4 rounded-2xl border border-espresso-100 flex items-center justify-between">
              <span className="text-xs font-bold text-espresso-600">Total Yang Harus Dibayar:</span>
              <span className="text-xl font-black text-espresso-950 font-display">
                {formatRupiah(grandTotal)}
              </span>
            </div>

            {/* Tab Method Switcher in Modal */}
            <div className="grid grid-cols-3 gap-1.5 bg-oat-100 p-1 rounded-xl">
              <button
                onClick={() => setSelectedPaymentMethod('cash')}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                  selectedPaymentMethod === 'cash'
                    ? 'bg-espresso-950 text-crema'
                    : 'text-espresso-600 hover:text-espresso-900'
                }`}
              >
                Tunai
              </button>
              <button
                onClick={() => setSelectedPaymentMethod('qris')}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                  selectedPaymentMethod === 'qris'
                    ? 'bg-espresso-950 text-crema'
                    : 'text-espresso-600 hover:text-espresso-900'
                }`}
              >
                QRIS
              </button>
              <button
                onClick={() => setSelectedPaymentMethod('debit')}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                  selectedPaymentMethod === 'debit'
                    ? 'bg-espresso-950 text-crema'
                    : 'text-espresso-600 hover:text-espresso-900'
                }`}
              >
                Debit / EDC
              </button>
            </div>

            {/* IF CASH: Calculator & Presets */}
            {selectedPaymentMethod === 'cash' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-espresso-700 mb-1.5">
                    Nominal Uang Diterima dari Pelanggan:
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-espresso-400">
                      Rp
                    </span>
                    <input
                      type="number"
                      value={customCashInput}
                      onChange={(e) => setCustomCashInput(e.target.value)}
                      placeholder="0"
                      className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-espresso-200 text-lg font-black text-espresso-950 focus:outline-none focus:ring-2 focus:ring-crema font-display"
                    />
                  </div>
                </div>

                {/* Quick Banknote Presets */}
                <div className="grid grid-cols-4 gap-2">
                  <button
                    onClick={() => setQuickCash(grandTotal)}
                    className="py-2.5 md:py-3 px-1 rounded-2xl bg-oat-100 hover:bg-espresso-950 hover:text-crema text-espresso-800 text-xs md:text-sm font-bold transition-all text-center border border-espresso-200 active:scale-95 shadow-xs"
                  >
                    Uang Pas
                  </button>
                  <button
                    onClick={() => setQuickCash(50000)}
                    className="py-2.5 md:py-3 px-1 rounded-2xl bg-oat-100 hover:bg-espresso-950 hover:text-crema text-espresso-800 text-xs md:text-sm font-bold transition-all text-center border border-espresso-200 active:scale-95 shadow-xs"
                  >
                    50.000
                  </button>
                  <button
                    onClick={() => setQuickCash(100000)}
                    className="py-2.5 md:py-3 px-1 rounded-2xl bg-oat-100 hover:bg-espresso-950 hover:text-crema text-espresso-800 text-xs md:text-sm font-bold transition-all text-center border border-espresso-200 active:scale-95 shadow-xs"
                  >
                    100.000
                  </button>
                  <button
                    onClick={() => setQuickCash(200000)}
                    className="py-2.5 md:py-3 px-1 rounded-2xl bg-oat-100 hover:bg-espresso-950 hover:text-crema text-espresso-800 text-xs md:text-sm font-bold transition-all text-center border border-espresso-200 active:scale-95 shadow-xs"
                  >
                    200.000
                  </button>
                </div>

                {/* Kembalian Box */}
                <div
                  className={`p-4 rounded-2xl border flex items-center justify-between transition-colors ${
                    isCashSufficient
                      ? 'bg-brew-light/40 border-brew/30 text-brew'
                      : 'bg-ember-light/40 border-ember/30 text-ember-dark'
                  }`}
                >
                  <span className="text-xs md:text-sm font-bold">
                    {isCashSufficient ? 'Uang Kembalian:' : 'Uang Masih Kurang:'}
                  </span>
                  <span className="text-xl md:text-2xl font-black font-display">
                    {isCashSufficient
                      ? formatRupiah(changeAmount)
                      : formatRupiah(grandTotal - currentCashAmount)}
                  </span>
                </div>
              </div>
            )}

            {/* IF QRIS: Instant Code Scan */}
            {selectedPaymentMethod === 'qris' && (
              <div className="text-center p-4 bg-oat-50 rounded-2xl border border-espresso-100 space-y-3">
                <div className="w-40 h-40 bg-white p-2.5 rounded-2xl mx-auto border border-espresso-200 shadow-sm flex items-center justify-center">
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=00020101021226580014ID.LINKAJA.WWW011893600911002209121202150000000000000005204581253033605802ID5910KOD_COFFEE6007BANDUNG61054011562070703A01630489F3"
                    alt="QRIS Kod Coffee"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-xs">
                  <p className="font-bold text-espresso-950">Scan QRIS Dinamis</p>
                  <p className="text-espresso-500 text-[11px]">
                    Pelanggan dapat scan dengan GoPay, OVO, ShopeePay, BCA, Livin Mandiri
                  </p>
                </div>
              </div>
            )}

            {/* IF DEBIT: Terminal Prompt */}
            {selectedPaymentMethod === 'debit' && (
              <div className="text-center p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 space-y-2">
                <CreditCard className="w-10 h-10 text-indigo-700 mx-auto" />
                <p className="text-xs font-bold text-indigo-950">Silakan Gesek / Dip Kartu di Mesin EDC</p>
                <p className="text-[11px] text-indigo-600">
                  Pastikan struk EDC keluar sebelum menyelesaikan pesanan ini.
                </p>
              </div>
            )}

            {/* Confirm & Submit */}
            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPaymentModalOpen(false)}
                className="w-1/3 py-3 rounded-2xl border border-espresso-200 text-espresso-700 hover:bg-espresso-50 font-bold text-xs transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isSubmitting || (selectedPaymentMethod === 'cash' && !isCashSufficient)}
                onClick={handleCompleteTransaction}
                className="w-2/3 py-3 rounded-2xl bg-espresso-950 hover:bg-espresso-900 disabled:opacity-50 text-crema font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSubmitting ? 'Memproses...' : 'Selesaikan & Cetak Struk'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: CETAK STRUK KASIR TERMAL (RECEIPT 58mm / 80mm)                    */}
      {/* ========================================================================= */}
      {isReceiptOpen && completedOrder && (
        <div className="fixed inset-0 z-50 bg-espresso-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 border border-espresso-100 shadow-floating space-y-5">
            {/* Header Dialog */}
            <div className="flex items-center justify-between pb-2 border-b border-espresso-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-brew" />
                <h3 className="font-extrabold text-sm text-espresso-950">Transaksi Berhasil!</h3>
              </div>
              <button
                onClick={() => setIsReceiptOpen(false)}
                className="p-1 rounded-xl text-espresso-400 hover:text-espresso-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Thermal Receipt Paper Layout (58mm style) */}
            <div className="bg-oat-50 p-5 rounded-2xl border border-espresso-200 font-mono text-[11px] text-espresso-900 space-y-3 shadow-inner">
              {/* Receipt Header */}
              <div className="text-center space-y-0.5 pb-2 border-b border-dashed border-espresso-300">
                <h2 className="font-black text-sm tracking-wider font-display">KOD COFFEE</h2>
                <p className="text-[10px] text-espresso-500">Artisan Coffee & Eatery</p>
                <p className="text-[9px] text-espresso-400">Jl. Kopi Sejahtera No. 88, Bandung</p>
                <p className="text-[9px] text-espresso-400">Telp: 0812-3456-7890</p>
              </div>

              {/* Order Metadata */}
              <div className="text-[10px] space-y-0.5 border-b border-dashed border-espresso-300 pb-2">
                <div className="flex justify-between">
                  <span>No. Order:</span>
                  <span className="font-bold">{completedOrder.order_number}</span>
                </div>
                <div className="flex justify-between">
                  <span>Waktu:</span>
                  <span>{formatDateTime(completedOrder.created_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Kasir:</span>
                  <span>Kasir 01 (Shift Pagi)</span>
                </div>
                <div className="flex justify-between">
                  <span>Tipe:</span>
                  <span className="font-bold uppercase">
                    {completedOrder.order_type === 'takeaway'
                      ? 'Takeaway / Bungkus'
                      : `Dine In (${completedOrder.table?.table_number || 'Meja'})`}
                  </span>
                </div>
                {completedOrder.customer_name && (
                  <div className="flex justify-between">
                    <span>Pelanggan:</span>
                    <span>{completedOrder.customer_name}</span>
                  </div>
                )}
              </div>

              {/* Items List */}
              <div className="space-y-1 border-b border-dashed border-espresso-300 pb-2">
                {completedOrder.items.map((item) => (
                  <div key={item.id}>
                    <div className="flex justify-between font-bold">
                      <span>{item.menu_name}</span>
                      <span>{formatRupiah(item.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-espresso-500">
                      <span>
                        {item.quantity} x {formatRupiah(item.price)}
                      </span>
                      {item.notes && <span className="italic text-[9px]">({item.notes})</span>}
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Calculation */}
              <div className="space-y-0.5 text-[10px] border-b border-dashed border-espresso-300 pb-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatRupiah(completedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>PB1 (10%):</span>
                  <span>{formatRupiah(completedOrder.tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service (5%):</span>
                  <span>{formatRupiah(completedOrder.service_charge)}</span>
                </div>
                <div className="flex justify-between font-black text-xs pt-1 text-espresso-950">
                  <span>TOTAL:</span>
                  <span>{formatRupiah(completedOrder.total)}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span>Metode:</span>
                  <span className="uppercase font-bold">
                    {completedOrder.payment?.payment_method || 'TUNAI'}
                  </span>
                </div>
                {completedOrder.payment?.cash_received !== undefined && (
                  <>
                    <div className="flex justify-between">
                      <span>Tunai Diterima:</span>
                      <span>{formatRupiah(completedOrder.payment.cash_received)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-brew">
                      <span>Kembalian:</span>
                      <span>{formatRupiah(completedOrder.payment.change_amount || 0)}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Footer Notice */}
              <div className="text-center text-[9px] text-espresso-400 pt-1 space-y-0.5">
                <p>Terima kasih atas kunjungan Anda!</p>
                <p>Follow IG: @kodcoffee.id</p>
                <p>WiFi: KodCoffee_Guest / sandi: kopiseduhnikmat</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={() => window.print()}
                className="w-full py-3 rounded-2xl bg-espresso-950 hover:bg-espresso-900 text-crema font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Struk Thermal (Print)</span>
              </button>

              <button
                onClick={() => {
                  setIsReceiptOpen(false);
                  setCompletedOrder(null);
                }}
                className="w-full py-2.5 rounded-2xl border border-espresso-200 text-espresso-700 hover:bg-espresso-50 font-bold text-xs transition-colors text-center"
              >
                Buat Pesanan Kasir Baru
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
