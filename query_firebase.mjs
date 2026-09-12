import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function check() {
  const querySnapshot = await getDocs(collection(db, 'permohonan'));
  const docs = [];
  querySnapshot.forEach(doc => {
    docs.push({ id: doc.id, data: doc.data() });
  });
  console.log('Firebase records:', docs.length);
  docs.forEach(d => console.log(d.id, d.data.name));
  process.exit(0);
}
check();
