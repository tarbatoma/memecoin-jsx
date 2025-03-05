// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyByy1KMxuCkqcQROWgfnCFgN4Qn3RBChlM",
  authDomain: "memecoinforum-d8810.firebaseapp.com",
  projectId: "memecoinforum-d8810",
  storageBucket: "memecoinforum-d8810.firebasestorage.app",
  messagingSenderId: "1083085149132",
  appId: "1:1083085149132:web:1d81fb42a75aa1f410c369",
  measurementId: "G-WQDYVYK058"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
