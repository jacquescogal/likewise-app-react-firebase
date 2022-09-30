//firebase import (To be hidden later)
import { initializeApp } from "firebase/app";
import {getAuth, updateProfile, onAuthStateChanged} from 'firebase/auth'
import { getFirestore } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'
import { useEffect, useState } from "react";



const firebaseConfig = {
  apiKey: "AIzaSyCo8EKUud6UN4HdPc7Osw4zvIJmiY7WnCo",
  authDomain: "codetherapy-8eba4.firebaseapp.com",
  projectId: "codetherapy-8eba4",
  storageBucket: "codetherapy-8eba4.appspot.com",
  messagingSenderId: "862928657004",
  appId: "1:862928657004:web:c636362ab62b9455f35649",
  measurementId: "G-XSHX49R593"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);


// Custom Hook
export function useAuth() {
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => setCurrentUser(user));
    return unsub;
  }, [])

  return currentUser;
}


// Storage
export async function upload(file, currentUser, setLoading) {
  const fileRef = ref(storage, 'profilepics/' + currentUser.uid + '.png');

  setLoading(true);
  
  const snapshot = await uploadBytes(fileRef, file);
  const photoURL = await getDownloadURL(fileRef);

  updateProfile(currentUser, {photoURL});
  
  setLoading(false);
  alert("Uploaded file!");
}