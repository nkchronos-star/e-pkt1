import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Candidate, ApplicationSettings, User, Infographic } from './types';
import { db } from './lib/firebase';
import { collection, doc, setDoc, updateDoc, deleteDoc, onSnapshot, getDoc, getDocs, query, where } from 'firebase/firestore';
import { DEFAULT_TANDATANGAN_PENGETUA, DEFAULT_TANDATANGAN_PENGARAH } from './lib/imageUtils';

export const getTodayMalaysia = (): string => {
  try {
    return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kuala_Lumpur' }).format(new Date());
  } catch (e) {
    return new Date().toISOString().split('T')[0];
  }
};

export const isDateActive = (tarikhMula?: string, tarikhAkhir?: string): boolean => {
  if (!tarikhMula || tarikhMula.trim() === '') return false;
  const today = getTodayMalaysia();
  if (tarikhAkhir && tarikhAkhir.trim() !== '') {
    return today >= tarikhMula && today <= tarikhAkhir;
  }
  return today >= tarikhMula;
};

export const applyAutoDates = (s: ApplicationSettings): ApplicationSettings => {
  const res = { ...s };
  if (s.tarikhBukaBorang) {
    res.borangBuka = isDateActive(s.tarikhBukaBorang, s.tarikhTutupBorang);
  }
  if (s.tarikhBukaTemuduga) {
    res.temudugaBuka = isDateActive(s.tarikhBukaTemuduga, s.tarikhTutupTemuduga);
  }
  if (s.tarikhBukaTawaran) {
    res.tawaranBuka = isDateActive(s.tarikhBukaTawaran, s.tarikhTutupTawaran);
  }
  return res;
};

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
  syncSettingsToServer: (customPartial?: Partial<ApplicationSettings>) => Promise<void>;
  saveCandidate: (candidate: Candidate) => Promise<void>;
  updateCandidate: (ic: string, data: Partial<Candidate>) => Promise<void>;
  deleteCandidate: (ic: string) => Promise<void>;
  login: (username: string, password?: string) => Promise<boolean>;
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
  namaPengetua: 'HAJAH JUITA BINTI HAMZAH',
  tandatanganPengetua: DEFAULT_TANDATANGAN_PENGETUA,
  borangTingkatan1Link: '',
  utamaPanduanLink: '',
  utamaContent: '',
  panduanContent: '',
  rujukanSuratTawaran: 'JPNP.SPI.800-1/1/4 Jld.2',
  tarikhSuratTawaran: '17 November 2025',
  masaLaporDiri: '8.30 PAGI',
  tandatanganPengarahTawaran: DEFAULT_TANDATANGAN_PENGARAH,
  namaPengarahTawaran: 'HAJI HASDAN BIN HASAN',
  jawatanPengarahTawaran1: 'Ketua Penolong Pengarah Kanan',
  jawatanPengarahTawaran2: 'Sektor Pendidikan Islam',
  jawatanPengarahTawaran3: 'b.p Pengarah Pendidikan Pahang',
  tahfizItems: [
    { id: 'hafazan', name: 'Hafazan', weight: 70 },
    { id: 'tilawah', name: 'Tilawah', weight: 25 },
    { id: 'sahsiah', name: 'Sahsiah', weight: 5 }
  ],
  akademikItems: [
    { id: 'matematik', name: 'Matematik', weight: 50 },
    { id: 'sains', name: 'Sains', weight: 50 }
  ]
};

const defaultUsers: User[] = [
  { id: 'admin1', username: 'admin', password: '@cft2001', name: 'Super Admin', role: 'SUPER_ADMIN' },
  { id: 'tahfiz1', username: 'tahfiz1', password: '123', name: 'Ustaz/Ustazah', role: 'TAHFIZ' },
  { id: 'akademik1', username: 'akademik1', password: '123', name: 'Cikgu Akademik', role: 'AKADEMIK' }
];

const SETTINGS_STORAGE_KEY = 'smag3_settings_cache_v2';
const USERS_STORAGE_KEY = 'smag3_users_cache_v2';
const CANDIDATES_STORAGE_KEY = 'smag3_candidates_cache_v2';

