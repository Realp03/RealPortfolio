import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"

 const firebaseConfig = {
    apiKey: "AIzaSyCUTr63zdbdNfqVo_IwszewkOvVEh7wW3M",
    authDomain: "realp03-portfolio.firebaseapp.com",
    projectId: "realp03-portfolio",
    storageBucket: "realp03-portfolio.firebasestorage.app",
    messagingSenderId: "93875831594",
    appId: "1:93875831594:web:d5a8bc57f49e94760e9453",
    measurementId: "G-DBDK0WW8EY"
  };

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export { db }