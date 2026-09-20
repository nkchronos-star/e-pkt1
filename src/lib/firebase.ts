// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDDWrluYQyUXEKvowgr230QIpcDhryXmCU",
  authDomain: "data-epkt1.firebaseapp.com",
  projectId: "data-epkt1",
  storageBucket: "data-epkt1.firebasestorage.app",
  messagingSenderId: "436768080799",
  appId: "1:436768080799:web:425f0eeb9c74b0811c73aa",
  measurementId: "G-3SF37H5N0P"
};

// Initialize Firebase safely
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = initializeFirestore(app, {
  ignoreUndefinedProperties: true
});
// const analytics = getAnalytics(app);

export { app, db };
