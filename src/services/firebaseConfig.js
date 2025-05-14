// src/services/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
 apiKey: "AIzaSyB7pxSPi1OisY7XQ24s5j7Kvs9MYp734V0", 
  authDomain: "turnofacil-44df3.firebaseapp.com",  
  projectId: "turnofacil-44df3",               
  storageBucket: "turnofacil-44df3.appspot.com",
  messagingSenderId: "665860045580",       
  appId: "1:665860045580:web:xxxxx"        
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
