# Kod Coffee — QR Code Self-Ordering & Coffee Bar Management Web App ☕

Aplikasi Web Pemesanan Menu Kopi & Makanan Artisanal (*Mobile-First & Desktop*) langsung dari meja coffee shop melalui **Scan QR Code**, terintegrasi dengan simulasi **Payment Gateway QRIS Instant**, **Full-Page Cart & Checkout**, serta **Portal Manajemen Barista & Kasir**.

---

## 🌟 Fitur Utama

### 📱 1. Sisi Pelanggan (Customer Experience)
- **Auto Table Detection & QR Code**:
  - Deteksi otomatis nomor meja via URL parameter (`?table=Table%2001` atau `/t/:token`).
  - Pemilihan meja fleksibel dengan status okupansi aktif.
- **Hero Banner Promo Otomatis (Auto-Sliding Carousel)**:
  - Banner promo lebar dengan 4 slide cerita kafe dan penawaran spesial.
  - Bergeser otomatis setiap 4.5 detik serta mendukung usap sentuh (*touch swipe* di mobile).
- **Katalog Menu Interaktif & Pencarian Cepat**:
  - Filter kategori (*Signature Coffee, Manual Brew, Non-Coffee, Artisanal Bakery & Toast, Hearty Meals*).
  - Pencarian instan berdasarkan nama, deskripsi rasa, dan profil aroma kopi.
  - Indikator ketersediaan stok (*In Stock* / *Sold Out*).
- **Keranjang Pesanan Halaman Penuh (Full-Page CartView)**:
  - Tampilan penuh yang seragam dengan Checkout View.
  - Thumbnail foto menu, pengaturan kuantitas stepper `[-] 2 [+]`, catatan pesanan, dan tombol hapus satuan.
  - Dialog validasi keamanan saat mengosongkan keranjang.
- **Konfirmasi Pesanan & Pembayaran (Streamlined Checkout)**:
  - Form data pemesan ringkas (Nama, No. WhatsApp untuk e-struk, Catatan Barista).
  - Badge nomor meja aktif terintegrasi di kartu pemesan.
  - Pembayaran **QRIS Instant** (mendukung semua Bank & E-Wallet: BCA, Mandiri, BRI, BNI, GoPay, OVO, ShopeePay, Dana, LinkAja).
- **Live Order Tracker (Barista Timeline Pulse)**:
  - Pelacakan status pesanan real-time: `Menunggu Pembayaran` ➔ `Dikonfirmasi` ➔ `Sedang Diseduh` ➔ `Siap Diantar` ➔ `Selesai`.
  - Suara notifikasi (*Audio Chime*) & selebrasi konfeti saat pesanan siap di meja.
  - Struk digital rincian pesanan.

---

### 🖥️ 2. Sisi Staff & Barista (Admin Operations Portal)
- **Kitchen & Barista Order Board**:
  - Tampilan **Kanban Board** & **Tabel List** interaktif untuk alur kerja pesanan dapur.
  - Tombol aksi 1-klik untuk memperbarui status pesanan.
- **Point of Sale (POS) Kasir**:
  - Pembuatan pesanan manual di meja kasir dengan kalkulasi otomatis.
- **Manajemen Menu & Stok (CRUD)**:
  - Tambah, edit harga, ubah deskripsi, dan upload foto menu.
  - Toggle cepat ketersediaan stok (*Tersedia / Habis*).
- **Manajemen Meja & Cetak QR Standee**:
  - Monitoring okupansi meja (*Kosong, Dine-In, Nonaktif*).
  - **Cetak Standee Meja Akrilik**: Template siap cetak (`window.print()`) dengan QR Code beresolusi tinggi.
- **Laporan & Analitik Penjualan**:
  - Statistik omset harian, total pesanan, porsi terjual, dan Average Order Value (AOV).
  - Grafik tren pendapatan 7 hari terakhir dan peringkat menu terlaris.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Vanilla Utility Design System, Lucide Icons
- **Database & Realtime**: Supabase (PostgreSQL) dengan Row Level Security (RLS)
- **Animation & Effects**: Canvas Confetti, CSS Keyframe Animations

---

## 🗄️ Konfigurasi Supabase (Database Backend)

- **Supabase Project URL**: `https://tcalulpiymwnxlabrpnl.supabase.co`
- **Project Reference ID**: `tcalulpiymwnxlabrpnl`

### Langkah Setup Database:
1. Masuk ke dashboard Supabase Anda di [https://supabase.com/dashboard/project/tcalulpiymwnxlabrpnl/sql](https://supabase.com/dashboard/project/tcalulpiymwnxlabrpnl/sql).
2. Jalankan skrip migrasi tabel dan data awal yang tersedia di repositori:
   - [`supabase/migrations/20260815_init_schema.sql`](supabase/migrations/20260815_init_schema.sql) — Membuat tabel `tables`, `categories`, `menus`, `orders`, dan `order_items`.
   - [`supabase/seed.sql`](supabase/seed.sql) — Mengisi data awal kategori, meja, dan menu kopi.
3. Buat file `.env` di root direktori project (salin dari `.env.example`):
   ```env
   VITE_SUPABASE_URL=https://tcalulpiymwnxlabrpnl.supabase.co
   VITE_SUPABASE_ANON_KEY=masukkan_supabase_anon_key_anda_di_sini
   ```

> 🔒 **Catatan Keamanan Penting**:
> - File `.env` telah dimasukkan ke dalam `.gitignore` sehingga kunci rahasia (*secret keys* seperti `service_role key` dan database password) **tidak akan pernah terkirim ke Git**.
> - Hanya gunakan `anon key` publik pada konfigurasi client Vite.

---

## 🚀 Panduan Menjalankan Project Secara Lokal

### 1. Clone & Instalasi Dependencies
```bash
git clone https://github.com/ruhulikram/Kod-Coffeee.git
cd Kod-Coffeee
npm install
```

### 2. Jalankan Development Server
```bash
npm run dev
```
Buka browser di `http://localhost:3000`.

### 3. Kredensial Login Staff / Admin Portal
- Klik tombol **"Admin / Kitchen View"** di navigasi atas.
- **Email**: `admin@kodcoffee.com`
- **Password**: `admin123`

---

## 📦 Struktur Folder
```text
Kod-Coffeee/
├── public/
│   └── images/               # Asset foto menu & hero banner
├── src/
│   ├── components/
│   │   ├── admin/            # Dashboard, POS, Menu/Table Management, Reports
│   │   └── customer/         # HeroBanner, CategoryBar, MenuCard, CartView, CheckoutView, OrderStatusView
│   ├── context/
│   │   └── StoreContext.tsx  # Global state store (Cart, Orders, Tables, Storage Engine)
│   ├── lib/
│   │   └── supabase.ts       # Supabase client initialization
│   ├── types/
│   │   └── index.ts          # TypeScript interfaces & types
│   ├── utils/
│   │   └── formatters.ts     # Format rupiah & tanggal
│   ├── App.tsx               # Main application & routing controller
│   └── main.tsx              # Entry point
├── supabase/
│   ├── migrations/           # SQL schema migrations
│   └── seed.sql              # Initial seed data
└── README.md
```

---

## 📄 Lisensi
Hak Cipta © 2026 Kod Coffee. Dibuat untuk pengalaman pemesanan kopi artisanal modern.
