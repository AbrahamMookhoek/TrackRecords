// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Track Records
// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
// };

const firebaseConfig = {
  apiKey: "AIzaSyDYrMeKE1uzdNanGe4fHhZNNx7rBauDO6o",
  authDomain: "track-records-backup.firebaseapp.com",
  projectId: "track-records-backup",
  storageBucket: "track-records-backup.appspot.com",
  messagingSenderId: "650001230244",
  appId: "1:650001230244:web:7f4789b48e8635fabc3931"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig)

const auth = getAuth(app)

const db = getFirestore(app)

export {app, auth, db} 