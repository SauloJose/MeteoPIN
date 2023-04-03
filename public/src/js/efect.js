/* =========== FUNÇÕES GRÁFICAS DA PAGINA ==================== */
//aplicativo
import {app} from './app.js' //puxando o aplicativo da pasta app.js

//autenticação
import { //importanto funções de autenticação
    getAuth
  } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";

const auth = getAuth(app); //recebe a autenticação

//Constantes da página para manipular
const sideMenu = document.querySelector("aside");
const menuBtn = document.getElementById("menu-btn");
const closeBtn = document.getElementById("close-btn");
const themeToggler = document.querySelector(".theme-toggler");


//função para preservar estado da página (noturno / claro)
window.addEventListener('load', function(){
    if(localStorage.theme){//Verifica se existe esse dado na memória
        if(localStorage.theme ==='dark'){//Tema norturno
            //se já estiver no tema escuro, ele continua, caso contrário, muda para dark
            if(document.body.classList.contains('dark-theme-variables')){ //Não faz nada
            }else{
                document.body.classList.toggle('dark-theme-variables');
                themeToggler.querySelector('span:nth-child(1)').classList.toggle('active');//Se tiver ativo ele muda para inativo
                themeToggler.querySelector('span:nth-child(2)').classList.toggle('active'); 
            }

        }else{ //Tema claro
            //se não estiver no tema noturno, modifica as variávies para o tema claro.
            if(document.body.classList.contains('dark-theme-variables')){
                document.body.classList.toggle('dark-theme-variables');
                themeToggler.querySelector('span:nth-child(1)').classList.toggle('active');//Se tiver ativo ele muda para inativo
                themeToggler.querySelector('span:nth-child(2)').classList.toggle('active');   
            }else{//Não faz nada
            }
        }
    }else{
        //por padrão, deixa como light
        localStorage.setItem('theme','light');
    }
});

//mostra a barra lateral
menuBtn.addEventListener('click', () => {
    sideMenu.classList.add("offMenu");
})


//Esconde a barra lateral
closeBtn.addEventListener('click', () => {
   sideMenu.classList.remove("offMenu");
})

// muda o tema 
themeToggler.addEventListener('click',()=>{
    document.body.classList.toggle('dark-theme-variables'); //Muda as variáveis internas em css para essa nova definição

    themeToggler.querySelector('span:nth-child(1)').classList.toggle('active');//Se tiver ativo ele muda para inativo
    themeToggler.querySelector('span:nth-child(2)').classList.toggle('active');

    
    //Se  esse primeiro estiver ativo -> tema claro 
    if(themeToggler.querySelector('span:nth-child(1)').classList.contains('active')){
        //salva a informação do tema como light
        localStorage.setItem('theme','light');
    }else{
        //salva a informação do tema como dark
        localStorage.setItem('theme','dark');
    }

})

//Tarefa de realizar logOut
const logoutBtn = document.getElementById("logout-link");

logoutBtn.addEventListener('click', function(){
    auth.signOut();//Desconectando o usuário
    console.log('O usuário atual foi desconectado.');
});


