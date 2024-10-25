// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBB5oDBpjX5cxepjUdVkUD0feXTaoPhVXU",
  authDomain: "travel-813e9.firebaseapp.com",
  projectId: "travel-813e9",
  storageBucket: "travel-813e9.appspot.com",
  messagingSenderId: "680102022334",
  appId: "1:680102022334:web:8351f6b96d1e6bf87262ef",
  measurementId: "G-GV1VYYZ3CT"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
export const db=getFirestore(app);