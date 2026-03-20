import { initializeApp } from 'firebase/app'
import { doc, getFirestore, onSnapshot } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyC9CwVQfROQDiGim7Oc7auZcu16uC9szsA",
  authDomain: "petpet-shop.firebaseapp.com",
  projectId: "petpet-shop",
  storageBucket: "petpet-shop.appspot.com",
  messagingSenderId: "234149644408",
  appId: "1:234149644408:web:2ca9db6ed91fc65142858d"
};

const app = initializeApp(firebaseConfig)

export const firestoreDb = getFirestore(app)
export { doc, onSnapshot }
