const fs = require('fs');
let code = fs.readFileSync('src/store.tsx', 'utf8');

// Replace standard login with Firebase Auth login
const targetLogin = `  const login = (username: string, password?: string) => {
    const user = state.users.find(u => u.username === username);
    if (user) {
      // Allow login if password matches, or if no password is set for the user (fallback to '123')
      const userPass = user.password || '123';
      if (password === userPass) {
        setState(prev => ({ ...prev, currentUser: user }));
        return true;
      }
    }
    return false;
  };

  const logout = () => {
    setState(prev => ({ ...prev, currentUser: null }));
  };`;

const newLogin = `  const loginWithEmail = async (email: string, password?: string) => {
    const { signInWithEmailAndPassword } = await import('firebase/auth');
    try {
      await signInWithEmailAndPassword(auth, email, password || '');
      return true;
    } catch (e: any) {
      console.error(e);
      if (e.code === 'auth/operation-not-allowed') {
        throw new Error('Log masuk Email/Katalaluan belum diaktifkan di Firebase Console. Sila aktifkan atau gunakan Google.');
      }
      throw new Error('Emel atau kata laluan tidak sah');
    }
  };

  const loginWithGoogle = async () => {
    const { signInWithPopup, GoogleAuthProvider } = await import('firebase/auth');
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      return true;
    } catch (e: any) {
      console.error(e);
      throw new Error('Gagal log masuk dengan Google.');
    }
  };

  const logout = async () => {
    const { signOut } = await import('firebase/auth');
    await signOut(auth);
    setState(prev => ({ ...prev, currentUser: null, firebaseUser: null, userRole: null }));
  };`;

// We need to also add ContextTypes for these
const targetContext = `  login: (username: string, password?: string) => boolean;
  logout: () => void;`;

const newContext = `  loginWithEmail: (email: string, password?: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => Promise<void>;`;

// Replace
code = code.replace(targetLogin, newLogin);
code = code.replace(targetContext, newContext);

// Wait, we need an auth state listener to set currentUser and userRole based on firebaseUser!
const targetUseEffect = `  useEffect(() => {
    fetch('https://script.google.com/macros/s/AKfycbwoqLCO4ejfSc-2mPR7pqpOJS86knmqzjaSMbdWPQqW_1stC5tGl9SFR1TBSmV3fA/exec?action=getSettings')`;

const newUseEffect = `  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch role from firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          let role: any = 'calon';
          let userData: any = { username: user.email, name: user.displayName || user.email, role: 'calon' };
          
          if (userDoc.exists()) {
             role = userDoc.data().role;
             userData = userDoc.data();
          } else {
             // Create initial user doc if not exists
             const { setDoc, serverTimestamp } = await import('firebase/firestore');
             await setDoc(doc(db, 'users', user.uid), {
               uid: user.uid,
               email: user.email,
               role: 'calon', // Default to calon unless updated by admin
               createdAt: serverTimestamp(),
               updatedAt: serverTimestamp()
             });
          }
          
          setState(prev => ({ ...prev, firebaseUser: user, userRole: role, currentUser: userData }));
        } catch (e) {
          console.error("Error fetching user role", e);
          setState(prev => ({ ...prev, firebaseUser: user, currentUser: { username: user.email!, name: user.email!, role: 'calon', id: user.uid } as User }));
        }
      } else {
        setState(prev => ({ ...prev, firebaseUser: null, userRole: null, currentUser: null }));
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetch('https://script.google.com/macros/s/AKfycbwoqLCO4ejfSc-2mPR7pqpOJS86knmqzjaSMbdWPQqW_1stC5tGl9SFR1TBSmV3fA/exec?action=getSettings')`;

code = code.replace(targetUseEffect, newUseEffect);

// Add auth and db imports to components to avoid errors
code = code.replace(`export const AppProvider = ({ children }: { children: ReactNode }) => {`, 
`export const AppProvider = ({ children }: { children: ReactNode }) => {
  // Added firebase login functions mapped to context`);

// Add to context value provider
code = code.replace(`      login,`, `      loginWithEmail,\n      loginWithGoogle,`);
code = code.replace(`login: () => false,`, `loginWithEmail: async () => false, loginWithGoogle: async () => false,`);

fs.writeFileSync('src/store.tsx', code);
console.log('patched store.tsx');
