// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // ✅ this line is required
import { getAuth } from "firebase/auth"; // optional, if you're using Firebase Auth
import { getStorage } from "firebase/storage"; // ✅ this line fixes the error

const firebaseConfig = {
  apiKey: "AIzaSyBNvNpngew_O_5-rrCsLD5hScWN68vegM0",
  authDomain: "the-shop-world.firebaseapp.com",
  projectId: "the-shop-world",
  storageBucket: "the-shop-world.appspot.com",
  messagingSenderId: "586975506868",
  appId: "1:586975506868:web:the-shop-world" 
};
    

const app = initializeApp(firebaseConfig);
const storage = getStorage(app); // ✅ initialize storage
const db = getFirestore(app); // ✅ now this will work
const auth = getAuth(app); // optional

export { db, auth,storage}; // named exports
