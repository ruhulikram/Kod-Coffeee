import React, { useState } from 'react';
import { Layers, Plus, Edit2, Trash2, X, ToggleLeft, ToggleRight, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Category } from '../../types';

export const CategoryManagementView: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory, menus } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [isActive, setIsActive] = useState(true);

  const openCreateModal = () => {
    setEditingCat(null);
    setName('');
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCat(cat);
    setName(cat.name);
    setIsActive(cat.is_active);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingCat) {
      updateCategory(editingCat.id, {
        name,
        is_active: isActive,
      });
    } else {
      addCategory({
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        is_active: isActive,
        display_order: categories.length + 1,
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-espresso-950 font-display tracking-tight">
              Kelola Kategori Menu
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-600 text-[10px] font-black border border-amber-400/30">
              <Sparkles className="w-3 h-3" />
              <span>{categories.length} Kategori</span>
            </span>
          </div>
          <p className="text-xs text-espresso-500 mt-1">
            Atur pengelompokan menu (Coffee, Manual Brew, Bakery, Meals, dll) untuk navigasi pelanggan.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-espresso-950 font-black text-xs shadow-md transition-all active:scale-95 border border-amber-300"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Tambah Kategori</span>
        </button>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-espresso-200 shadow-subtle divide-y divide-espresso-100">
        {categories.map((cat, idx) => {
          const itemCount = menus.filter((m) => m.category_id === cat.id).length;

          return (
            <div
              key={cat.id}
              className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4 hover:bg-oat-50/50 p-2 rounded-2xl transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <span className="w-8 h-8 rounded-xl bg-espresso-950 text-amber-300 font-black text-xs flex items-center justify-center shadow-2xs">
                  {idx + 1}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-sm text-espresso-950 font-display">{cat.name}</h3>
                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-full font-black border ${
                        cat.is_active
                          ? 'bg-brew-light text-brew border-brew/20'
                          : 'bg-espresso-100 text-espresso-500 border-espresso-200'
                      }`}
                    >
                      {cat.is_active ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </div>
                  <p className="text-xs text-espresso-400 mt-0.5">
                    Slug: <code className="text-espresso-700 font-mono text-[11px]">{cat.slug}</code> • <strong className="text-espresso-800">{itemCount} menu</strong> terkait
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateCategory(cat.id, { is_active: !cat.is_active })}
                  className="p-1.5 text-espresso-600 hover:text-espresso-950"
                  title={cat.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                >
                  {cat.is_active ? (
                    <ToggleRight className="w-6 h-6 text-brew" />
                  ) : (
                    <ToggleLeft className="w-6 h-6 text-espresso-400" />
                  )}
                </button>

                <button
                  onClick={() => openEditModal(cat)}
                  className="p-2 rounded-xl bg-espresso-50 hover:bg-espresso-100 text-espresso-700 transition-colors border border-espresso-200 shadow-2xs"
                  title="Edit"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    if (
                      confirm(
                        `Yakin ingin menghapus kategori "${cat.name}"? Menu terkait juga akan terdampak.`
                      )
                    ) {
                      deleteCategory(cat.id);
                    }
                  }}
                  className="p-2 rounded-xl bg-ember-light hover:bg-ember/20 text-ember transition-colors border border-ember/20 shadow-2xs"
                  title="Hapus"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso-950/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-3xl shadow-floating overflow-hidden animate-slide-up border border-espresso-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-espresso-950 text-white p-5 flex items-center justify-between border-b border-espresso-800">
              <h3 className="font-black text-base font-display text-white">
                {editingCat ? 'Edit Kategori' : 'Kategori Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-espresso-900 hover:bg-espresso-800 text-espresso-300 hover:text-white flex items-center justify-center transition-colors shadow-2xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-black text-espresso-800 uppercase tracking-wider mb-1.5 text-[11px]">
                  Nama Kategori
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Cold Brew Series"
                  required
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-espresso-200 focus:outline-none focus:border-amber-400 bg-oat-50/70 text-xs font-bold text-espresso-950"
                />
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-amber-400"
                />
                <span className="font-bold text-espresso-900">Tampilkan di halaman menu pelanggan</span>
              </label>

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
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
