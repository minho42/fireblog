// https://firebase.google.com/docs/web/setup#available-libraries
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBuylxOi7H0JTddtVlQyegDTnhdMgsVchQ",
  authDomain: "fireblog-a59a9.firebaseapp.com",
  projectId: "fireblog-a59a9",
  storageBucket: "fireblog-a59a9.appspot.com",
  messagingSenderId: "181442800459",
  appId: "1:181442800459:web:fc8ac757be9fae0b9796ce",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

export { storage, db };
