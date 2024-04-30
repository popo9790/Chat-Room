import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDtz4CrzdNqvXxFHvKh5MQRO-9Xo92LbIM",
  authDomain: "chatroom-b09fc.firebaseapp.com",
  databaseURL: "https://chatroom-b09fc-default-rtdb.firebaseio.com",
  projectId: "chatroom-b09fc",
  storageBucket: "chatroom-b09fc.appspot.com",
  messagingSenderId: "371288223492",
  appId: "1:371288223492:web:1b7e8f7f585b876d516a51",
  measurementId: "G-GC506E8V3V",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