const purgeSensitiveDataFromBrowser = () => {
  try {
    const sensitiveKeys = [
      'sma_candidates',
      'sma_users',
      'smag3_candidates_cache',
      'smag3_users_cache',
      USERS_STORAGE_KEY,
      CANDIDATES_STORAGE_KEY
    ];
    sensitiveKeys.forEach(k => localStorage.removeItem(k));
  } catch {}
};
const SIG_PENGETUA_KEY = 'smag3_sig_pengetua_v1';
const SIG_PENGARAH_KEY = 'smag3_sig_pengarah_v1';

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
      if (val !== undefined && val !== null) {
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
    const cachedPengetuaSig = localStorage.getItem(SIG_PENGETUA_KEY);
    const cachedPengarahSig = localStorage.getItem(SIG_PENGARAH_KEY);

    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        const merged = { ...defaultSettings, ...parsed };
        if (merged.namaPengarahTawaran === 'YAHAYA BIN TAHIR' || !merged.namaPengarahTawaran) {
          merged.namaPengarahTawaran = 'HAJI HASDAN BIN HASAN';
        }
        if (!merged.jawatanPengarahTawaran1) {
          merged.jawatanPengarahTawaran1 = 'Ketua Penolong Pengarah Kanan';
        }
        if (cachedPengetuaSig && !merged.tandatanganPengetua) {
          merged.tandatanganPengetua = cachedPengetuaSig;
        }
        if (cachedPengarahSig && !merged.tandatanganPengarahTawaran) {
          merged.tandatanganPengarahTawaran = cachedPengarahSig;
        }
        if (!merged.tandatanganPengetua) {
          merged.tandatanganPengetua = DEFAULT_TANDATANGAN_PENGETUA;
        }
        if (!merged.tandatanganPengarahTawaran) {
          merged.tandatanganPengarahTawaran = DEFAULT_TANDATANGAN_PENGARAH;
        }
        if (Array.isArray(merged.akademikItems)) {
          merged.akademikItems = merged.akademikItems.filter((item: any) => 
            item.id !== 'bm' && item.id !== 'bi' && !item.name?.toLowerCase().includes('bahasa')
          );
          if (merged.akademikItems.length === 0) {
            merged.akademikItems = [
              { id: 'matematik', name: 'Matematik', weight: 50 },
              { id: 'sains', name: 'Sains', weight: 50 }
            ];
          }
        }
        return applyAutoDates(merged);
      }
    }
  } catch (e) {
    console.warn('Gagal membaca cache tetapan:', e);
  }
  return applyAutoDates(defaultSettings);
};

const SESSION_USER_KEY = 'sma_admin_session';

