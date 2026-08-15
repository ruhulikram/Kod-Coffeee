export type TableStatus = 'available' | 'occupied' | 'inactive';

export interface Table {
  id: string;
  table_number: string;
  qr_token: string;
  status: TableStatus;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image: string;
  is_available: boolean;
  is_signature?: boolean;
  taste_notes?: string;
  display_order?: number;
  created_at?: string;
  updated_at?: string;
}

export type OrderStatus =
  | 'pending_payment'
  | 'paid'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'completed'
  | 'cancelled';

export type PaymentStatus =
  | 'pending'
  | 'paid'
  | 'failed'
  | 'expired'
  | 'cancelled'
  | 'refunded';

export type PaymentMethod =
  | 'cash'
  | 'debit'
  | 'qris'
  | 'gopay'
  | 'ovo'
  | 'shopeepay'
  | 'bca_va'
  | 'mandiri_va';

export interface OrderItem {
  id: string;
  order_id: string;
  menu_id: string;
  menu_name: string;
  price: number;
  quantity: number;
  notes?: string;
  subtotal: number;
  image?: string;
}

export interface Payment {
  id: string;
  order_id: string;
  provider: string;
  transaction_id: string;
  payment_method: PaymentMethod;
  amount: number;
  status: PaymentStatus;
  cash_received?: number;
  change_amount?: number;
  paid_at?: string;
  expired_at?: string;
  raw_response?: any;
  created_at?: string;
  updated_at?: string;
}

export interface Order {
  id: string;
  order_number: string;
  table_id: string;
  order_type?: 'dine_in' | 'takeaway';
  customer_name?: string;
  customer_phone?: string;
  subtotal: number;
  tax: number;
  service_charge: number;
  total: number;
  order_status: OrderStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
  payment?: Payment;
  table?: Table;
}

export interface CartItem {
  menu: MenuItem;
  quantity: number;
  notes: string;
}

export type AdminTab = 'dashboard' | 'pos' | 'orders' | 'menus' | 'categories' | 'tables' | 'reports';
