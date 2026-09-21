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
  isInitialized: boolean;
}

interface AppContextType extends AppState {
  updateSettings: (settings: Partial<ApplicationSettings>) => void;
  syncSettingsToServer: () => void; // Kept for API compatibility, but will auto-sync
  saveCandidate: (candidate: Candidate) => Promise<void>;
  updateCandidate: (ic: string, data: Partial<Candidate>) => Promise<void>;
  deleteCandidate: (ic: string) => Promise<void>;
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
  tarikhTutupBorang: '',
  temudugaBuka: false,
  tarikhBukaTemuduga: '2026-09-01',
  tarikhTutupTemuduga: '',
  tawaranBuka: false,
  tarikhBukaTawaran: '2026-11-01',
  tarikhTutupTawaran: '',
  tarikhTemuduga: '8 November 2025',
  tarikhLaporDiri: '3 Januari 2027',
  tarikhAkhirTerimaTawaran: '28 November 2026',
  tarikhSuratPanggilan: '8 September 2026',
  hariTemuduga: 'Sabtu',
  masaTemuduga: '8.00 pagi',
  tempatTemuduga: 'Laman Selera, SMA Kota Gelanggi 3',
  pakaianTemuduga: 'Uniform sekolah',
  sesiKemasukan: '2026 / 2027',
  borangPendaftaranUrl: '',
  namaPengetua: '',
  tandatanganPengetua: '',
  borangTingkatan1Link: '',
  utamaPanduanLink: '',
  utamaContent: '',
  panduanContent: '',
  rujukanSuratTawaran: 'JPNP.SPI.800-1/1/4 Jld.2',
  tarikhSuratTawaran: '17 November 2025',
  masaLaporDiri: '8.30 PAGI',
  tandatanganPengarahTawaran: '',
  namaPengarahTawaran: 'YAHAYA BIN TAHIR',
  jawatanPengarahTawaran1: 'Ketua Penolong Pengarah Kanan',
  jawatanPengarahTawaran2: 'Sektor Pendidikan Islam',
  jawatanPengarahTawaran3: 'b.p Pengarah Pendidikan Pahang',
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

const SETTINGS_STORAGE_KEY = 'smag3_settings_cache_v2';

const sanitizeForFirestore = (obj: any): any => {
  if (obj === undefined) return null;
  if (obj === null) return null;
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeForFirestore(item));
  }
  if (typeof obj === 'object') {
    const res: Record<string, any> = {};
    for (const key of Object.keys(obj)) {
      const val = obj[key];
      if (val !== undefined) {
        res[key] = sanitizeForFirestore(val);
      }
    }
    return res;
  }
  return obj;
};

const loadCachedSettings = (): ApplicationSettings => {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return { ...defaultSettings, ...parsed };
      }
    }
  } catch (e) {
    console.warn('Gagal membaca cache tetapan:', e);
  }
  return defaultSettings;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AppState>(() => ({
    settings: loadCachedSettings(),
    candidates: [],
    users: defaultUsers,
    currentUser: null,
    userRole: null,
    infographics: [],
    isInitialized: false,
  }));

  // Listen to Firestore
  useEffect(() => {
    // 1. Settings
    const unsubSettings = onSnapshot(doc(db, 'config', 'main'), (docSnap) => {
      if (docSnap.exists()) {
        const firestoreData = docSnap.data() as ApplicationSettings;
        const cleanFirestoreData: any = {};
        for (const [k, v] of Object.entries(firestoreData)) {
          if (v !== null && v !== undefined) {
            cleanFirestoreData[k] = v;
          }
        }
        setState(prev => {
          const merged = { ...defaultSettings, ...prev.settings, ...cleanFirestoreData };
          try {
            localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(merged));
          } catch (e) {
            console.warn('Gagal simpan cache ke localStorage:', e);
          }
          return { ...prev, settings: merged, isInitialized: true };
        });
      } else {
        // Document does not exist yet in Firestore - preserve current cached settings
        setState(prev => {
          const toSave = sanitizeForFirestore(prev.settings);
          setDoc(doc(db, 'config', 'main'), toSave, { merge: true }).catch(err => {
            console.error("Gagal create config di Firestore:", err);
          });
          return { ...prev, isInitialized: true };
        });
      }
    }, (error) => {
      console.error("Firestore onSnapshot error for settings:", error);
      setState(prev => ({ ...prev, isInitialized: true }));
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
    // 1. Update React state & localStorage immediately
    let nextSettings: ApplicationSettings = defaultSettings;
    setState(prev => {
      nextSettings = { ...prev.settings, ...newSettings };
      try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(nextSettings));
      } catch (e) {
        console.warn("Gagal simpan settings ke localStorage:", e);
      }
      return { ...prev, settings: nextSettings };
    });

    // 2. Persist safely to Firestore without undefined errors
    try {
      const cleanData = sanitizeForFirestore(nextSettings);
      await setDoc(doc(db, 'config', 'main'), cleanData, { merge: true });
    } catch (e) {
      console.error("Firebase background sync failed in updateSettings:", e);
    }
  };

  const syncSettingsToServer = async () => {
    try {
      let settingsToSave = defaultSettings;
      setState(prev => {
        settingsToSave = prev.settings;
        return prev;
      });
      const cleanData = sanitizeForFirestore(settingsToSave);
      await setDoc(doc(db, 'config', 'main'), cleanData, { merge: true });
      try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settingsToSave));
      } catch {}
    } catch (e: any) {
      console.error("Ralat menyimpan tetapan:", e);
      throw e;
    }
  };

  const saveCandidate = async (candidate: Candidate) => {
    try {
      const cleanData = JSON.parse(JSON.stringify(candidate));
      // Remove any slashes from IC if used as document ID
      const safeId = String(cleanData.ic || cleanData.id).replace(/[^a-zA-Z0-9_-]/g, '');
      await setDoc(doc(db, 'candidates', safeId), cleanData);
    } catch (e) {
      console.error("Error saving candidate:", e);
      alert('Ralat menyimpan data permohonan: ' + (e as any).message);
      throw e;
    }
  };

  const updateCandidate = async (ic: string, data: Partial<Candidate>) => {
    try {
      const cleanData = JSON.parse(JSON.stringify(data));
      const safeId = String(ic).replace(/[^a-zA-Z0-9_-]/g, '');
      await updateDoc(doc(db, 'candidates', safeId), cleanData);
    } catch (e) {
      console.error("Error updating candidate:", e);
    }
  };

  const deleteCandidate = async (ic: string) => {
    try {
      const safeId = String(ic).replace(/[^a-zA-Z0-9_-]/g, '');
      await deleteDoc(doc(db, 'candidates', safeId));
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
