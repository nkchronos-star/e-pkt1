import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function test() {
  const permohonanId = "test12345";
  try {
    await setDoc(doc(db, 'permohonan', permohonanId), {
      userId: 'public',
      status: 'draft',
      studentName: 'Tiada Nama',
      icNumber: '123456789012',
      candidateData: { test: "data" },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    console.log("Success");
  } catch (e) {
    console.error("Error:", e);
  }
  process.exit(0);
}
test();
