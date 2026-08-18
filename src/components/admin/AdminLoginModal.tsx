import React, { useState } from 'react';
import { Coffee, Lock, Mail, ShieldCheck, X } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onLoginSuccess: () => void;
  onClose: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onLoginSuccess,
  onClose,
}) => {
  const [email, setEmail] = useState('admin@kodcoffee.com');
  const [password, setPassword] = useState('admin123');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      if (email.trim() === 'admin@kodcoffee.com' && password === 'admin123') {
        setIsLoading(false);
        onLoginSuccess();
      } else {
        setIsLoading(false);
        setErrorMsg('Email atau kata sandi admin tidak sesuai.');
      }
    }, 400);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso-950/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-3xl shadow-floating overflow-hidden border border-espresso-200 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-espresso-950 text-white p-6 relative border-b border-espresso-800">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-xl bg-espresso-900 hover:bg-espresso-800 text-espresso-300 hover:text-white flex items-center justify-center transition-colors shadow-2xs"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-espresso-950 flex items-center justify-center font-black mb-3 shadow-md">
            <Coffee className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black font-display text-white">Portal Staff & Barista</h2>
          <p className="text-xs text-espresso-300 mt-1">
            Masuk untuk memantau kitchen orders, kelola menu, dan analitik penjualan.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-ember-light border border-ember/20 text-ember text-xs font-bold">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-[11px] font-black text-espresso-800 uppercase tracking-wider mb-1.5">
              Email Staff
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-espresso-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl border border-espresso-200 focus:outline-none focus:border-amber-400 bg-oat-50/70 text-espresso-950 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-black text-espresso-800 uppercase tracking-wider mb-1.5">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-espresso-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl border border-espresso-200 focus:outline-none focus:border-amber-400 bg-oat-50/70 text-espresso-950 font-medium"
              />
            </div>
          </div>

          <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200/80 text-[11px] text-amber-950">
            <span className="font-bold text-amber-900 block mb-0.5">Kredensial Demo:</span>
            Email: <code className="font-mono font-bold text-amber-900 bg-white px-1.5 py-0.5 rounded border border-amber-200">admin@kodcoffee.com</code> / Sandi: <code className="font-mono font-bold text-amber-900 bg-white px-1.5 py-0.5 rounded border border-amber-200">admin123</code>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-espresso-950 font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 border border-amber-300"
          >
            <ShieldCheck className="w-4 h-4 text-espresso-950" />
            <span>{isLoading ? 'Memverifikasi...' : 'Masuk Dashboard Admin'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
