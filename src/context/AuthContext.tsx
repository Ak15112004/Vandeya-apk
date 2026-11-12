import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User as FirebaseUser, 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, testConnection } from '../firebase/config';
import { handleFirestoreError, OperationType } from '../firebase/errorHandler';
import { UserProfile } from '../types';
import { SEED_USERS } from '../data/seedData';

interface AuthContextType {
  currentUser: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  switchDemoUser: (userId: string) => void;
  updateCurrentUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  demoUsers: UserProfile[];
}

const ADMIN_EMAIL = 'ay2608020@gmail.com';

const DEFAULT_GUEST: UserProfile = {
  uid: 'vandeya_creator_guest',
  vandeyaId: 'VD-102948',
  email: 'creator@vandeya.in',
  displayName: 'Aarav Mehta 🇮🇳',
  username: 'aarav_creates',
  bio: 'Digital artist & storyteller from Jaipur. Celebrating the cultural richness of Bharat.',
  photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  bannerURL: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
  isVerified: true,
  isPrivate: false,
  role: 'creator',
  language: 'hi',
  location: 'Jaipur, Rajasthan',
  followersCount: 14200,
  followingCount: 320,
  postsCount: 48,
  badges: ['Top Creator', 'Heritage Voice'],
  createdAt: new Date().toISOString(),
};

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  firebaseUser: null,
  loading: true,
  isAdmin: false,
  signInWithGoogle: async () => {},
  signOut: async () => {},
  switchDemoUser: () => {},
  updateCurrentUserProfile: async () => {},
  demoUsers: [],
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(DEFAULT_GUEST);
  const [loading, setLoading] = useState<boolean>(true);

  // Test connection on boot
  useEffect(() => {
    testConnection();
  }, []);

  // Sync Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const snap = await getDoc(userDocRef);
          
          if (snap.exists()) {
            setCurrentUser(snap.data() as UserProfile);
          } else {
            // Create user document
            const isUserAdmin = user.email === ADMIN_EMAIL;
            const newProfile: UserProfile = {
              uid: user.uid,
              vandeyaId: `VD-${Math.floor(100000 + Math.random() * 900000)}`,
              email: user.email || '',
              displayName: user.displayName || 'Vandeya Citizen',
              username: (user.email?.split('@')[0] || `user_${user.uid.slice(0, 5)}`).replace(/[^a-zA-Z0-9_]/g, '_'),
              bio: 'Proud citizen of Bharat on VANDEYA.',
              photoURL: user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
              bannerURL: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&auto=format&fit=crop&q=80',
              isVerified: isUserAdmin,
              isPrivate: false,
              role: isUserAdmin ? 'admin' : 'user',
              language: 'en',
              followersCount: 0,
              followingCount: 0,
              postsCount: 0,
              createdAt: new Date().toISOString(),
            };

            await setDoc(userDocRef, newProfile);
            setCurrentUser(newProfile);
          }
        } catch (error) {
          console.error('Failed to sync user profile with Firestore:', error);
          // Keep current user with fallback
          setCurrentUser({
            uid: user.uid,
            vandeyaId: `VD-${Math.floor(100000 + Math.random() * 900000)}`,
            email: user.email || '',
            displayName: user.displayName || 'Vandeya Citizen',
            username: (user.email?.split('@')[0] || 'citizen').replace(/[^a-zA-Z0-9_]/g, '_'),
            bio: 'Vandeya user',
            photoURL: user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
            bannerURL: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&auto=format&fit=crop&q=80',
            isVerified: user.email === ADMIN_EMAIL,
            isPrivate: false,
            role: user.email === ADMIN_EMAIL ? 'admin' : 'user',
            language: 'en',
            followersCount: 1,
            followingCount: 1,
            postsCount: 0,
            createdAt: new Date().toISOString(),
          });
        }
      } else {
        // If not signed in to Firebase, keep default guest profile active
        if (!currentUser) {
          setCurrentUser(DEFAULT_GUEST);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Google Sign-in failed:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setCurrentUser(DEFAULT_GUEST);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const switchDemoUser = (userId: string) => {
    if (userId === 'admin_user') {
      setCurrentUser({
        uid: 'admin_ay2608020',
        vandeyaId: 'VD-000001',
        email: ADMIN_EMAIL,
        displayName: 'Platform Admin (AY)',
        username: 'admin_vandeya',
        bio: 'VANDEYA Security & Platform Operations Super Admin. Guarding India’s digital sovereignty.',
        photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
        bannerURL: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&auto=format&fit=crop&q=80',
        isVerified: true,
        isPrivate: false,
        role: 'admin',
        language: 'en',
        location: 'New Delhi HQ',
        followersCount: 500000,
        followingCount: 25,
        postsCount: 120,
        badges: ['Super Admin', 'Security Officer'],
        createdAt: '2026-01-01T00:00:00.000Z',
      });
      return;
    }

    if (userId === 'guest') {
      setCurrentUser(DEFAULT_GUEST);
      return;
    }

    const found = SEED_USERS.find((u) => u.uid === userId);
    if (found) {
      setCurrentUser(found);
    }
  };

  const updateCurrentUserProfile = async (updates: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates, updatedAt: new Date().toISOString() };
    setCurrentUser(updated);

    if (firebaseUser) {
      const userRef = doc(db, 'users', currentUser.uid);
      try {
        await setDoc(userRef, updated, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `users/${currentUser.uid}`);
      }
    }
  };

  const isAdmin = currentUser?.email === ADMIN_EMAIL || currentUser?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        firebaseUser,
        loading,
        isAdmin,
        signInWithGoogle,
        signOut,
        switchDemoUser,
        updateCurrentUserProfile,
        demoUsers: [
          DEFAULT_GUEST,
          ...SEED_USERS,
          {
            uid: 'admin_ay2608020',
            vandeyaId: 'VD-000001',
            email: ADMIN_EMAIL,
            displayName: 'Platform Admin (ay2608020)',
            username: 'admin_vandeya',
            bio: 'Platform Super Admin & Safety Guardian',
            photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
            bannerURL: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&auto=format&fit=crop&q=80',
            isVerified: true,
            isPrivate: false,
            role: 'admin',
            language: 'en',
            followersCount: 500000,
            followingCount: 25,
            postsCount: 120,
            createdAt: '2026-01-01T00:00:00.000Z',
          },
        ],
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
