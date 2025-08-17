// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDM4GK_qDt4PWr2iql1zU869Nmf3MmrVHk",
  authDomain: "rudybtz-portfolio.firebaseapp.com",
  projectId: "rudybtz-portfolio",
  storageBucket: "rudybtz-portfolio.firebasestorage.app",
  messagingSenderId: "759447585600",
  appId: "1:759447585600:web:748fe6367a5ddd0c0df0a5"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { app, db, storage, auth };
