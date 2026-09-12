const fs = require('fs');
let code = fs.readFileSync('src/store.tsx', 'utf8');

const targetLoginMethods = `  const loginWithEmail = async (email: string, password?: string) => {
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

const originalLoginMethod = `  const login = (username: string, password?: string) => {
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

code = code.replace(targetLoginMethods, originalLoginMethod);

const targetContextMethods = `  loginWithEmail: (email: string, password?: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => Promise<void>;`;

const originalContextMethods = `  login: (username: string, password?: string) => boolean;
  logout: () => void;`;

code = code.replace(targetContextMethods, originalContextMethods);

code = code.replace(
  `      loginWithEmail,\n      loginWithGoogle,`,
  `      login,`
);

fs.writeFileSync('src/store.tsx', code);
console.log("Patched store.tsx");
