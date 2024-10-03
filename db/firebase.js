// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBiAA7k5dQPDpyN-JfSEp9q4cvqx2L08TU",
  authDomain: "books4everyone-56eea.firebaseapp.com",
  projectId: "books4everyone-56eea",
  storageBucket: "books4everyone-56eea.appspot.com",
  messagingSenderId: "390244630809",
  appId: "1:390244630809:web:2f158f7094ae8a71704588",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
