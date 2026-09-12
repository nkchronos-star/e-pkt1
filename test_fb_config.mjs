import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';

const serviceAccount = JSON.parse(fs.readFileSync('./firebase-blueprint.json', 'utf8'));

// Initialize using the default project id (if available) or service account
initializeApp();

const db = getFirestore();

async function checkConfig() {
  const docRef = db.collection('config').doc('main');
  const doc = await docRef.get();
  if (doc.exists) {
    console.log("Config exists:", doc.data());
  } else {
    console.log("No config found!");
  }
}

checkConfig().catch(console.error);
