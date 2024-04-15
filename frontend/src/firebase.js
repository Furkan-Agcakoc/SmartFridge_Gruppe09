// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC9Atf2vUKv-_QkLniu4KP0ySI9GZL3qmE",
  authDomain: "smart-fridge-sopra.firebaseapp.com",
  projectId: "smart-fridge-sopra",
  storageBucket: "smart-fridge-sopra.appspot.com",
  messagingSenderId: "490252132718",
  appId: "1:490252132718:web:1f3f5afac3b48cdf70e17f",
  measurementId: "G-PH8LLE0YRD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);

// Kommentar