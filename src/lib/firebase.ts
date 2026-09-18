import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(
  app,
  firebaseConfig.firestoreDatabaseId || '(default)'
);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export const iniciarSesionConGoogle = async (): Promise<User | null> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: unknown) {
    const firebaseError = error as { code?: string };
    if (firebaseError?.code === 'auth/popup-blocked') {
      console.warn('Popup bloqueado, redirigiendo a ventana de Google...');
      await signInWithRedirect(auth, googleProvider);
      return null;
    }
    console.error('Error al iniciar sesión con Google:', error);
    throw error;
  }
};

export const cerrarSesion = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: unknown) {
    console.error('Error al cerrar sesión:', error);
    throw error;
  }
};

export { onAuthStateChanged, getRedirectResult, signInWithRedirect };
export type { User };
