import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAYPsle9yt-HT9M0iOKj6_7js5kA4n69jw",
  authDomain: "eco-wander-cec4e.firebaseapp.com",
  projectId: "eco-wander-cec4e",
  storageBucket: "eco-wander-cec4e.firebasestorage.app",
  messagingSenderId: "142910883029",
  appId: "1:142910883029:web:53bc38bef4aefabd73ce5c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
