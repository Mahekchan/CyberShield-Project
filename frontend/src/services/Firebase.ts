import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyCAGadHbEXwa4skyF7YVnNeawpSUwC57v4",
  authDomain: "cybershield-2cf95.firebaseapp.com",
  projectId: "cybershield-2cf95",
  storageBucket: "cybershield-2cf95.firebasestorage.app",
  messagingSenderId: "512201226069",
  appId: "1:512201226069:web:feea10e1a5f329d1fa61dc"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;