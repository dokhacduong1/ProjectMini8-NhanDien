import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
import {getAuth,GoogleAuthProvider} from "firebase/auth"
import {getStorage} from "firebase/storage"
const firebaseConfig = {
  apiKey: "AIzaSyBhwwJPNOPlxScmmy9ThdQ7Y1QNqlIiaNo",
  authDomain: "project-nhandien.firebaseapp.com",
  projectId: "project-nhandien",
  storageBucket: "project-nhandien.appspot.com",
  messagingSenderId: "185130976931",
  appId: "1:185130976931:web:5a0fdbfb39dd9b4e87e116",
  measurementId: "G-ZW6FKXLWJ8"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app)