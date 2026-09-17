import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDDWrluYQyUXEKvowgr230QIpcDhryXmCU",
  authDomain: "data-epkt1.firebaseapp.com",
  projectId: "data-epkt1",
  storageBucket: "data-epkt1.firebasestorage.app",
  messagingSenderId: "436768080799",
  appId: "1:436768080799:web:425f0eeb9c74b0811c73aa",
  measurementId: "G-3SF37H5N0P"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
    try {
        const docRef = doc(db, 'config', 'main');
        const snap = await getDoc(docRef);
        console.log("Read success:", snap.exists() ? snap.data() : "No data");
        
        // Try writing
        await setDoc(docRef, { test: 1 }, { merge: true });
        console.log("Write success");
    } catch (e) {
        console.error("Error:", e.message);
    }
    process.exit(0);
}
run();
