import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDZXeUzRW4EGzjr2PJMLVZdyuSxTncSGzE",
  authDomain: "hackmoney-6ef38.firebaseapp.com",
  databaseURL: "https://hackmoney-6ef38-default-rtdb.firebaseio.com/",
  projectId: "hackmoney-6ef38",
  storageBucket: "hackmoney-6ef38.appspot.com",
  messagingSenderId: "703593056992",
  appId: "1:703593056992:web:137854bf0299b2436a9e85",
  measurementId: "G-T8FP3JZE4J",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

//TODO: implement if we think it's necessary to use firestore