import express from "express";
import signup from './routes/signup.js';

// Import the functions you need from the SDKs you need
// https://firebase.google.com/docs/web/setup#available-libraries
import { initializeApp } from "firebase/app";
import { getAnalytics, initializeAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAsxokM84Ot3XPo4kZsNznO-HIjrerrEa8",
  authDomain: "track-records-be887.firebaseapp.com",
  projectId: "track-records-be887",
  storageBucket: "track-records-be887.appspot.com",
  messagingSenderId: "942109207935",
  appId: "1:942109207935:web:da083d19ae05a2dcbe7e4a",
  measurementId: "G-56KK208VLC"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

isSupported().then(result => {
    if (result){
        const analytics = initializeAnalytics(app)
    }
})

const server = express();
server.use('/signup', signup)

var PORT = 5555;

server.listen(PORT || 8888, () =>{
    console.log("Welcome to the server")
    console.log("The server is now listening on port 5555")
})

