//================ página principal ==========================/
/* SESSÃO DE IMPORTS */
//aplicativo
import {app, db} from '../../js/app.js' //puxando o aplicativo da pasta app.js

//autenticação
import { //importanto funções de autenticação
    getAuth,
    onAuthStateChanged, 
    signOut
  } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";

//Banco de dados
import{
  getDatabase,
  ref,
  onValue,
  set,
  child,
  get, 
  onChildAdded,
  onChildChanged,
  onChildRemoved,
  orderByKey,
  orderByChild,
  query,
  limitToLast,
  endAt
} from 'https://www.gstatic.com/firebasejs/9.16.0/firebase-database.js';


/* FIM DA SEÇÃO DE IMPORTS */
// Elementos DOM para leituras dos sensores.
//Defines importantes
const lastUpdate = document.getElementById("lastUpdate");
const nickName = document.getElementsByClassName("nickName");
const tableContainerElement = document.getElementById("table-container");
const moreDataBTN=document.getElementById("moreData");

/*================== dados do firebase ==================== */
//criando autenticação
const auth = getAuth(app);

/*================== atualização dos charts ==================== */
/* analisa características do usuários*/
//Variáveis para manipular os dados.

let username; //nickname

//verifica se o usuário está logado ou não.
onAuthStateChanged(auth, (user) => {
  if(user){
    //pegando uid
    let uid = user.uid;

    //Caminhos da base de dados {Dados sensíveis}
    var dbPath = 'UsersData/'+uid.toString() +'/readings';
    var chartPath = 'UsersData/'+uid.toString()+'/charts/range';
    var nickNamePath = 'UsersData/'+uid.toString()+'/private/nickName';

    //referências da base de dados
    var dbRef = ref(db,dbPath);

   // var chartRef = ref(db,chartPath);
    var dbnickNamePath=ref(db,nickNamePath);

    let chartRange = 0;//zerando por cuidado
    //Coletando o nickname do usuário (apenas uma vez)
    onValue(dbnickNamePath, (snapshot)=>{
      username = snapshot.val();

      for (let i = 0; i < nickName.length; i++) { //Adicionar o nome do usuário em todas as instâncias
        nickName[i].innerHTML = `${username}`;
      }

    })

    //criando dados para a tabela
    var lastReadingTimestamp;
    
    //Sempre cria a tabela?
    //criando a tabela APENAS no momento em que a janela está carregando. Após isso, ela só atualiza quando clicado em mais dados.
    createTable(dbRef);

    //adicionar mais leituras a tabela
    function appendToTable(){
        var dataList=[]; //salvar as leituras atuais
        var reversedList=[]; //a mesma lista anterior, porém, inversa
        console.log("APEND");

        //querys para manipular informações
        const lastReads = query(dbRef, orderByKey());
        const dbRefOK =query(dbRef,orderByKey());
        const Last100dbRefok = query(dbRefOK, limitToLast(100));
        const ultdbRefOK = query(Last100dbRefok, endAt(lastReadingTimestamp));

        //Analisa os ultimos valores até o intervalo de tempo escolhido, e então adiciona a lista.
        onValue(ultdbRefOK, function(snapshot) {
           if(snapshot.exists()){
            snapshot.forEach(element=>{
                var jsonData = element.toJSON();
                dataList.push(jsonData); //Criando a lista com todos os dados
            })
            lastReadingTimestamp = dataList[0].timestamp;//ultimo intervalo de tempo
            reversedList = dataList.reverse(); //reverte a ordem dos itens

            var firstTime = true;
            reversedList.forEach((element)=>{
                if(firstTime){
                    firstTime = false;
                }else{
                    var jsonData = element;
                    //conteúdo para adicionar;
                    var temperature = jsonData.temperature;
                    var humidity = jsonData.humidity;
                    var pressure = jsonData.pressure;
                    var pluviometer= jsonData.pluviometer;
                    var timestamp = jsonData.timestamp;
                    var content='';
                    content += '<tr>';
                    content += '<td>' + epochToDateTime(timestamp) + '</td>';
                    content += '<td>' + temperature + '</td>';
                    content += '<td>' + humidity + '</td>';
                    content += '<td>' + pressure + '</td>';
                    content += '<td>' + pluviometer + '</td>';
                    content += '</tr>';
                    //Utilizando JQuery para atualizar a tabela

                    $('#tbody').append(content);
                }
            });
        };
    }, {
        onlyOnce: true
        });
    }

    //adicionar um evento de clique
    moreDataBTN.addEventListener('click', (e)=>{
        appendToTable(); 
    })


  } else {
      console.log("Não existe alguém conectado");
      window.location.href = "../../../index.html";
    }
});



/* ================ PLOT TABLE ==================== */
//Convertendo data e hora
function epochToJsDate(epochTime){
  return new Date(epochTime*1000);
}

//convertendo para formato de leitura humano YYYY/MM/DD HH:MM:SS
function epochToDateTime(epochTime){
  var epochDate = new Date(epochToJsDate(epochTime));
  var dateTime = ("00" + epochDate.getDate()).slice(-2) +"/"+("00" + (epochDate.getMonth() + 1)).slice(-2) + "/"+ epochDate.getFullYear() + ' '+
  ("00" + epochDate.getHours()).slice(-2) + ":" +
  ("00" + epochDate.getMinutes()).slice(-2) + ":" +
  ("00" + epochDate.getSeconds()).slice(-2);

return dateTime;
}

//Elementos do DOM para manipulação

function createTable(dbRef){//Cria a tabela e atualiza ela.
  var firstRun = true;
  const dbRefOK =query(dbRef,orderByKey());
  const Last100dbRefok = query(dbRefOK, limitToLast(100));
  onChildAdded(Last100dbRefok, function(snapshot){
      if(snapshot.exists()){
          //dados do banco de dados
          var jsonData = snapshot.toJSON();
          console.log(jsonData)
          var temperature = jsonData.temperature;
          var humidity = jsonData.humidity;
          var pressure = jsonData.pressure;
          var pluviometer= jsonData.pluviometer;
          var timestamp = jsonData.timestamp;

          //conteúdo da tabela
          var content='';
          content += '<tr>';
          content += '<td>' + epochToDateTime(timestamp) + '</td>';
          content += '<td>' + temperature + '</td>';
          content += '<td>' + humidity + '</td>';
          content += '<td>' + pressure + '</td>';
          content += '<td>' + pluviometer + '</td>';
          content += '</tr>';

          //utilizando jQuery para atualizar a tabela
          $('#tbody').prepend(content);
          if(firstRun){
              lastReadingTimestamp = timestamp;
              firstRun=false;
          }
      }
  })

  //Atualizando dado das ultimas leituras
  const lastReads = query(dbRef, orderByKey());
  const lastRead = query(lastReads, limitToLast(1));
  onChildAdded(lastRead, (snapshot) => {
      var jsonData = snapshot.toJSON();
      var timestampT = jsonData.timestamp;  
      lastUpdate.innerHTML=epochToDateTime(timestampT);
  })
}
