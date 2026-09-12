import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Candidate, ApplicationSettings, User, Infographic } from './types';
import { db } from './lib/firebase';
import { collection, doc, setDoc, updateDoc, deleteDoc, onSnapshot, getDoc } from 'firebase/firestore';

interface AppState {
  settings: ApplicationSettings;
  candidates: Candidate[];
  users: User[];
  currentUser: User | null;
  userRole: 'SUPER_ADMIN' | 'PENTADBIR' | 'TAHFIZ' | 'AKADEMIK' | null;
  infographics: Infographic[];
}

interface AppContextType extends AppState {
  updateSettings: (settings: Partial<ApplicationSettings>) => void;
  syncSettingsToServer: () => void; // Kept for API compatibility, but will auto-sync
  saveCandidate: (candidate: Candidate) => void;
  updateCandidate: (ic: string, data: Partial<Candidate>) => void;
  deleteCandidate: (ic: string) => void;
  login: (username: string, password?: string) => boolean;
  logout: () => void;
  addUser: (user: User) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
  addInfographic: (info: Infographic) => void;
  deleteInfographic: (id: string) => void;
}

const defaultSettings: ApplicationSettings = {
  borangBuka: false,
  tarikhBukaBorang: '2026-01-01',
  temudugaBuka: false,
  tarikhBukaTemuduga: '2026-09-01',
  tawaranBuka: false,
  tarikhBukaTawaran: '2026-11-01',
  tarikhTemuduga: '8 November 2025',
  tarikhLaporDiri: '3 Januari 2027',
  tarikhAkhirTerimaTawaran: '28 November 2026',
  tarikhSuratPanggilan: '8 September 2026',
  hariTemuduga: 'Sabtu',
  masaTemuduga: '8.00 pagi',
  tempatTemuduga: 'Laman Selera, SMA Kota Gelanggi 3',
  pakaianTemuduga: 'Uniform sekolah',
  tahfizItems: [
    { id: 'hafazan', name: 'Hafazan', weight: 70 },
    { id: 'tilawah', name: 'Tilawah', weight: 25 },
    { id: 'sahsiah', name: 'Sahsiah', weight: 5 }
  ],
  akademikItems: [
    { id: 'bm', name: 'Bahasa Melayu', weight: 25 },
    { id: 'bi', name: 'Bahasa Inggeris', weight: 25 },
    { id: 'matematik', name: 'Matematik', weight: 25 },
    { id: 'sains', name: 'Sains', weight: 25 }
  ]
};

