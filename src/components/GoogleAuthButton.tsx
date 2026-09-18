import React, { useState, useEffect, useRef } from 'react';
import { LogOut, User as UserIcon, Loader2 } from 'lucide-react';
import {
  auth,
  iniciarSesionConGoogle,
  cerrarSesion,
  onAuthStateChanged,
  getRedirectResult,
  User,
} from '../lib/firebase';
import { Idioma } from '../types';
import { I18N_TEXTS } from '../i18n';

interface GoogleAuthButtonProps {
  idioma: Idioma;
}

export const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({ idioma }) => {
  const t = I18N_TEXTS[idioma];
  const [usuario, setUsuario] = useState<User | null>(null);
  const [cargando, setCargando] = useState<boolean>(true);
  const [iniciandoSesion, setIniciandoSesion] = useState<boolean>(false);
  const [menuAbierto, setMenuAbierto] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Procesar retorno de redirección si ocurrió
    getRedirectResult(auth).catch((err) => {
      console.warn('Redirect auth check:', err);
    });

    const unsubscribe = onAuthStateChanged(auth, (userActual) => {
      setUsuario(userActual);
      setCargando(false);
    });
    return () => unsubscribe();
  }, []);

  // Cerrar menú al hacer click afuera
  useEffect(() => {
    const handleClickAfuera = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuAbierto(false);
      }
    };
    if (menuAbierto) {
      document.addEventListener('mousedown', handleClickAfuera);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickAfuera);
    };
  }, [menuAbierto]);

  const handleSignIn = async () => {
    setErrorMsg(null);
    setIniciandoSesion(true);
    try {
      await iniciarSesionConGoogle();
    } catch (err: unknown) {
      console.error('Error al iniciar sesión:', err);
      // Solo mostrar mensaje si no fue cancelación manual del popup por el usuario
      const firebaseError = err as { code?: string; message?: string };
      if (firebaseError?.code !== 'auth/popup-closed-by-user') {
        setErrorMsg(
          idioma === 'en'
            ? 'Sign in could not be completed.'
            : 'No se pudo completar el inicio de sesión.'
        );
      }
    } finally {
      setIniciandoSesion(false);
    }
  };

  const handleSignOut = async () => {
    setMenuAbierto(false);
    try {
      await cerrarSesion();
    } catch (err: unknown) {
      console.error('Error al cerrar sesión:', err);
    }
  };

  if (cargando) {
    return (
      <div className="h-8 px-2.5 flex items-center justify-center border border-neutral-200 bg-[#F5F5F5] text-neutral-400">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      </div>
    );
  }

  // Estado: Usuario autenticado
  if (usuario) {
    const nombre = usuario.displayName || usuario.email?.split('@')[0] || 'Usuario';
    const foto = usuario.photoURL;

    return (
      <div ref={menuRef} className="relative inline-block text-left z-50">
        <button
          id="btn-perfil-usuario"
          type="button"
          onClick={() => setMenuAbierto(!menuAbierto)}
          className="h-8 px-2 border border-neutral-300 bg-white hover:border-black flex items-center gap-2 cursor-pointer transition-colors select-none"
          title={usuario.email || nombre}
        >
          {foto ? (
            <img
              src={foto}
              alt={nombre}
              referrerPolicy="no-referrer"
              className="w-5 h-5 rounded-full object-cover border border-neutral-200"
            />
          ) : (
            <div className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[10px] font-bold">
              {nombre.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="text-xs font-medium text-black max-w-[110px] truncate hidden sm:inline">
            {nombre}
          </span>
        </button>

        {menuAbierto && (
          <div className="absolute right-0 mt-1 w-64 bg-white border border-black shadow-[0_8px_25px_rgba(0,0,0,0.18)] z-[1300] p-3 animate-in fade-in duration-100">
            <div className="flex items-center gap-2.5 pb-2.5 border-b border-neutral-200 mb-2">
              {foto ? (
                <img
                  src={foto}
                  alt={nombre}
                  referrerPolicy="no-referrer"
                  className="w-9 h-9 rounded-full object-cover border border-neutral-200 flex-shrink-0"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {nombre.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-black truncate">{nombre}</p>
                <p className="text-[11px] font-mono-code text-neutral-500 truncate">
                  {usuario.email}
                </p>
              </div>
            </div>

            <button
              id="btn-cerrar-sesion"
              type="button"
              onClick={handleSignOut}
              className="w-full mt-1 px-2.5 py-1.5 text-xs text-neutral-700 hover:text-white hover:bg-black flex items-center justify-between transition-colors cursor-pointer border border-neutral-200 hover:border-black font-medium"
            >
              <span>{t.signOut}</span>
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    );
  }

  // Estado: Usuario no autenticado (Botón Sign In con Google)
  return (
    <div className="relative inline-block">
      <button
        id="btn-google-sign-in"
        type="button"
        onClick={handleSignIn}
        disabled={iniciandoSesion}
        className="h-8 px-2.5 sm:px-3 text-xs font-medium border border-neutral-300 bg-white hover:bg-[#F9F9F9] hover:border-black text-neutral-900 flex items-center gap-2 transition-all cursor-pointer shadow-2xs active:scale-[0.98] disabled:opacity-60"
        title={t.signInWithGoogle}
      >
        {iniciandoSesion ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-neutral-500" />
        ) : (
          <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.27 21.37 7.36 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.27 2.63 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
        )}
        <span className="whitespace-nowrap">
          {iniciandoSesion
            ? (idioma === 'en' ? 'Signing in...' : 'Iniciando...')
            : t.signInWithGoogle}
        </span>
      </button>

      {errorMsg && (
        <div className="absolute right-0 top-full mt-1 bg-neutral-900 text-white text-[11px] p-2 shadow-lg border border-red-500 z-[1400] w-52">
          {errorMsg}
        </div>
      )}
    </div>
  );
};
