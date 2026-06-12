// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAYAxNtVcsOnA6jr0HgrsxwO2q1erEywns",
  authDomain: "airline-reservations-sys-e4743.firebaseapp.com",
  projectId: "airline-reservations-sys-e4743",
  storageBucket: "airline-reservations-sys-e4743.firebasestorage.app",
  messagingSenderId: "261299922673",
  appId: "1:261299922673:web:b3959729f6788e89816b50",
  measurementId: "G-EF3HBM85CG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);