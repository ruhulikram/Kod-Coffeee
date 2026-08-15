import React, { useState } from 'react';
import { Layers, Plus, Edit2, Trash2, Check, X, ToggleLeft, ToggleRight } from 'lucide-react';
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
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-espresso-950 font-display">
            Kelola Kategori Menu
          </h1>
          <p className="text-xs text-espresso-500 mt-0.5">
            Atur pengelompokan menu (Coffee, Manual Brew, Bakery, Meals, dll)
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-crema hover:bg-crema-400 text-espresso-950 font-extrabold text-xs shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kategori</span>
        </button>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-3xl p-5 border border-espresso-100 shadow-subtle divide-y divide-espresso-100">
        {categories.map((cat, idx) => {
          const itemCount = menus.filter((m) => m.category_id === cat.id).length;

          return (
            <div
              key={cat.id}
              className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-lg bg-espresso-100 text-espresso-600 font-bold text-xs flex items-center justify-center">
                  {idx + 1}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-espresso-950">{cat.name}</h3>
                    <span
                      className={`text-[10px] px-2 py-0.2 rounded-full font-semibold ${
                        cat.is_active
                          ? 'bg-brew-light text-brew-dark'
                          : 'bg-espresso-100 text-espresso-500'
                      }`}
                    >
                      {cat.is_active ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </div>
                  <p className="text-xs text-espresso-400">
                    Slug: <code className="text-espresso-600">{cat.slug}</code> • {itemCount} menu terkait
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateCategory(cat.id, { is_active: !cat.is_active })}
                  className="p-1.5 text-espresso-600 hover:text-espresso-900"
                  title={cat.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                >
                  {cat.is_active ? (
                    <ToggleRight className="w-5 h-5 text-brew" />
                  ) : (
                    <ToggleLeft className="w-5 h-5 text-espresso-400" />
                  )}
                </button>

                <button
                  onClick={() => openEditModal(cat)}
                  className="p-1.5 rounded-lg bg-espresso-50 hover:bg-espresso-100 text-espresso-700 transition-colors"
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
                  className="p-1.5 rounded-lg bg-ember-light hover:bg-ember/20 text-ember-dark transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso-950/80 backdrop-blur-sm animate-fade-in">
          <div
            className="w-full max-w-sm bg-white rounded-3xl shadow-floating overflow-hidden animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-espresso-950 text-white p-5 flex items-center justify-between">
              <h3 className="font-extrabold text-base font-display">
                {editingCat ? 'Edit Kategori' : 'Kategori Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-espresso-800 text-espresso-300 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-espresso-700 uppercase tracking-wider mb-1">
                  Nama Kategori
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Cold Brew Series"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-espresso-200 focus:outline-none focus:border-crema bg-oat-50 text-xs font-semibold"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded text-crema focus:ring-crema"
                />
                <span className="font-semibold text-espresso-800">Tampilkan di halaman menu</span>
              </label>

              <div className="pt-3 border-t border-espresso-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-espresso-200 text-espresso-700 hover:bg-espresso-50 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-espresso-950 hover:bg-espresso-900 text-white font-bold shadow-sm active:scale-95 transition-all"
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
