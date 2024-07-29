import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBh6Dn7voTgmCNMt94MghtMMnzbLzRoCnY",
  authDomain: "creat-5d81c.firebaseapp.com",
  projectId: "creat-5d81c",
  storageBucket: "creat-5d81c.appspot.com",
  messagingSenderId: "121134495358",
  appId: "1:121134495358:web:5589af6b76f910f5c9ca2f",
  measurementId: "G-JX2RTZDFVB"
};

// Initialize Firebase app (if not already initialized)
const app = initializeApp(firebaseConfig);

// Get a reference to the storage service
const storage = getStorage(app);

export { storage };
