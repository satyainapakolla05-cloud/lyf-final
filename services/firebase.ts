import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

export const firebaseConfig = {
  apiKey: "AIzaSyCoU-aiM5gylsg-rGi99eVyMRtZZCSuaW0",
  authDomain: "lyf-vendor.firebaseapp.com",
  projectId: "lyf-vendor",
  storageBucket: "lyf-vendor.firebasestorage.app",
  messagingSenderId: "1023456789012",
  appId: "1:552760162634:android:bbb3c9f7ef9fdc471429b3",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
