import React, { useState } from 'react';
import { X, Plus, Minus, Sparkles, Check, Coffee } from 'lucide-react';
import { MenuItem } from '../../types';
import { formatRupiah } from '../../utils/formatters';
import { useStore } from '../../context/StoreContext';

interface MenuDetailModalProps {
  item: MenuItem | null;
  onClose: () => void;
}

const QUICK_NOTES = [
  'Less Ice',
  'No Sugar',
  'Less Sweet',
  'Extra Hot',
  'Oat Milk',
  'Pisah Sambal/Saus',
  'Hangatkan',
];

export const MenuDetailModal: React.FC<MenuDetailModalProps> = ({ item, onClose }) => {
  const { addToCart } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [addedAnimation, setAddedAnimation] = useState(false);

  if (!item) return null;

  const handleAddQuickNote = (quickNote: string) => {
    if (notes.includes(quickNote)) {
      setNotes((prev) =>
        prev
          .split(', ')
          .filter((n) => n !== quickNote)
          .join(', ')
      );
    } else {
      setNotes((prev) => (prev ? `${prev}, ${quickNote}` : quickNote));
    }
  };

  const handleAddToCart = () => {
    if (!item.is_available) return;
    addToCart(item, quantity, notes);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
    }, 400);
  };

  const totalCalculated = item.price * quantity;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-espresso-950/70 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-floating overflow-hidden max-h-[90vh] flex flex-col animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-espresso-950/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-espresso-950 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1">
          {/* Main Photo */}
          <div className="relative aspect-[16/10] w-full bg-espresso-100">
            <img
              src={item.image || '/images/latte.jpg'}
              alt={item.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/latte.jpg';
              }}
            />
            {item.is_signature && (
              <div className="absolute bottom-3 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-espresso-950/85 backdrop-blur-sm text-crema text-xs font-bold uppercase tracking-wider border border-crema-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Signature Brew</span>
              </div>
            )}
          </div>

          <div className="p-5 sm:p-6 space-y-4">
            {/* Title & Price */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-espresso-900 leading-tight font-display">
                  {item.name}
                </h2>
                <p className="text-lg font-extrabold text-crema-600 mt-1 font-display">
                  {formatRupiah(item.price)}
                </p>
              </div>
              <div className="text-right">
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                    item.is_available
                      ? 'bg-brew-light text-brew-dark'
                      : 'bg-ember-light text-ember-dark'
                  }`}
                >
                  {item.is_available ? 'Tersedia' : 'Habis'}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-espresso-600 leading-relaxed">
              {item.description}
            </p>

            {/* Flavor Notes */}
            {item.taste_notes && (
              <div className="bg-oat-100 p-3.5 rounded-2xl border border-espresso-100">
                <div className="flex items-center gap-1.5 text-xs font-bold text-espresso-800 mb-1.5 uppercase tracking-wide">
                  <Coffee className="w-3.5 h-3.5 text-crema" />
                  <span>Taste Profile & Notes</span>
                </div>
                <p className="text-xs text-espresso-700 font-medium">
                  {item.taste_notes}
                </p>
              </div>
            )}

            {/* Custom Notes Section */}
            <div>
              <label className="block text-xs font-bold text-espresso-800 uppercase tracking-wider mb-2">
                Catatan Khusus (Opsional)
              </label>
              
              {/* Quick suggestions */}
              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {QUICK_NOTES.map((qn) => {
                  const active = notes.includes(qn);
                  return (
                    <button
                      key={qn}
                      type="button"
                      onClick={() => handleAddQuickNote(qn)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                        active
                          ? 'bg-espresso-900 text-crema-200 border-espresso-900 font-medium'
                          : 'bg-white text-espresso-700 border-espresso-200 hover:bg-espresso-50'
                      }`}
                    >
                      {active ? `✓ ${qn}` : `+ ${qn}`}
                    </button>
                  );
                })}
              </div>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contoh: Gula dipisah, extra hot, jangan terlalu manis..."
                rows={2}
                className="w-full text-xs p-3 rounded-xl border border-espresso-200 focus:outline-none focus:border-crema focus:ring-2 focus:ring-crema/20 bg-oat-50"
              />
            </div>

            {/* Quantity Stepper */}
            <div className="flex items-center justify-between pt-2 border-t border-espresso-100">
              <span className="text-sm font-bold text-espresso-800">Jumlah Pesanan</span>
              <div className="flex items-center gap-3 bg-espresso-50 p-1 rounded-xl border border-espresso-200">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-lg bg-white hover:bg-espresso-100 flex items-center justify-center text-espresso-800 shadow-sm disabled:opacity-40 transition-colors"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-6 text-center font-bold text-sm text-espresso-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-8 h-8 rounded-lg bg-white hover:bg-espresso-100 flex items-center justify-center text-espresso-800 shadow-sm transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="p-4 bg-espresso-950 text-white flex items-center justify-between gap-4 border-t border-espresso-800">
          <div>
            <span className="text-[11px] text-espresso-400 font-medium block">Total Item</span>
            <span className="text-base font-extrabold text-white font-display">
              {formatRupiah(totalCalculated)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!item.is_available}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-2xl font-black text-sm shadow-md transition-all duration-200 ${
              item.is_available
                ? 'bg-amber-400 hover:bg-amber-300 text-espresso-950 active:scale-95'
                : 'bg-espresso-800 text-espresso-500 cursor-not-allowed'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-4 h-4 text-brew font-bold" />
                <span>Berhasil Ditambahkan!</span>
              </>
            ) : (
              <span>Tambah ke Keranjang</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
