import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
  User,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { deleteAllUserData } from '../services/firestore';
import { track, identifyUser } from '../services/analytics';
import { useLanguage } from './LanguageContext';
import { Translations } from '../i18n/translations';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateDisplayName: (name: string) => Promise<void>;
  /** Kullanıcının tüm Firestore verisini ve Auth hesabını siler. Şifre yeniden doğrulama için gerekir. */
  deleteAccount: (password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Firebase hata kodu → çeviri anahtarı
const firebaseErrorKeys: Record<string, keyof Translations> = {
  'auth/email-already-in-use': 'errEmailInUse',
  'auth/invalid-email': 'errInvalidEmail',
  'auth/weak-password': 'weakPassword',
  'auth/user-not-found': 'errUserNotFound',
  'auth/wrong-password': 'errWrongPassword',
  'auth/invalid-credential': 'errInvalidCredential',
  'auth/too-many-requests': 'errTooManyRequests',
  'auth/network-request-failed': 'errNetwork',
  'auth/requires-recent-login': 'errRequiresRecentLogin',
};

function getErrorMessage(error: unknown, t: Translations): string {
  if (error && typeof error === 'object' && 'code' in error) {
    const code = (error as { code: string }).code;
    const key = firebaseErrorKeys[code];
    if (key) return t[key];
  }
  return t.errGeneric;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      identifyUser(firebaseUser?.uid ?? null);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Firebase hatalarını kullanıcıya gösterilebilir mesaja çevirir
  const wrap = async <T,>(fn: () => Promise<T>): Promise<T> => {
    try {
      return await fn();
    } catch (error) {
      throw new Error(getErrorMessage(error, t));
    }
  };

  const login = (email: string, password: string) =>
    wrap(async () => {
      await signInWithEmailAndPassword(auth, email, password);
      track('logged_in');
    });

  const register = (email: string, password: string, name: string) =>
    wrap(async () => {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: name });
      // displayName güncellemesi onAuthStateChanged'i tetiklemez; state'i elle yenile
      setUser({ ...result.user, displayName: name } as User);
      track('signed_up');
    });

  const logout = () =>
    wrap(async () => {
      await signOut(auth);
    });

  const resetPassword = (email: string) =>
    wrap(async () => {
      await sendPasswordResetEmail(auth, email);
    });

  const updateDisplayName = (name: string) =>
    wrap(async () => {
      if (!auth.currentUser) throw new Error('not-authenticated');
      await updateProfile(auth.currentUser, { displayName: name });
      setUser({ ...auth.currentUser, displayName: name } as User);
    });

  const deleteAccount = (password: string) =>
    wrap(async () => {
      const current = auth.currentUser;
      if (!current || !current.email) throw new Error('not-authenticated');
      // Firebase hesap silmek için yakın zamanda giriş ister; şifreyle yeniden doğrula
      const credential = EmailAuthProvider.credential(current.email, password);
      await reauthenticateWithCredential(current, credential);
      // Önce veriler, sonra hesap: hesap silinirse Firestore kuralları veriye erişimi keser
      await deleteAllUserData(current.uid);
      track('account_deleted');
      await deleteUser(current);
    });

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, login, register, logout, resetPassword, updateDisplayName, deleteAccount }),
    // fonksiyonlar t'ye bağlı; dil değişince hata mesajları da değişsin
    [user, loading, t]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
