// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Copy your Firebase config here 👇
const firebaseConfig = {
  apiKey: "AIzaSyDQSsj8vRsRr3ww36JZ1M-eb0alh5Gwqj0",

  authDomain: "hostelmate-7.firebaseapp.com",

  projectId: "hostelmate-7",

  storageBucket: "hostelmate-7.firebasestorage.app",

  messagingSenderId: "157708179127",

  appId: "1:157708179127:web:048b09c366965885405f32"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export {app};

