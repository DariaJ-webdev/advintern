'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
} from 'react';
import {
  User,
  signInAnonymously,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth } from './firebase/init';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  isModalOpen: boolean;
  openModal: (path?: string) => void;
  closeModal: () => void;
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  guestLogin: () => Promise<void>;
  savedBooks: string[];
  toggleSaveBook: (bookId: string) => void;
  fontSize: string;
  setFontSize: (size: string) => void;
  finishedBooks: string[];
  finishBook: (bookId: string) => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState("16px");

  const [savedBooks, setSavedBooks] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem('summarist_library');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [finishedBooks, setFinishedBooks] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem('summarist_finished');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('summarist_library', JSON.stringify(savedBooks));
    }
  }, [savedBooks]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('summarist_finished', JSON.stringify(finishedBooks));
    }
  }, [finishedBooks]);

  const openModal = (path?: string) => {
    if (path) setRedirectPath(path);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setRedirectPath(null);
  };

  const value = useMemo<AuthContextType>(
    () => ({
      isModalOpen,
      openModal,
      closeModal,
      user,
      loading,
      savedBooks,
      finishedBooks,
      fontSize,
      setFontSize,

      toggleSaveBook: (bookId: string) => {
        setSavedBooks((prev) =>
          prev.includes(bookId)
            ? prev.filter((id) => id !== bookId)
            : [...prev, bookId]
        );
      },

      finishBook: (bookId: string) => {
        setFinishedBooks((prev) =>
          prev.includes(bookId) ? prev : [...prev, bookId]
        );
        setSavedBooks((prev) => prev.filter((id) => id !== bookId));
      },

      login: async (email: string, pass: string) => {
        try {
          await signInWithEmailAndPassword(auth, email, pass);
          closeModal();
          // If coming from upgrade flow, go to choose-plan
          const destination = redirectPath === 'upgrade' ? '/choose-plan' : (redirectPath || '/for-you');
          router.push(destination);
          setRedirectPath(null);
        } catch (error) {
          handleAuthError(error);
        }
      },

      register: async (email: string, pass: string) => {
        try {
          await createUserWithEmailAndPassword(auth, email, pass);
          closeModal();
          // If coming from upgrade flow, go to choose-plan
          const destination = redirectPath === 'upgrade' ? '/choose-plan' : (redirectPath || '/for-you');
          router.push(destination);
          setRedirectPath(null);
        } catch (error) {
          handleAuthError(error);
        }
      },

      guestLogin: async () => {
        try {
          await signInAnonymously(auth);
          closeModal();
          // Guest users always go to for-you, regardless of redirect path
          router.push('/for-you');
          setRedirectPath(null);
        } catch (error) {
          handleAuthError(error);
        }
      },

      logout: async () => {
        try {
          await signOut(auth);
          router.push('/');
        } catch (error) {
          handleAuthError(error);
        }
      },
    }),
    [isModalOpen, user, loading, savedBooks, router, redirectPath, finishedBooks, fontSize]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

function handleAuthError(error: unknown) {
  if (error instanceof FirebaseError) {
    alert(error.message);
  } else {
    alert('An unexpected error occurred');
  }
}

