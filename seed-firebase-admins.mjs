import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);
const auth = getAuth(app);

const users = [
  { email: 'pentadbir@smakg3.edu.my', password: 'password123', role: 'admin' },
  { email: 'tahfiz@smakg3.edu.my', password: 'password123', role: 'staff' },
  { email: 'akademik@smakg3.edu.my', password: 'password123', role: 'staff' }
];

async function seed() {
  for (const u of users) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, u.email, u.password);
      const uid = userCredential.user.uid;
      
      await setDoc(doc(db, 'users', uid), {
        uid: uid,
        email: u.email,
        role: u.role,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log(`Created ${u.email} with role ${u.role}`);
      await signOut(auth);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
         console.log(`User ${u.email} already exists.`);
      } else {
         console.error(`Error creating ${u.email}:`, error);
      }
    }
  }
  process.exit(0);
}
seed();
