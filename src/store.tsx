import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Candidate, ApplicationSettings, User, Infographic } from './types';
import { db } from './lib/firebase';
import { collection, doc, setDoc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';

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
  syncSettingsToServer: () => void;
  saveCandidate: (candidate: Candidate) => Promise<void>;
  updateCandidate: (ic: string, data: Partial<Candidate>) => Promise<void>;
  deleteCandidate: (ic: string) => Promise<void>;
  login: (username: string, password?: string) => boolean;
  logout: () => void;
  addUser: (user: User) => void;
  updateUser: (id: string, user: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => void;
  addInfographic: (info: Infographic) => void;
  deleteInfographic: (id: string) => void;
}

const defaultSettings: ApplicationSettings = {
  borangBuka: true,
  tarikhBukaBorang: '2026-09-07',
  tarikhTutupBorang: '2026-09-30',
  temudugaBuka: false,
  tarikhBukaTemuduga: '2026-10-02',
  tarikhTutupTemuduga: '2026-10-09',
  tawaranBuka: false,
  tarikhBukaTawaran: '2026-10-19',
  tarikhTutupTawaran: '',
  tarikhTemuduga: '10 Oktober 2026',
  tarikhLaporDiri: '3 Januari 2027',
  tarikhAkhirTerimaTawaran: '28 November 2026',
  tarikhSuratPanggilan: '8 September 2026',
  hariTemuduga: 'Sabtu',
  masaTemuduga: '8.00 pagi',
  tempatTemuduga: 'Laman Selera, SMA Kota Gelanggi 3',
  pakaianTemuduga: 'Uniform sekolah',
  sesiKemasukan: '2027',
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
const USERS_STORAGE_KEY = 'smag3_users_cache_v2';
const CANDIDATES_STORAGE_KEY = 'smag3_candidates_cache_v2';

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

const loadCachedUsers = (): User[] => {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Gagal membaca cache pengguna:', e);
  }
  return defaultUsers;
};

const loadCachedCandidates = (): Candidate[] => {
  try {
    const raw = localStorage.getItem(CANDIDATES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Gagal membaca cache calon:', e);
  }
  return [];
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AppState>(() => ({
    settings: loadCachedSettings(),
    candidates: loadCachedCandidates(),
    users: loadCachedUsers(),
    currentUser: null,
    userRole: null,
    infographics: [],
    isInitialized: true, // Immediate render prevents endless spinning screen
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
      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        if (data.username) {
          usersList.push({ id: docSnap.id, ...data } as User);
        }
      });
      // Ensure default admin users always exist
      defaultUsers.forEach(u => {
        if (!usersList.some(existing => existing.username?.toLowerCase() === u.username.toLowerCase())) {
          usersList.push(u);
          setDoc(doc(db, 'users', u.id), u, { merge: true }).catch(console.error);
        }
      });
      setState(prev => {
        const updatedCurrentUser = prev.currentUser 
          ? usersList.find(u => u.id === prev.currentUser?.id || u.username.toLowerCase() === prev.currentUser?.username.toLowerCase()) || prev.currentUser
          : null;
        return {
          ...prev,
          users: usersList,
          currentUser: updatedCurrentUser,
          userRole: updatedCurrentUser?.role || prev.userRole
        };
      });
      try {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(usersList));
      } catch (e) {}
    }, (error) => {
      console.error("Firestore users error:", error);
    });

    // 3. Candidates
    const unsubCandidates = onSnapshot(collection(db, 'candidates'), (snapshot) => {
      const candidatesList: Candidate[] = [];
      snapshot.forEach(docSnap => {
        candidatesList.push({ id: docSnap.id, ...docSnap.data() } as Candidate);
      });
      setState(prev => ({ ...prev, candidates: candidatesList }));
      try {
        localStorage.setItem(CANDIDATES_STORAGE_KEY, JSON.stringify(candidatesList));
      } catch (e) {}
    }, (error) => {
      console.error("Firestore candidates error:", error);
    });

    // 4. Infographics
    const unsubInfographics = onSnapshot(collection(db, 'infographics'), (snapshot) => {
      const infoList: Infographic[] = [];
      snapshot.forEach(docSnap => {
        infoList.push({ id: docSnap.id, ...docSnap.data() } as Infographic);
      });
      setState(prev => ({ ...prev, infographics: infoList }));
    }, (error) => {
      console.error("Firestore infographics error:", error);
    });

    return () => {
      unsubSettings();
      unsubUsers();
      unsubCandidates();
      unsubInfographics();
    };
  }, []);

  const updateSettings = async (newSettings: Partial<ApplicationSettings>) => {
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
      const safeId = String(cleanData.ic || cleanData.id).replace(/[^a-zA-Z0-9_-]/g, '');
      if (!safeId) {
        throw new Error('ID atau No. Kad Pengenalan calon tidak sah');
      }
      await setDoc(doc(db, 'candidates', safeId), cleanData);

      // Instant local update so candidate is immediately available
      setState(prev => {
        const nextList = [cleanData, ...prev.candidates.filter(c => c.ic !== cleanData.ic && c.id !== cleanData.id)];
        try {
          localStorage.setItem(CANDIDATES_STORAGE_KEY, JSON.stringify(nextList));
        } catch {}
        return { ...prev, candidates: nextList };
      });
    } catch (e) {
      console.error("Error saving candidate:", e);
      throw e;
    }
  };

  const updateCandidate = async (ic: string, data: Partial<Candidate>) => {
    try {
      const cleanData = JSON.parse(JSON.stringify(data));
      const safeId = String(ic).replace(/[^a-zA-Z0-9_-]/g, '');
      await updateDoc(doc(db, 'candidates', safeId), cleanData);

      setState(prev => {
        const nextList = prev.candidates.map(c => c.ic === ic ? { ...c, ...cleanData } : c);
        try {
          localStorage.setItem(CANDIDATES_STORAGE_KEY, JSON.stringify(nextList));
        } catch {}
        return { ...prev, candidates: nextList };
      });
    } catch (e) {
      console.error("Error updating candidate:", e);
    }
  };

  const deleteCandidate = async (ic: string) => {
    try {
      const safeId = String(ic).replace(/[^a-zA-Z0-9_-]/g, '');
      await deleteDoc(doc(db, 'candidates', safeId));

      setState(prev => {
        const nextList = prev.candidates.filter(c => c.ic !== ic);
        try {
          localStorage.setItem(CANDIDATES_STORAGE_KEY, JSON.stringify(nextList));
        } catch {}
        return { ...prev, candidates: nextList };
      });
    } catch (e) {
      console.error("Error deleting candidate:", e);
    }
  };

  const login = (username: string, password?: string) => {
    const cleanUser = username?.trim().toLowerCase();
    const cleanPass = password?.trim();
    const cachedUsers = loadCachedUsers();
    
    // Check in-memory state users first, then cached users, then fallback defaultUsers
    const user = state.users.find(u => u.username?.trim().toLowerCase() === cleanUser)
      || cachedUsers.find(u => u.username?.trim().toLowerCase() === cleanUser)
      || defaultUsers.find(u => u.username.toLowerCase() === cleanUser);

    if (user && (user.password === cleanPass || (!user.password && cleanPass === '123'))) {
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
      const docId = user.id || Date.now().toString();
      await setDoc(doc(db, 'users', docId), user, { merge: true });
      setState(prev => {
        const nextUsers = [...prev.users.filter(u => u.id !== docId), { ...user, id: docId }];
        try {
          localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(nextUsers));
        } catch {}
        return { ...prev, users: nextUsers };
      });
    } catch (e) {
      console.error("Error adding user:", e);
    }
  };

  const updateUser = async (id: string, user: Partial<User>) => {
    // 1. Instantly update React state & localStorage
    setState(prev => {
      const nextUsers = prev.users.map(u => u.id === id ? { ...u, ...user } : u);
      try {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(nextUsers));
      } catch (e) {
        console.warn('Gagal simpan users ke localStorage:', e);
      }
      const updatedCurrentUser = prev.currentUser?.id === id 
        ? { ...prev.currentUser, ...user } 
        : prev.currentUser;
      return { 
        ...prev, 
        users: nextUsers, 
        currentUser: updatedCurrentUser,
        userRole: updatedCurrentUser?.role || prev.userRole
      };
    });

    // 2. Persist to Firestore with setDoc merge
    try {
      await setDoc(doc(db, 'users', id), user, { merge: true });
    } catch (e) {
      console.error("Error updating user in Firestore:", e);
      throw e;
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'users', id));
      setState(prev => {
        const nextUsers = prev.users.filter(u => u.id !== id);
        try {
          localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(nextUsers));
        } catch {}
        return { ...prev, users: nextUsers };
      });
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
