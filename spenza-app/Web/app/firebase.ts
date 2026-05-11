// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // 1. Add this import
import { getStorage } from "firebase/storage"; // <-- ADD THIS LINE
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDgCzZf78XQd1agRqHDt-btcAsRoJW9heg",
  authDomain: "spenza-app-2110.firebaseapp.com",
  projectId: "spenza-app-2110",
  storageBucket: "spenza-app-2110.firebasestorage.app",
  messagingSenderId: "1026727891663",
  appId: "1:1026727891663:web:43ae473c4654daafd51dba"
};

// const firebaseConfig = {
//   apiKey: "AIzaSyBFQAOyBAnsXb2DcPL7sNNOOXvs8gfY46M",
//   authDomain: "spenza-app-v2.firebaseapp.com",
//   projectId: "spenza-app-v2",
//   storageBucket: "spenza-app-v2.firebasestorage.app",
//   messagingSenderId: "414202678900",
//   appId: "1:414202678900:web:cf3c1517e81240f4664b21"
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); // 2. Export the database
export const storage = getStorage(app); // <-- ADD THIS LINE