const loadCachedSessionUser = (): User | null => {
  try {
    const raw = localStorage.getItem(SESSION_USER_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.username) {
        return parsed as User;
      }
    }
  } catch (e) {
    console.warn('Gagal membaca sesi pentadbir:', e);
  }
  return null;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const initialUser = loadCachedSessionUser();

  const [state, setState] = useState<AppState>(() => {
    // Zero-leakage check: jika bukan pentadbir, padam sebarang sisa cache calon dan pengguna dari pelayar
    if (!initialUser) {
      purgeSensitiveDataFromBrowser();
    }

    return {
      settings: loadCachedSettings(),
      candidates: [],
      users: initialUser ? defaultUsers : [],
      currentUser: initialUser,
      userRole: initialUser ? initialUser.role : null,
      infographics: [],
      isInitialized: true,
    };
  });

  // 1. Dengar data awam sahaja (Settings & Infografik) untuk semua pelawat
  useEffect(() => {
    // 1. Settings
    const unsubSettings = onSnapshot(doc(db, 'config', 'main'), (docSnap) => {
      if (docSnap.exists()) {
        const firestoreData = docSnap.data() as ApplicationSettings;
        const cleanFirestoreData: any = {};
        for (const [k, v] of Object.entries(firestoreData)) {
          if (v !== null && v !== undefined && v !== '') {
            cleanFirestoreData[k] = v;
          }
        }
        if (cleanFirestoreData.namaPengarahTawaran === 'YAHAYA BIN TAHIR' || !cleanFirestoreData.namaPengarahTawaran) {
          cleanFirestoreData.namaPengarahTawaran = 'HAJI HASDAN BIN HASAN';
        }
        if (!cleanFirestoreData.jawatanPengarahTawaran1) {
          cleanFirestoreData.jawatanPengarahTawaran1 = 'Ketua Penolong Pengarah Kanan';
        }
        if (cleanFirestoreData.tandatanganPengetua) {
          try { localStorage.setItem(SIG_PENGETUA_KEY, cleanFirestoreData.tandatanganPengetua); } catch {}
        } else {
          cleanFirestoreData.tandatanganPengetua = DEFAULT_TANDATANGAN_PENGETUA;
        }
        if (cleanFirestoreData.tandatanganPengarahTawaran) {
          try { localStorage.setItem(SIG_PENGARAH_KEY, cleanFirestoreData.tandatanganPengarahTawaran); } catch {}
        } else {
          cleanFirestoreData.tandatanganPengarahTawaran = DEFAULT_TANDATANGAN_PENGARAH;
        }
        if (Array.isArray(cleanFirestoreData.akademikItems)) {
          cleanFirestoreData.akademikItems = cleanFirestoreData.akademikItems.filter((item: any) => 
            item.id !== 'bm' && item.id !== 'bi' && !item.name?.toLowerCase().includes('bahasa')
          );
          if (cleanFirestoreData.akademikItems.length === 0) {
            cleanFirestoreData.akademikItems = [
              { id: 'matematik', name: 'Matematik', weight: 50 },
              { id: 'sains', name: 'Sains', weight: 50 }
            ];
          }
        }
        setState(prev => {
          const merged = applyAutoDates({ ...defaultSettings, ...prev.settings, ...cleanFirestoreData });
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
          const autoApplied = applyAutoDates(prev.settings);
          const toSave = sanitizeForFirestore(autoApplied);
          setDoc(doc(db, 'config', 'main'), toSave, { merge: true }).catch(err => {
            console.error("Gagal create config di Firestore:", err);
          });
          return { ...prev, settings: autoApplied, isInitialized: true };
        });
      }
    }, (error) => {
      console.error("Firestore onSnapshot error for settings:", error);
      setState(prev => ({ ...prev, isInitialized: true }));
    });

    // 2. Infographics (Awam)
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
      unsubInfographics();
    };
  }, []);

  // 2. KAWALAN KESELAMATAN KETAT: Dengar senarai calon & pengguna HANYA jika pentadbir telah log masuk!
  useEffect(() => {
    if (!state.currentUser) {
      // Pastikan sifar data calon atau pengguna wujud dalam peranti pelawat awam
      setState(prev => ({ ...prev, candidates: [], users: [] }));
      purgeSensitiveDataFromBrowser();
      return;
    }

    // 2.1 Pengguna (Hanya untuk Admin Panel)
    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      const usersList: User[] = [];
      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        if (data.username) {
          usersList.push({ id: docSnap.id, ...data } as User);
        }
      });
      defaultUsers.forEach(u => {
        if (!usersList.some(existing => existing.username?.toLowerCase() === u.username.toLowerCase())) {
          usersList.push(u);
        }
      });
      setState(prev => ({
        ...prev,
        users: usersList,
      }));
    }, (error) => {
      console.error("Firestore users error:", error);
    });

    // 2.2 Calon-calon (Hanya dimuat turun oleh Pentadbir berdaftar)
    const unsubCandidates = onSnapshot(collection(db, 'candidates'), (snapshot) => {
      const candidatesList: Candidate[] = [];
      snapshot.forEach(docSnap => {
        candidatesList.push({ id: docSnap.id, ...docSnap.data() } as Candidate);
      });
      setState(prev => ({ ...prev, candidates: candidatesList }));
    }, (error) => {
      console.error("Firestore candidates error:", error);
    });

    return () => {
      unsubUsers();
      unsubCandidates();
    };
  }, [state.currentUser?.id, state.currentUser?.username]);

  const updateSettings = async (newSettings: Partial<ApplicationSettings>) => {
    let nextSettings: ApplicationSettings = defaultSettings;
    const fieldsToSave: Partial<ApplicationSettings> = { ...newSettings };

    setState(prev => {
      const merged = { ...prev.settings, ...newSettings };
      // If dates were changed, auto-compute corresponding status!
      if ('tarikhBukaBorang' in newSettings || 'tarikhTutupBorang' in newSettings) {
        merged.borangBuka = isDateActive(merged.tarikhBukaBorang, merged.tarikhTutupBorang);
        fieldsToSave.borangBuka = merged.borangBuka;
      }
      if ('tarikhBukaTemuduga' in newSettings || 'tarikhTutupTemuduga' in newSettings) {
        merged.temudugaBuka = isDateActive(merged.tarikhBukaTemuduga, merged.tarikhTutupTemuduga);
        fieldsToSave.temudugaBuka = merged.temudugaBuka;
      }
      if ('tarikhBukaTawaran' in newSettings || 'tarikhTutupTawaran' in newSettings) {
        merged.tawaranBuka = isDateActive(merged.tarikhBukaTawaran, merged.tarikhTutupTawaran);
        fieldsToSave.tawaranBuka = merged.tawaranBuka;
      }

      if (newSettings.tandatanganPengetua !== undefined) {
        if (newSettings.tandatanganPengetua) {
          try { localStorage.setItem(SIG_PENGETUA_KEY, newSettings.tandatanganPengetua); } catch {}
        } else {
          try { localStorage.removeItem(SIG_PENGETUA_KEY); } catch {}
        }
      }
      if (newSettings.tandatanganPengarahTawaran !== undefined) {
        if (newSettings.tandatanganPengarahTawaran) {
          try { localStorage.setItem(SIG_PENGARAH_KEY, newSettings.tandatanganPengarahTawaran); } catch {}
        } else {
          try { localStorage.removeItem(SIG_PENGARAH_KEY); } catch {}
        }
      }

      nextSettings = merged;
      try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(nextSettings));
      } catch (e) {
        console.warn("Gagal simpan settings ke localStorage:", e);
      }
      return { ...prev, settings: nextSettings };
    });

    try {
      // ONLY save specific fields changed with merge: true so sections never overwrite or erase each other!
      const cleanData = sanitizeForFirestore(fieldsToSave);
      await setDoc(doc(db, 'config', 'main'), cleanData, { merge: true });
    } catch (e) {
      console.error("Firebase background sync failed in updateSettings:", e);
    }
  };

  const syncSettingsToServer = async (customPartial?: Partial<ApplicationSettings>) => {
    try {
      let settingsToSave = defaultSettings;
      setState(prev => {
        const merged = customPartial ? { ...prev.settings, ...customPartial } : prev.settings;
        settingsToSave = applyAutoDates(merged);
        return { ...prev, settings: settingsToSave };
      });
      const dataToPersist = customPartial ? sanitizeForFirestore(customPartial) : sanitizeForFirestore(settingsToSave);
      await setDoc(doc(db, 'config', 'main'), dataToPersist, { merge: true });
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
      await setDoc(doc(db, 'candidates', safeId), cleanData, { merge: true });

      setState(prev => {
        const nextList = prev.candidates.map(c => (c.ic === ic || c.id === safeId) ? { ...c, ...cleanData } : c);
        return { ...prev, candidates: nextList };
      });
    } catch (e) {
      console.error("Error updating candidate:", e);
      throw e;
    }
  };

  const deleteCandidate = async (ic: string) => {
    try {
      const safeId = String(ic).replace(/[^a-zA-Z0-9_-]/g, '');
      await deleteDoc(doc(db, 'candidates', safeId));

      setState(prev => {
        const nextList = prev.candidates.filter(c => c.ic !== ic);
        return { ...prev, candidates: nextList };
      });
    } catch (e) {
      console.error("Error deleting candidate:", e);
    }
  };

  const login = async (username: string, password?: string): Promise<boolean> => {
    const cleanUser = username?.trim().toLowerCase();
    const cleanPass = password?.trim();
    if (!cleanUser) return false;

    // 1. Semak pengguna lalai tempatan (contohnya akaun pentadbir default)
    const localDefault = defaultUsers.find(u => u.username.toLowerCase() === cleanUser);
    if (localDefault && localDefault.password === cleanPass) {
      try {
        localStorage.setItem(SESSION_USER_KEY, JSON.stringify(localDefault));
      } catch {}
      setState(prev => ({ ...prev, currentUser: localDefault, userRole: localDefault.role }));
      return true;
    }

    // 2. Semakan terus ke Firestore untuk akaun guru/penilai tanpa memuat turun semua pengguna
    try {
      const q = query(collection(db, 'users'), where('username', '==', cleanUser));
      const querySnap = await getDocs(q);
      if (!querySnap.empty) {
        const matchedDoc = querySnap.docs[0];
        const freshUser = { id: matchedDoc.id, ...matchedDoc.data() } as User;
        if (freshUser.password === cleanPass) {
          try {
            localStorage.setItem(SESSION_USER_KEY, JSON.stringify(freshUser));
          } catch {}
          setState(prev => ({ ...prev, currentUser: freshUser, userRole: freshUser.role }));
          return true;
        }
      }
    } catch (err) {
      console.warn("Ralat semakan Firestore login:", err);
    }

    return false;
  };

  const logout = () => {
    setState(prev => ({ ...prev, currentUser: null, userRole: null, candidates: [], users: [] }));
    try {
      localStorage.removeItem(SESSION_USER_KEY);
      purgeSensitiveDataFromBrowser();
    } catch {}
  };

  const addUser = async (user: User) => {
    try {
      const docId = user.id || Date.now().toString();
      await setDoc(doc(db, 'users', docId), user, { merge: true });
      setState(prev => {
        const nextUsers = [...prev.users.filter(u => u.id !== docId), { ...user, id: docId }];
        return { ...prev, users: nextUsers };
      });
    } catch (e) {
      console.error("Error adding user:", e);
    }
  };

  const updateUser = async (id: string, user: Partial<User>) => {
    // 1. Instantly update React state
    setState(prev => {
      const nextUsers = prev.users.map(u => u.id === id ? { ...u, ...user } : u);
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
