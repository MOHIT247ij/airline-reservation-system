import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCgX6V5vteVEzOWqyAHdrY0jHCnvpm_Skc",
  authDomain: "dbms-project-daa39.firebaseapp.com",
  projectId: "dbms-project-daa39",
  storageBucket: "dbms-project-daa39.firebasestorage.app",
  messagingSenderId: "331538039093",
  appId: "1:331538039093:web:00663e22745dc774100c7c",
  measurementId: "G-KN8YJGEP46"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);