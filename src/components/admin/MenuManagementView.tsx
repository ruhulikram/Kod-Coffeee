import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Coffee,
  ToggleLeft,
  ToggleRight,
  X,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { MenuItem } from '../../types';
import { formatRupiah } from '../../utils/formatters';

export const MenuManagementView: React.FC = () => {
  const { menus, categories, addMenuItem, updateMenuItem, deleteMenuItem, toggleMenuAvailability } =
    useStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState<number>(30000);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [tasteNotes, setTasteNotes] = useState('');
  const [isSignature, setIsSignature] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);

  const openCreateModal = () => {
    setEditingItem(null);
    setName('');
    setCategoryId(categories[0]?.id || '');
    setPrice(32000);
    setDescription('');
    setImage('/images/latte.jpg');
    setTasteNotes('');
    setIsSignature(false);
    setIsAvailable(true);
    setIsModalOpen(true);
  };

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setName(item.name);
    setCategoryId(item.category_id);
    setPrice(item.price);
    setDescription(item.description);
    setImage(item.image);
    setTasteNotes(item.taste_notes || '');
    setIsSignature(!!item.is_signature);
    setIsAvailable(item.is_available);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !categoryId) return;

    if (editingItem) {
      updateMenuItem(editingItem.id, {
        name,
        category_id: categoryId,
        price,
        description,
        image,
        taste_notes: tasteNotes,
        is_signature: isSignature,
        is_available: isAvailable,
      });
    } else {
      addMenuItem({
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category_id: categoryId,
        price,
        description,
        image: image || '/images/latte.jpg',
        taste_notes: tasteNotes,
        is_signature: isSignature,
        is_available: isAvailable,
      });
    }
    setIsModalOpen(false);
  };

  const filteredMenus = menus.filter((m) => {
    if (selectedCategory !== 'all' && m.category_id !== selectedCategory) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        (m.taste_notes && m.taste_notes.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-espresso-950 font-display tracking-tight">
              Manajemen Menu & Stok
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-600 text-[10px] font-black border border-amber-400/30">
              <Sparkles className="w-3 h-3" />
              <span>{menus.length} Menu</span>
            </span>
          </div>
          <p className="text-xs text-espresso-500 mt-1">
            Tambah varian kopi baru, atur harga, deskripsi, dan toggle ketersediaan bahan secara real-time.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-espresso-950 font-black text-xs shadow-md transition-all active:scale-95 border border-amber-300"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Tambah Menu Baru</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-espresso-200 shadow-subtle flex flex-wrap items-center justify-between gap-3">
        <div className="relative min-w-[220px] flex-1 max-w-sm">
          <Search className="w-4 h-4 text-espresso-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama menu atau taste notes..."
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl border border-espresso-200 focus:outline-none focus:border-amber-400 bg-oat-50/70 font-medium transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-espresso-950 text-amber-300 shadow-sm font-black'
                : 'bg-oat-100/80 text-espresso-700 hover:bg-espresso-100 border border-espresso-100'
            }`}
          >
            Semua Kategori ({menus.length})
          </button>
          {categories.map((c) => {
            const count = menus.filter((m) => m.category_id === c.id).length;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === c.id
                    ? 'bg-espresso-950 text-amber-300 shadow-sm font-black'
                    : 'bg-oat-100/80 text-espresso-700 hover:bg-espresso-100 border border-espresso-100'
                }`}
              >
                {c.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Menus */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMenus.map((item) => {
          const category = categories.find((c) => c.id === item.category_id);

          return (
            <div
              key={item.id}
              className={`bg-white rounded-3xl border border-espresso-200 overflow-hidden shadow-subtle hover:shadow-elevated hover:border-amber-400/60 flex flex-col justify-between transition-all group ${
                !item.is_available ? 'opacity-75 bg-oat-50/50' : ''
              }`}
            >
              <div>
                {/* Photo Header */}
                <div className="relative aspect-[16/9] w-full bg-espresso-100 overflow-hidden">
                  <img
                    src={item.image || '/images/latte.jpg'}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/latte.jpg';
                    }}
                  />
                  {item.is_signature && (
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-espresso-950/90 backdrop-blur-sm text-amber-300 text-[10px] font-black uppercase tracking-wider border border-amber-400/40 flex items-center gap-1 shadow-2xs">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>Signature</span>
                    </div>
                  )}

                  {/* Stock Toggle on image */}
                  <button
                    onClick={() => toggleMenuAvailability(item.id)}
                    className={`absolute bottom-2.5 right-2.5 px-3 py-1 rounded-full text-[10px] font-black backdrop-blur-md shadow-md transition-all active:scale-95 ${
                      item.is_available
                        ? 'bg-brew text-white'
                        : 'bg-ember text-white'
                    }`}
                  >
                    {item.is_available ? '✓ Tersedia' : '✕ Habis (Sold Out)'}
                  </button>
                </div>

                <div className="p-4 sm:p-5 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-amber-600 block">
                        {category?.name || 'Kategori'}
                      </span>
                      <h3 className="font-black text-sm sm:text-base text-espresso-950 line-clamp-1 font-display">{item.name}</h3>
                    </div>
                    <span className="font-black text-sm sm:text-base text-espresso-950 font-display">
                      {formatRupiah(item.price)}
                    </span>
                  </div>

                  <p className="text-xs text-espresso-500 line-clamp-2 leading-relaxed">{item.description}</p>

                  {item.taste_notes && (
                    <p className="text-[11px] text-espresso-700 bg-amber-50/80 border border-amber-200/70 p-2 rounded-xl">
                      <b className="text-amber-950 font-bold">Notes:</b> {item.taste_notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Bottom */}
              <div className="p-4 sm:p-5 pt-0 border-t border-espresso-100 flex items-center justify-between mt-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => toggleMenuAvailability(item.id)}
                    className="text-xs text-espresso-700 hover:text-espresso-950 flex items-center gap-1.5 font-bold"
                  >
                    {item.is_available ? (
                      <ToggleRight className="w-5 h-5 text-brew" />
                    ) : (
                      <ToggleLeft className="w-5 h-5 text-ember" />
                    )}
                    <span>{item.is_available ? 'Aktif' : 'Nonaktif'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-2 rounded-xl bg-espresso-50 hover:bg-espresso-100 text-espresso-700 transition-colors border border-espresso-200 shadow-2xs"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Yakin ingin menghapus menu "${item.name}"?`)) {
                        deleteMenuItem(item.id);
                      }
                    }}
                    className="p-2 rounded-xl bg-ember-light hover:bg-ember/20 text-ember transition-colors border border-ember/20 shadow-2xs"
                    title="Hapus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso-950/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-3xl shadow-floating overflow-hidden flex flex-col max-h-[88vh] animate-slide-up border border-espresso-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-espresso-950 text-white p-5 flex items-center justify-between border-b border-espresso-800">
              <h3 className="font-black text-base font-display text-white">
                {editingItem ? 'Edit Menu' : 'Tambah Menu Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-espresso-900 hover:bg-espresso-800 text-espresso-300 hover:text-white flex items-center justify-center transition-colors shadow-2xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="block font-black text-espresso-800 uppercase tracking-wider mb-1.5 text-[11px]">
                  Nama Menu
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Kod Palm Cream Latte"
                  required
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-espresso-200 focus:outline-none focus:border-amber-400 bg-oat-50/70 text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-black text-espresso-800 uppercase tracking-wider mb-1.5 text-[11px]">
                    Kategori
                  </label>
                  <div className="relative">
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      required
                      className="w-full appearance-none pl-3.5 pr-8 py-2.5 rounded-2xl border border-espresso-200 focus:outline-none focus:border-amber-400 bg-white text-xs font-bold text-espresso-900 cursor-pointer"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-espresso-400">
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-black text-espresso-800 uppercase tracking-wider mb-1.5 text-[11px]">
                    Harga (Rp)
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    min={0}
                    step={1000}
                    required
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-espresso-200 focus:outline-none focus:border-amber-400 bg-oat-50/70 text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-black text-espresso-800 uppercase tracking-wider mb-1.5 text-[11px]">
                  Foto URL / Path Asset
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="/images/latte.jpg atau URL gambar"
                    className="flex-1 px-3.5 py-2.5 rounded-2xl border border-espresso-200 focus:outline-none focus:border-amber-400 bg-oat-50/70 text-xs font-medium"
                  />
                </div>
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {['/images/latte.jpg', '/images/v60.jpg', '/images/matcha.jpg', '/images/croissant.jpg', '/images/toast.jpg'].map(
                    (p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setImage(p)}
                        className="text-[10px] bg-oat-100 hover:bg-espresso-100 px-2.5 py-1 rounded-xl border border-espresso-200 font-bold text-espresso-800 active:scale-95 transition-all"
                      >
                        {p.replace('/images/', '')}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div>
                <label className="block font-black text-espresso-800 uppercase tracking-wider mb-1.5 text-[11px]">
                  Deskripsi Menu
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ceritakan komposisi dan teknik seduhan..."
                  rows={2}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-espresso-200 focus:outline-none focus:border-amber-400 bg-oat-50/70 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block font-black text-espresso-800 uppercase tracking-wider mb-1.5 text-[11px]">
                  Taste Notes Profile
                </label>
                <input
                  type="text"
                  value={tasteNotes}
                  onChange={(e) => setTasteNotes(e.target.value)}
                  placeholder="Contoh: Caramel, Butterscotch, Smoky Aren"
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-espresso-200 focus:outline-none focus:border-amber-400 bg-oat-50/70 text-xs font-medium"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSignature}
                    onChange={(e) => setIsSignature(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-amber-400"
                  />
                  <span className="font-bold text-espresso-900">Menu Signature</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAvailable}
                    onChange={(e) => setIsAvailable(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-amber-400"
                  />
                  <span className="font-bold text-espresso-900">Tersedia untuk Dipesan</span>
                </label>
              </div>

              <div className="pt-4 border-t border-espresso-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-2xl border border-espresso-200 text-espresso-700 hover:bg-espresso-50 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-espresso-950 font-black shadow-md active:scale-95 transition-all"
                >
                  {editingItem ? 'Simpan Perubahan' : 'Tambah Menu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
