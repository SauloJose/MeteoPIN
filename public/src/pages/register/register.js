// Import the functions you need from the SDKs you need
import {app} from '../../js/app.js' //puxando o aplicativo da pasta app.js

import { //importanto funções de autenticação
    getAuth,
    AuthErrorCodes,
    onAuthStateChanged, 
    signOut,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";