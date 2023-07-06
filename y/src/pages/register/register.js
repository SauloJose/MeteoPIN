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

//Função de animação da seção de login
const inputs = document.querySelectorAll('.signUp-input')

function focusFunc(){
    let parent = this.parentNode.parentNode;
    parent.classList.add('focus');
}

function blurFunc(){
    let parent = this.parentNode.parentNode;
    if(this.value ==""){
        parent.classList.remove('focus')
    }
}

inputs.forEach( input => {
    input.addEventListener('focus',focusFunc);
    input.addEventListener('blur',blurFunc)
})
