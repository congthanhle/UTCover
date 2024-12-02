import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database'; // hoặc Firestore

const firebaseConfig = {
  apiKey: "AIzaSyCHbiiar8EHSs0_Z_i7VcHkabgt6bI1esA",
  authDomain: "calendar-8d2e8.firebaseapp.com",
  projectId: "calendar-8d2e8",
  storageBucket: "calendar-8d2e8.firebasestorage.app",
  messagingSenderId: "256992803419",
  appId: "1:256992803419:web:a85ae1362428272b351d7e",
  measurementId: "G-870N13YKNW"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app); // hoặc `getFirestore` nếu dùng Firestore

export { db };
