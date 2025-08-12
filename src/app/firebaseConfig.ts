import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAEPDQdECj7-TjoxYoE01PE9yielnWvkwQ",
  authDomain: "pokdex-v2.firebaseapp.com",
  projectId: "pokdex-v2",
  storageBucket: "pokdex-v2.firebasestorage.app",
  messagingSenderId: "371144231830",
  appId: "1:371144231830:web:659f5ae6e48490e2f1ebb7"
};

export const app = initializeApp(firebaseConfig);
