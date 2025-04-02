import { initializeApp } from "firebase/app";

export const getFirebaseApp = () => {
    const firebaseConfig = {
        apiKey: "AIzaSyBkeohN0LA6NzwAatHhq4uxGkA9pVn8fcU",
        authDomain: "chatify-4a039.firebaseapp.com",
        projectId: "chatify-4a039",
        storageBucket: "chatify-4a039.firebasestorage.app",
        messagingSenderId: "776822936977",
        appId: "1:776822936977:web:f7a0d401cc6d77ac74f630"
      };
      
      return initializeApp(firebaseConfig);
}