const defaultUsers: User[] = [
  { id: 'admin1', username: 'admin', password: '123', name: 'Super Admin', role: 'SUPER_ADMIN' },
  { id: 'tahfiz1', username: 'tahfiz1', password: '123', name: 'Ustaz/Ustazah', role: 'TAHFIZ' },
  { id: 'akademik1', username: 'akademik1', password: '123', name: 'Cikgu Akademik', role: 'AKADEMIK' }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AppState>({
    settings: defaultSettings,
    candidates: [],
    users: defaultUsers,
    currentUser: null,
    userRole: null,
    infographics: [],
  });

  // Listen to Firestore
  useEffect(() => {
    // 1. Settings
    const unsubSettings = onSnapshot(doc(db, 'config', 'main'), (docSnap) => {
      if (docSnap.exists()) {
        setState(prev => ({ ...prev, settings: { ...defaultSettings, ...docSnap.data() as ApplicationSettings } }));
      } else {
        // Initialize default settings in Firestore
        setDoc(doc(db, 'config', 'main'), defaultSettings).catch(console.error);
      }
    });

    // 2. Users
    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      const usersList: User[] = [];
      snapshot.forEach(doc => {
        usersList.push({ id: doc.id, ...doc.data() } as User);
      });
      if (usersList.length === 0) {
        // Initialize default users if empty
        defaultUsers.forEach(u => setDoc(doc(db, 'users', u.id), u).catch(console.error));
      } else {
        setState(prev => ({ ...prev, users: usersList }));
      }
    });

    // 3. Candidates
    const unsubCandidates = onSnapshot(collection(db, 'candidates'), (snapshot) => {
      const candidatesList: Candidate[] = [];
      snapshot.forEach(doc => {
        candidatesList.push({ id: doc.id, ...doc.data() } as Candidate);
      });
      setState(prev => ({ ...prev, candidates: candidatesList }));
    });

    // 4. Infographics
    const unsubInfographics = onSnapshot(collection(db, 'infographics'), (snapshot) => {
      const infoList: Infographic[] = [];
      snapshot.forEach(doc => {
        infoList.push({ id: doc.id, ...doc.data() } as Infographic);
      });
      setState(prev => ({ ...prev, infographics: infoList }));
    });

    return () => {
      unsubSettings();
      unsubUsers();
      unsubCandidates();
      unsubInfographics();
    };
  }, []);

  const updateSettings = async (newSettings: Partial<ApplicationSettings>) => {
    // 1. Update React state immediately so UI feels responsive
    setState(prev => {
        const updatedSettings = { ...prev.settings, ...newSettings };
        
        // 2. Also try to push to Firebase in background to be safe
        updateDoc(doc(db, 'config', 'main'), newSettings).catch(e => {
            console.error("Firebase background sync failed:", e);
        });
        
        return { ...prev, settings: updatedSettings };
    });
  };

  const syncSettingsToServer = async () => {
    try {
      await setDoc(doc(db, 'config', 'main'), state.settings);
      alert('Telah Berjaya! Semua Tetapan Sistem Berjaya Disimpan ke dalam Pangkalan Data.');
    } catch (e) {
      console.error("Ralat menyimpan tetapan:", e);
      alert('Ralat! Tetapan tidak berjaya disimpan.');
    }
  };

  const saveCandidate = async (candidate: Candidate) => {
    try {
      await setDoc(doc(db, 'candidates', candidate.ic), candidate);
    } catch (e) {
      console.error("Error saving candidate:", e);
      alert('Ralat menyimpan data permohonan.');
    }
  };

  const updateCandidate = async (ic: string, data: Partial<Candidate>) => {
    try {
      await updateDoc(doc(db, 'candidates', ic), data);
    } catch (e) {
      console.error("Error updating candidate:", e);
    }
  };

  const deleteCandidate = async (ic: string) => {
    try {
      await deleteDoc(doc(db, 'candidates', ic));
    } catch (e) {
      console.error("Error deleting candidate:", e);
    }
  };

  const login = (username: string, password?: string) => {
    const user = state.users.find(u => u.username === username);
    if (user && (user.password === password || (!user.password && password === '123'))) {
      setState(prev => ({ ...prev, currentUser: user, userRole: user.role }));
      return true;
    }
    return false;
  };

  const logout = () => {
    setState(prev => ({ ...prev, currentUser: null, userRole: null }));
  };

  const addUser = async (user: User) => {
    try {
      await setDoc(doc(db, 'users', user.id || Date.now().toString()), user);
    } catch (e) {
      console.error("Error adding user:", e);
    }
  };

  const updateUser = async (id: string, user: Partial<User>) => {
    try {
      await updateDoc(doc(db, 'users', id), user);
    } catch (e) {
      console.error("Error updating user:", e);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'users', id));
    } catch (e) {
      console.error("Error deleting user:", e);
    }
  };

  const addInfographic = async (info: Infographic) => {
    try {
      await setDoc(doc(db, 'infographics', info.id || Date.now().toString()), info);
    } catch (e) {
      console.error("Error adding infographic:", e);
    }
  };

  const deleteInfographic = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'infographics', id));
    } catch (e) {
      console.error("Error deleting infographic:", e);
    }
  };

  return (
    <AppContext.Provider value={{
      ...state,
      updateSettings,
      syncSettingsToServer,
      saveCandidate,
      updateCandidate,
      deleteCandidate,
      login,
      logout,
      addUser,
      updateUser,
      deleteUser,
      addInfographic,
      deleteInfographic
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
