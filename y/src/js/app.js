// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js";
import {getDatabase} from 'https://www.gstatic.com/firebasejs/9.16.0/firebase-database.js';

//Dado EXTREMAMENTE SENSÍVEL!
const firebaseConfig = {
  apiKey: "AIzaSyByoag6JqVq68CLEMU5DrlX9KIHF6DNjWM",
  authDomain: "meteopin-7b28c.firebaseapp.com",
  databaseURL: "https://meteopin-7b28c-default-rtdb.firebaseio.com",
  projectId: "meteopin-7b28c",
  storageBucket: "meteopin-7b28c.appspot.com",
  messagingSenderId: "60683217267",
  appId: "1:60683217267:web:78eafc68a6beb79acc7d06"
};

// Inicializando a base de dados.
export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);