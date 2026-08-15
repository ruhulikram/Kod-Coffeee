import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Table,
  Category,
  MenuItem,
  Order,
  CartItem,
  OrderStatus,
  PaymentMethod,
  TableStatus,
} from '../types';
import {
  INITIAL_TABLES,
  INITIAL_CATEGORIES,
  INITIAL_MENUS,
  INITIAL_ORDERS,
} from '../data/initialData';

interface StoreContextType {
  tables: Table[];
  categories: Category[];
  menus: MenuItem[];
  orders: Order[];
  currentTable: Table | null;
  setCurrentTable: (table: Table | null) => void;
  setTableByToken: (token: string) => boolean;
  
  // Cart
  cart: CartItem[];
  addToCart: (menu: MenuItem, quantity?: number, notes?: string) => void;
  removeFromCart: (menuId: string) => void;
  updateCartQuantity: (menuId: string, delta: number) => void;
  updateCartNotes: (menuId: string, notes: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartTax: number;
  cartService: number;
  cartTotal: number;
  cartCount: number;

  // Order & Payment
  createOrder: (customerName?: string, customerPhone?: string, notes?: string) => Promise<Order>;
  createPosOrder: (params: {
    items: { menu: MenuItem; quantity: number; notes?: string }[];
    orderType: 'dine_in' | 'takeaway';
    tableId?: string;
    customerName?: string;
    customerPhone?: string;
    notes?: string;
    paymentMethod: PaymentMethod;
    cashReceived?: number;
    changeAmount?: number;
  }) => Promise<Order>;
  processPayment: (orderId: string, method: PaymentMethod) => Promise<boolean>;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  getOrderById: (orderId: string) => Order | undefined;
  getOrderByNumber: (orderNumber: string) => Order | undefined;

  // Admin Management
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  toggleMenuAvailability: (id: string) => void;

  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  updateTableStatus: (id: string, status: TableStatus) => void;
  regenerateTableQR: (id: string) => void;
  
  // Audio notification trigger
  playChime: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  TABLES: 'kod_coffee_tables',
  CATEGORIES: 'kod_coffee_categories',
  MENUS: 'kod_coffee_menus',
  ORDERS: 'kod_coffee_orders',
  CURRENT_TABLE: 'kod_coffee_current_table',
  CART: 'kod_coffee_cart',
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from localStorage or defaults
  const [tables, setTables] = useState<Table[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TABLES);
    return saved ? JSON.parse(saved) : INITIAL_TABLES;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [menus, setMenus] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MENUS);
    return saved ? JSON.parse(saved) : INITIAL_MENUS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [currentTable, setCurrentTableState] = useState<Table | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_TABLE);
    return saved ? JSON.parse(saved) : INITIAL_TABLES[0]; // Default to Table 01 for easy preview
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CART);
    return saved ? JSON.parse(saved) : [];
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(tables));
  }, [tables]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MENUS, JSON.stringify(menus));
  }, [menus]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    if (currentTable) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_TABLE, JSON.stringify(currentTable));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_TABLE);
    }
  }, [currentTable]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  const setCurrentTable = (table: Table | null) => {
    setCurrentTableState(table);
  };

  const setTableByToken = (token: string): boolean => {
    const found = tables.find((t) => t.qr_token === token || t.id === token || t.table_number.toLowerCase().replace(/\s+/g, '') === token.toLowerCase().replace(/\s+/g, ''));
    if (found) {
      setCurrentTableState(found);
      return true;
    }
    return false;
  };

  const playChime = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch {
      // Audio context might be restricted before user interaction
    }
  };

  // Cart operations
  const addToCart = (menu: MenuItem, quantity: number = 1, notes: string = '') => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.menu.id === menu.id && item.notes === notes);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, { menu, quantity, notes }];
    });
  };

  const removeFromCart = (menuId: string) => {
    setCart((prev) => prev.filter((item) => item.menu.id !== menuId));
  };

  const updateCartQuantity = (menuId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.menu.id === menuId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const updateCartNotes = (menuId: string, notes: string) => {
    setCart((prev) =>
      prev.map((item) => (item.menu.id === menuId ? { ...item, notes } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartSubtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.menu.price * item.quantity, 0);
  }, [cart]);

  const cartTax = useMemo(() => Math.round(cartSubtotal * 0.1), [cartSubtotal]); // 10% PB1
  const cartService = useMemo(() => Math.round(cartSubtotal * 0.05), [cartSubtotal]); // 5% Service
  const cartTotal = useMemo(() => cartSubtotal + cartTax + cartService, [cartSubtotal, cartTax, cartService]);
  const cartCount = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart]);

  // Order operations
  const createOrder = async (
    customerName?: string,
    customerPhone?: string,
    notes?: string
  ): Promise<Order> => {
    if (!currentTable) {
      throw new Error('Table context is missing. Please scan a table QR code.');
    }
    if (cart.length === 0) {
      throw new Error('Cart is empty.');
    }

    const orderSeq = orders.length + 1001;
    const orderNumber = `ORD-${orderSeq}`;
    const orderId = `ord-${Date.now()}`;

    const newOrder: Order = {
      id: orderId,
      order_number: orderNumber,
      table_id: currentTable.id,
      customer_name: customerName || 'Guest',
      customer_phone: customerPhone || '',
      subtotal: cartSubtotal,
      tax: cartTax,
      service_charge: cartService,
      total: cartTotal,
      order_status: 'pending_payment',
      notes: notes || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      items: cart.map((item, idx) => ({
        id: `item-${Date.now()}-${idx}`,
        order_id: orderId,
        menu_id: item.menu.id,
        menu_name: item.menu.name,
        price: item.menu.price,
        quantity: item.quantity,
        notes: item.notes,
        subtotal: item.menu.price * item.quantity,
        image: item.menu.image,
      })),
      table: currentTable,
    };

    // Mark table as occupied
    updateTableStatus(currentTable.id, 'occupied');

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const createPosOrder = async (params: {
    items: { menu: MenuItem; quantity: number; notes?: string }[];
    orderType: 'dine_in' | 'takeaway';
    tableId?: string;
    customerName?: string;
    customerPhone?: string;
    notes?: string;
    paymentMethod: PaymentMethod;
    cashReceived?: number;
    changeAmount?: number;
  }): Promise<Order> => {
    if (params.items.length === 0) {
      throw new Error('Keranjang kasir kosong.');
    }

    const targetTable =
      params.orderType === 'dine_in' && params.tableId
        ? tables.find((t) => t.id === params.tableId) || null
        : null;

    const subtotal = params.items.reduce((acc, item) => acc + item.menu.price * item.quantity, 0);
    const tax = Math.round(subtotal * 0.1);
    const service_charge = Math.round(subtotal * 0.05);
    const total = subtotal + tax + service_charge;

    const orderSeq = orders.length + 1001;
    const orderNumber = `POS-${orderSeq}`;
    const orderId = `pos-${Date.now()}`;

    const payment = {
      id: `pay-${Date.now()}`,
      order_id: orderId,
      provider: params.paymentMethod === 'cash' ? 'cashier_drawer' : `${params.paymentMethod}_pos`,
      transaction_id: `${params.paymentMethod.toUpperCase()}-POS-${Math.floor(100000 + Math.random() * 900000)}`,
      payment_method: params.paymentMethod,
      amount: total,
      status: 'paid' as const,
      cash_received: params.cashReceived,
      change_amount: params.changeAmount,
      paid_at: new Date().toISOString(),
      raw_response: { message: 'POS transaction completed', cashier: 'Kasir Utama', timestamp: Date.now() },
    };

    const newOrder: Order = {
      id: orderId,
      order_number: orderNumber,
      table_id: targetTable ? targetTable.id : 'takeaway',
      order_type: params.orderType,
      customer_name: params.customerName || (params.orderType === 'takeaway' ? 'Walk-in Takeaway' : 'Walk-in Kasir'),
      customer_phone: params.customerPhone || '',
      subtotal,
      tax,
      service_charge,
      total,
      order_status: 'paid',
      notes: params.notes || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      items: params.items.map((item, idx) => ({
        id: `item-pos-${Date.now()}-${idx}`,
        order_id: orderId,
        menu_id: item.menu.id,
        menu_name: item.menu.name,
        price: item.menu.price,
        quantity: item.quantity,
        notes: item.notes || '',
        subtotal: item.menu.price * item.quantity,
        image: item.menu.image,
      })),
      payment,
      table: targetTable || undefined,
    };

    if (targetTable) {
      updateTableStatus(targetTable.id, 'occupied');
    }

    setOrders((prev) => [newOrder, ...prev]);
    playChime();
    return newOrder;
  };

  const processPayment = async (orderId: string, method: PaymentMethod): Promise<boolean> => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return false;

    // Simulate payment transaction
    const payment = {
      id: `pay-${Date.now()}`,
      order_id: orderId,
      provider: `${method}_gateway`,
      transaction_id: `${method.toUpperCase()}-TX-${Math.floor(100000 + Math.random() * 900000)}`,
      payment_method: method,
      amount: targetOrder.total,
      status: 'paid' as const,
      paid_at: new Date().toISOString(),
      raw_response: { message: 'Payment simulated successfully', timestamp: Date.now() },
    };

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            order_status: 'paid',
            payment,
            updated_at: new Date().toISOString(),
          };
        }
        return o;
      })
    );

    playChime();
    return true;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          // If completed or cancelled, check if table should be made available
          if (newStatus === 'completed' || newStatus === 'cancelled') {
            const hasOtherActiveOrders = prev.some(
              (other) => other.table_id === o.table_id && other.id !== o.id && !['completed', 'cancelled'].includes(other.order_status)
            );
            if (!hasOtherActiveOrders) {
              updateTableStatus(o.table_id, 'available');
            }
          }
          return {
            ...o,
            order_status: newStatus,
            updated_at: new Date().toISOString(),
          };
        }
        return o;
      })
    );
    playChime();
  };

  const getOrderById = (orderId: string) => orders.find((o) => o.id === orderId);
  const getOrderByNumber = (orderNumber: string) => orders.find((o) => o.order_number === orderNumber);

  // Admin Menu CRUD
  const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      ...item,
      id: `menu-${Date.now()}`,
      slug: item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      created_at: new Date().toISOString(),
    };
    setMenus((prev) => [...prev, newItem]);
  };

  const updateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    setMenus((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates, updated_at: new Date().toISOString() } : m))
    );
  };

  const deleteMenuItem = (id: string) => {
    setMenus((prev) => prev.filter((m) => m.id !== id));
  };

  const toggleMenuAvailability = (id: string) => {
    setMenus((prev) =>
      prev.map((m) => (m.id === id ? { ...m, is_available: !m.is_available } : m))
    );
  };

  // Admin Category CRUD
  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCat: Category = {
      ...category,
      id: `cat-${Date.now()}`,
      slug: category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      display_order: categories.length + 1,
    };
    setCategories((prev) => [...prev, newCat]);
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates, updated_at: new Date().toISOString() } : c))
    );
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  // Admin Table & QR
  const updateTableStatus = (id: string, status: TableStatus) => {
    setTables((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status, updated_at: new Date().toISOString() } : t))
    );
  };

  const regenerateTableQR = (id: string) => {
    const randomHex = Math.random().toString(36).substring(2, 8);
    setTables((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              qr_token: `kod_${t.table_number.toLowerCase().replace(/\s+/g, '_')}_${randomHex}`,
              updated_at: new Date().toISOString(),
            }
          : t
      )
    );
  };

  return (
    <StoreContext.Provider
      value={{
        tables,
        categories,
        menus,
        orders,
        currentTable,
        setCurrentTable,
        setTableByToken,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        updateCartNotes,
        clearCart,
        cartSubtotal,
        cartTax,
        cartService,
        cartTotal,
        cartCount,
        createOrder,
        createPosOrder,
        processPayment,
        updateOrderStatus,
        getOrderById,
        getOrderByNumber,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        toggleMenuAvailability,
        addCategory,
        updateCategory,
        deleteCategory,
        updateTableStatus,
        regenerateTableQR,
        playChime,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
