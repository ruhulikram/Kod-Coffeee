# Kod Coffee ☕

Aplikasi web pemesanan menu kopi dan hidangan kafe (*QR Code Table Ordering*) berbasis React, TypeScript, dan Tailwind CSS.

---

## ✨ Fitur Utama

- **Pemesanan Meja via QR Code**: Deteksi nomor meja otomatis via URL parameter (`?table=Table%2001`).
- **Katalog Menu & Banner Promo**: Pencarian menu, filter kategori, dan carousel promo interaktif.
- **Keranjang & Konfirmasi Pesanan**: Halaman penuh (*full-page*) untuk atur porsi, catatan barista, dan kalkulasi biaya.
- **Simulasi Pembayaran QRIS**: Alur pembayaran instan dengan pelacakan status pesanan real-time.
- **Staff / Admin Portal**: Monitoring pesanan dapur (Kanban Board), kelola menu, dan cetak standee QR meja.

---

## 🚀 Cara Menjalankan Project

1. **Clone repository & Install dependencies**:
   ```bash
   git clone https://github.com/ruhulikram/Kod-Coffeee.git
   cd Kod-Coffeee
   npm install
   ```

2. **Jalankan Development Server**:
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan di `http://localhost:3000`.

---

## 🔑 Akun Demo Staff / Admin
- **Email**: `admin@kodcoffee.com`
- **Password**: `admin123`

---

## 🛠️ Tech Stack
- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Lucide Icons
- **Storage Engine**: Reactive Local State & Storage
