// Import the functions you need from the SDKs you need
import {app} from './app.js' //puxando o aplicativo da pasta app.js

import { //importanto funções de autenticação
    getAuth,
    AuthErrorCodes,
    onAuthStateChanged, 
    signOut,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
  } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";


//criando autenticação
const auth = getAuth(app)


document.addEventListener("DOMContentLoaded", function(){
    // listen for auth status changes
    onAuthStateChanged(auth, (user) => {
        if (user) {
          console.log("Usuário já está logado"); //Informa que o usuário entrou
          hideLoginError();
          window.location.href = "./src/pages/home/home.html";
    
        } else {
          console.log("Usuário não está conectado");
        }
    });

    // login
    const loginForm = document.querySelector('#login-form');
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // get user info
        const email = loginForm['input-email'].value;
        const password = loginForm['input-password'].value;

        // log the user in
        signInWithEmailAndPassword(auth, email, password).then((cred) => {
            // close the login modal & reset form
            loginForm.reset();
            console.log(email);
            //Esconde a mensagem de erro
            hideLoginError();
            window.location.href = "./src/pages/home/home.html"
        })
        .catch((error) =>{
            const errorCode = error.code;
            const errorMessage = error.message;
            showLoginError(error);
            console.log(errorMessage);
        });
    });
});  

//Mostra as mensagens de erro
const showLoginError = (error) =>{
    const errorTxt = document.getElementById("error-message");
    if(error.code == AuthErrorCodes.INVALID_PASSWORD){
        errorTxt.innerHTML=`Senha incorreta. Tente Novamente.`;
    } else if(error.code == AuthErrorCodes.INVALID_EMAIL){
        errorTxt.innerHTML=`Email ou senha incorretos.`;
    } else if(error.code == AuthErrorCodes.USER_NOT_FOUND){
        errorTxt.innerHTML=`Email não encontrado. Tente novamente ou cadastre-se.`;
    }
    else{
        errorTxt.innerHTML=`Algo está errado... Verifique as informações e tente novamente.`;
    }
}

//Esconde as mensagens de erro
const hideLoginError = () =>{
    const errorDiv = document.getElementById("loginError");
    const errorTxt = document.getElementById("error-message");
    if(errorDiv!= null){
        errorDiv.style.display ='none';
            errorTxt.innerHTML='';}
}
