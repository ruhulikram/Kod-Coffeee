import React, { useState } from 'react';
import { Coffee, Lock, Mail, ArrowRight, ShieldCheck, X } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso-950/80 backdrop-blur-md animate-fade-in">
      <div
        className="w-full max-w-md bg-white rounded-3xl shadow-floating overflow-hidden border border-espresso-100 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-espresso-950 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-espresso-800 text-espresso-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-crema text-espresso-950 flex items-center justify-center font-bold mb-3 shadow-md">
            <Coffee className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold font-display">Portal Staff & Admin</h2>
          <p className="text-xs text-espresso-400 mt-0.5">
            Masuk untuk memantau kitchen order, kelola menu, dan laporan.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-ember-light border border-ember/20 text-ember-dark text-xs">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-espresso-700 uppercase tracking-wider mb-1">
              Email Staff
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-espresso-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-espresso-200 focus:outline-none focus:border-crema bg-oat-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-espresso-700 uppercase tracking-wider mb-1">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-espresso-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-espresso-200 focus:outline-none focus:border-crema bg-oat-50"
              />
            </div>
          </div>

          <div className="bg-oat-100 p-3 rounded-xl border border-espresso-100 text-[11px] text-espresso-600">
            <span className="font-bold text-espresso-900 block mb-0.5">Kredensial Demo:</span>
            Email: <code className="font-mono font-bold text-crema-800">admin@kodcoffee.com</code> / Sandi: <code className="font-mono font-bold text-crema-800">admin123</code>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-2xl bg-espresso-950 hover:bg-espresso-900 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
          >
            <ShieldCheck className="w-4 h-4 text-crema" />
            <span>{isLoading ? 'Memverifikasi...' : 'Masuk Dashboard'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
