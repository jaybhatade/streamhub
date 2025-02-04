// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB0zfp5OTYgF7njr-0_WHiBNY7cuANVY5k",
  authDomain: "streamhub7-e3809.firebaseapp.com",
  projectId: "streamhub7-e3809",
  storageBucket: "streamhub7-e3809.firebasestorage.app",
  messagingSenderId: "296844431217",
  appId: "1:296844431217:web:821cd2a0bdfa967e1b30d0",
  measurementId: "G-TGXTMTNCCP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const database = getDatabase(app);
const storage = getStorage(app);

// Export the Firebase services
export { app, auth, googleProvider, database, storage };
