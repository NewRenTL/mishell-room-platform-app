import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, CreditCard, LogOut, ChevronRight, FileText, Edit2, Check, X, Heart, Camera, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppHeader } from '../../components/layout/AppHeader';
import { useAuthStore } from '../../stores/authStore';
import { authService } from '../../services/auth.service';

export default function ProfilePage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const accessToken = useAuthStore((s) => s.accessToken);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [editing, setEditing] = useState(false);
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [dni, setDni] = useState(user?.dni ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    if (!editing) {
      setPhone(user?.phone ?? '');
      setDni(user?.dni ?? '');
    }
  }, [user?.phone, user?.dni, editing]);

  function handleLogout() {
    clearAuth();
    navigate('/login', { replace: true });
  }

  async function handleSave() {
    setSaving(true);
    setError('');
    try {
      const res = await authService.updateProfile({ phone: phone || undefined, dni: dni || undefined });
      setAuth(accessToken!, { ...user!, phone: res.data.phone, dni: res.data.dni });
      setEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Error al guardar');
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setPhone(user?.phone ?? '');
    setDni(user?.dni ?? '');
    setEditing(false);
    setError('');
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const res = await authService.uploadAvatar(file);
      setAvatarUrl(res.data.avatarUrl);
      setAuth(accessToken!, { ...user!, avatarKey: res.data.avatarKey });
    } catch {
      // silently ignore upload errors
    } finally {
      setUploadingAvatar(false);
      if (avatarInputRef.current) avatarInputRef.current.value = '';
    }
  }

  const isDniUser = user?.email?.endsWith('@mishell.room');

  const menuItems = [
    { icon: FileText, label: 'Mis reservas', action: () => navigate('/my-bookings') },
    { icon: Heart,    label: 'Favoritos',    action: () => navigate('/properties') },
    ...(isDniUser ? [{ icon: ShieldCheck, label: 'Verificación de identidad', action: () => navigate('/verification') }] : []),
  ];

  const initials = user?.firstName?.[0]?.toUpperCase() ?? 'U';

  return (
    <div className="flex flex-col min-h-full bg-ink-50">
      <div className="bg-white">
        <AppHeader title="Mi perfil" />
      </div>

      {/* Avatar + name */}
      <motion.div
        className="bg-white px-5 py-6 flex flex-col items-center gap-3 border-b border-ink-100"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        {/* Avatar with camera overlay */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-mishell-600 flex items-center justify-center shadow-lg shadow-mishell-600/25 overflow-hidden">
            {avatarUrl ? (
              <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-white text-2xl font-bold">{initials}</span>
            )}
            {uploadingAvatar && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
          <motion.button
            className="absolute bottom-0 right-0 w-7 h-7 bg-mishell-600 rounded-full flex items-center justify-center shadow-md border-2 border-white"
            onClick={() => avatarInputRef.current?.click()}
            whileTap={{ scale: 0.9 }}
            disabled={uploadingAvatar}
          >
            <Camera size={13} className="text-white" />
          </motion.button>
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>

        <div className="text-center">
          <h2 className="text-lg font-bold text-ink-900">{user?.firstName} {user?.lastName}</h2>
          <p className="text-xs text-ink-500 mt-0.5 capitalize">{user?.role?.toLowerCase() ?? 'inquilino'}</p>
        </div>
      </motion.div>

      {/* Info / Edit */}
      <motion.div
        className="px-5 mt-5"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.35 }}
      >
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-ink-700 uppercase tracking-wide">Datos personales</p>
          {!editing ? (
            <motion.button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1 text-xs font-semibold text-mishell-600 px-3 py-1.5 rounded-full border border-mishell-100 bg-mishell-50"
              whileTap={{ scale: 0.95 }}
            >
              <Edit2 size={12} />
              Editar
            </motion.button>
          ) : (
            <div className="flex gap-2">
              <motion.button
                onClick={handleCancel}
                className="flex items-center gap-1 text-xs font-semibold text-ink-600 px-3 py-1.5 rounded-full border border-ink-100 bg-white"
                whileTap={{ scale: 0.95 }}
              >
                <X size={12} />
                Cancelar
              </motion.button>
              <motion.button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1 text-xs font-semibold text-white px-3 py-1.5 rounded-full bg-mishell-600 disabled:opacity-60"
                whileTap={{ scale: 0.95 }}
              >
                <Check size={12} />
                {saving ? 'Guardando…' : 'Guardar'}
              </motion.button>
            </div>
          )}
        </div>

        <div className="bg-white border border-ink-100 rounded-2xl overflow-hidden">
          {/* Email */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-ink-100">
            <div className="w-8 h-8 rounded-full bg-ink-50 flex items-center justify-center shrink-0">
              <Mail size={14} className="text-ink-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-ink-500">Email</p>
              <p className="text-sm font-medium text-ink-900">{user?.email}</p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-ink-100">
            <div className="w-8 h-8 rounded-full bg-ink-50 flex items-center justify-center shrink-0">
              <Phone size={14} className="text-ink-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-ink-500">Teléfono</p>
              <AnimatePresence mode="wait">
                {editing ? (
                  <motion.input
                    key="phone-input"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    type="tel"
                    inputMode="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+51 999 999 999"
                    className="text-sm font-medium text-ink-900 bg-transparent w-full outline-none border-b border-mishell-400 pb-0.5"
                  />
                ) : (
                  <motion.p key="phone-val" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-medium text-ink-900">
                    {user?.phone ?? '—'}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* DNI */}
          <div className="flex items-center gap-3 px-4 py-3.5">
            <div className="w-8 h-8 rounded-full bg-ink-50 flex items-center justify-center shrink-0">
              <CreditCard size={14} className="text-ink-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-ink-500">DNI</p>
              <AnimatePresence mode="wait">
                {editing ? (
                  <motion.input
                    key="dni-input"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    type="text"
                    inputMode="numeric"
                    value={dni}
                    onChange={(e) => setDni(e.target.value)}
                    placeholder="12345678"
                    maxLength={8}
                    className="text-sm font-medium text-ink-900 bg-transparent w-full outline-none border-b border-mishell-400 pb-0.5"
                  />
                ) : (
                  <motion.p key="dni-val" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-medium text-ink-900">
                    {user?.dni ?? '—'}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {error && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-mishell-600 mt-2 text-center">
            {error}
          </motion.p>
        )}
      </motion.div>

      {/* Menu */}
      <motion.div
        className="px-5 mt-4"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18, duration: 0.35 }}
      >
        <div className="bg-white border border-ink-100 rounded-2xl overflow-hidden">
          {menuItems.map(({ icon: Icon, label, action }) => (
            <button
              key={label}
              onClick={action}
              className="w-full flex items-center gap-3 px-4 py-3.5 border-b border-ink-100 last:border-0 hover:bg-ink-50 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-ink-50 flex items-center justify-center shrink-0">
                <Icon size={14} className="text-ink-600" />
              </div>
              <span className="text-sm font-medium text-ink-900 flex-1 text-left">{label}</span>
              <ChevronRight size={16} className="text-ink-300" />
            </button>
          ))}
        </div>
      </motion.div>

      {/* Logout */}
      <motion.div
        className="px-5 mt-4 pb-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.24, duration: 0.35 }}
      >
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3.5 bg-white border border-ink-100 rounded-2xl hover:bg-ink-50 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center shrink-0">
            <LogOut size={14} className="text-mishell-600" />
          </div>
          <span className="text-sm font-semibold text-mishell-600 flex-1 text-left">Cerrar sesión</span>
        </button>
      </motion.div>
    </div>
  );
}
