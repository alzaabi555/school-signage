import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import {
  auth,
  testFirestoreConnection,
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  signInQuickAdmin,
  logOut,
} from '../services/firebase';

interface FirebaseContextType {
  currentUser: User | null;
  isAuthReady: boolean;
  isAdmin: boolean;
  isFirestoreConnected: boolean;
  signInWithGoogle: () => Promise<User | null>;
  signInWithEmail: (email: string, pass: string) => Promise<User | null>;
  signUpWithEmail: (email: string, pass: string) => Promise<User | null>;
  signInQuickAdmin: () => Promise<User | null>;
  logOut: () => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType>({
  currentUser: null,
  isAuthReady: false,
  isAdmin: false,
  isFirestoreConnected: false,
  signInWithGoogle: async () => null,
  signInWithEmail: async () => null,
  signUpWithEmail: async () => null,
  signInQuickAdmin: async () => null,
  logOut: async () => {},
});

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState<boolean>(false);
  const [isFirestoreConnected, setIsFirestoreConnected] = useState<boolean>(false);

  useEffect(() => {
    // التحقق من حالة الاتصال بـ Firestore
    testFirestoreConnection()
      .then((connected) => setIsFirestoreConnected(connected))
      .catch(() => setIsFirestoreConnected(false));

    // مراقبة حالة تسجيل الدخول عبر Firebase Auth
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  const isAdmin = useMemo(() => {
    if (!currentUser) return false;
    // المستخدم الأساسي لمشرف النظام من البيانات المعتمدة
    if (currentUser.email === 'abnaltaeebat2@gmail.com') return true;
    return Boolean(currentUser.emailVerified);
  }, [currentUser]);

  const value = useMemo(
    () => ({
      currentUser,
      isAuthReady,
      isAdmin,
      isFirestoreConnected,
      signInWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      signInQuickAdmin,
      logOut,
    }),
    [currentUser, isAuthReady, isAdmin, isFirestoreConnected]
  );

  return <FirebaseContext.Provider value={value}>{children}</FirebaseContext.Provider>;
};

export const useFirebase = () => useContext(FirebaseContext);
