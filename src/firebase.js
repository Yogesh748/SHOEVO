// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAGlew40Ur52DzpcFu8Ld7wgvCOu5465C0",
  authDomain: "shoevo-9d79d.firebaseapp.com",
  projectId: "shoevo-9d79d",
  storageBucket: "shoevo-9d79d.firebasestorage.app",
  messagingSenderId: "1071829988071",
  appId: "1:1071829988071:web:3f7d45bd65fd85a997e842",
  measurementId: "G-Y249WCZ33S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);