// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Track Records
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Goose's Backup
// const firebaseConfig = {
//   apiKey: "AIzaSyDYrMeKE1uzdNanGe4fHhZNNx7rBauDO6o",
//   authDomain: "track-records-backup.firebaseapp.com",
//   projectId: "track-records-backup",
//   storageBucket: "track-records-backup.appspot.com",
//   messagingSenderId: "650001230244",
//   appId: "1:650001230244:web:7f4789b48e8635fabc3931"
// };

// AJ Backup
// const firebaseConfig = {
//   apiKey: "AIzaSyAIxGdaBmvHX9Ioz5_rtC0rtVXThce9UOs",
//   authDomain: "track-records-backupaj.firebaseapp.com",
//   projectId: "track-records-backupaj",
//   storageBucket: "track-records-backupaj.appspot.com",
//   messagingSenderId: "561963048234",
//   appId: "1:561963048234:web:96729bc98fbd25ae2b5253",
//   measurementId: "G-M619T5F99Z",
// };

// AJ Backup2
// const firebaseConfig = {
//   apiKey: "AIzaSyB4vCMFa1AaXGCcQx4sgsJhSPtIXq2a8dA",
//   authDomain: "track-records-backupaj2.firebaseapp.com",
//   projectId: "track-records-backupaj2",
//   storageBucket: "track-records-backupaj2.appspot.com",
//   messagingSenderId: "766867214832",
//   appId: "1:766867214832:web:f9e07c0104d09d8cfbcd35",
//   measurementId: "G-YG8B741049",
// };


// Initialize Firebase
const app = initializeApp(firebaseConfig)

const auth = getAuth(app)

const db = getFirestore(app)

export {app, auth, db} 