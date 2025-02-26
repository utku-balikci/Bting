import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  createUserWithEmailAndPassword 
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC_LXXxbjhdgNS54gAmWbPB0f9uLX0CoTw",
  authDomain: "testproject-3971f.firebaseapp.com",
  projectId: "testproject-3971f",
  storageBucket: "testproject.appspot.com",
  messagingSenderId: "899282753352",
  appId: "your-app-id",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { 
  auth, 
  googleProvider, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  createUserWithEmailAndPassword  
};