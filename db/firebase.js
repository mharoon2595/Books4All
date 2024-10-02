// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "books4all-e6cdf.firebaseapp.com",
  projectId: "books4all-e6cdf",
  storageBucket: "books4all-e6cdf.appspot.com",
  messagingSenderId: "180806983074",
  appId: "1:180806983074:web:71972f89ac99053c75a6fb",
  measurementId: "G-3GLQCTN0KC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
