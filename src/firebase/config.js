import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getDatabase, ref, get, update, set, remove } from "firebase/database"; // Import 'update'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCk5F38YnRW8PlHlKfDXjKQmwOA0nExZX8",
  authDomain: "erp-system-d616a.firebaseapp.com",
  databaseURL: "https://erp-system-d616a-default-rtdb.firebaseio.com",
  projectId: "erp-system-d616a",
  storageBucket: "erp-system-d616a.appspot.com",
  messagingSenderId: "147232119371",
  appId: "1:147232119371:web:be99e7f5a525d087e24bce",
  measurementId: "G-PNXV23X1FY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const provider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error(error);
    return null;
  }
};


export { auth, database, signInWithEmailAndPassword, signInWithGoogle, ref, get, update, set, remove }; // Export 'update'
