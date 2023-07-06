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
  endAt,
  startAt,
  limitToFirst
} from 'https://www.gstatic.com/firebasejs/9.16.0/firebase-database.js';


/* FIM DA SEÇÃO DE IMPORTS */
// Elementos DOM para leituras dos sensores.
//Defines importantes
const lastUpdate = document.getElementById("lastUpdate");
const nickName = document.getElementsByClassName("nickName");
const tableContainerElement = document.getElementById("table-container");
const moreDataBTN=document.getElementById("moreData");
const moreDataInfo = document.getElementById("avisos");

/*================== dados do firebase ==================== */
//criando autenticação
const auth = getAuth(app);

/*================== atualização dos charts ==================== */
/* analisa características do usuários*/
//Variáveis para manipular os dados.

let username; //nickname

/* ============FUNÇÕES UTILIZADAS NO CÓDIGO================*/
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

//Função para criar a tabela
function createTable(dbRef) {
  return new Promise((resolve, reject) => {
    const dbRefOK = query(dbRef, orderByKey());
    const last50dbRefOK = query(dbRefOK, limitToLast(100));
    const lastReadRef = query(dbRefOK, limitToLast(1));

    var lastReadingTimestamp; // Valor da última leitura na tabela
    var dataList = [];
    var lastTableUpdateTimestamp; // Último valor exibido na tabela

    // Lê os últimos 50 registros do banco de dados apenas uma vez //Irá atualizar de uma só vez?
    onValue(last50dbRefOK, (snapshot) => {
      const reversedList = []; // salva as leituras atuais em ordem inversa
      snapshot.forEach((childSnapshot) => {
        const jsonData = childSnapshot.toJSON();

        //salva as leituras atuais
        reversedList.push(jsonData);
        dataList.push(jsonData);
      });

      //reverte a ordem das leituras atuais
      reversedList.reverse();
      lastTableUpdateTimestamp = dataList[0].timestamp;

      //insere as leituras atuais na tabela em lotes (batch)
      const batchContent = reversedList.map((element) => {
        const { temperature, humidity, pressure, pluviometer, timestamp } = element;

        //conteúdo da tabela
        let content = '';
        content += '<tr>';
        content += '<td>' + epochToDateTime(timestamp) + '</td>';
        content += '<td>' + temperature + '</td>';
        content += '<td>' + humidity + '</td>';
        content += '<td>' + pressure + '</td>';
        content += '<td>' + pluviometer + '</td>';
        content += '</tr>';
        return content;
      }).join('');

      $('#tbody').prepend(batchContent);

      //atualiza o timestamp da última leitura na tabela
      if (dataList.length > 0) {
        lastReadingTimestamp = reversedList[0].timestamp;
        lastUpdate.innerHTML = epochToDateTime(lastReadingTimestamp);
        //console.log(epochToDateTime(lastReadingTimestamp));
      }

      //resolve a Promise com o valor de lastTableUpdateTimestamp
      console.log("A variável que foi retornada pela createTable:"+String(lastTableUpdateTimestamp))
      resolve(lastTableUpdateTimestamp);
    }, (error) => {
      //rejeita a Promise se houver algum erro
      reject(error);
    });

    //atualiza o timestamp da leitura mais recente no banco de dados
    onChildAdded(lastReadRef, (snapshot) => {
      lastReadingTimestamp = snapshot.val().timestamp;
      lastUpdate.innerHTML = epochToDateTime(lastReadingTimestamp);
    });
  });
}

//Função para adicionar mais dados
async function appendToTable(dbRef, lastTableUpdate) {
  const queryOk = query(dbRef, orderByKey());
  const queryRef = query(
    queryOk,
    endAt(String(lastTableUpdate - 1)),
    limitToLast(50)
  );

  //Toma um get instantâneo dos dados para colocar no appendToTable
  const snapshot = await get(queryRef);

    try {
      const reversedList = [];
      const dataList = [];

      snapshot.forEach((childSnapshot) => {
        const jsonData = childSnapshot.toJSON();
        reversedList.push(jsonData);
        dataList.push(jsonData);
      });

      reversedList.reverse();

      const batchContent = reversedList
        .map((element) => {
          const { temperature, humidity, pressure, pluviometer, timestamp } =
            element;

          let content = "";
          content += "<tr>";
          content += "<td>" + epochToDateTime(timestamp) + "</td>";
          content += "<td>" + temperature + "</td>";
          content += "<td>" + humidity + "</td>";
          content += "<td>" + pressure + "</td>";
          content += "<td>" + pluviometer + "</td>";
          content += "</tr>";
          return content;
        })
        .join("");

      $("#tbody").append(batchContent);

      // Extrai o último timestamp do snapshot retornado
      var lastTimestamp;
      
      lastTimestamp = dataList[0].timestamp;

      return lastTimestamp; // retorna o último timestamp

    } catch (error) {
      console.error(error);
      return -1;
    }
}


/*===================== INTERFACE DO USUÁRIO ===================================== */
//verifica se o usuário está logado ou não.
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // Extrai o uid do objeto user utilizando a sintaxe de desestruturação
    const { uid } = user;

    // Caminhos da base de dados {Dados sensíveis}
    const dbPath = `UsersData/${uid}/readings`;
    const chartPath = `UsersData/${uid}/charts/range`;
    const nickNamePath = `UsersData/${uid}/private/nickName`;

    // Referências da base de dados
    const dbRef = ref(db, dbPath);
    // const chartRef = ref(db, chartPath);
    const dbnickNamePath = ref(db, nickNamePath);

    // Coletando o nickname do usuário (apenas uma vez)
    const nickName = document.querySelectorAll('.username');

    onValue(dbnickNamePath, (snapshot) => {
      username = snapshot.val();

      // envolve o elemento DOM em um array antes de chamar o forEach
      Array.from(nickName).forEach((elem) => {
        elem.innerHTML = `${username}`;
      });
    });

    // Criando dados para a tabela
    var lastReadingTimestamp;
    var lastReadingTimestampValue;

    // Sempre cria a tabela?
    // Criando a tabela APENAS no momento em que a janela está carregando. Após isso, ela só atualiza quando clicado em mais dados.
    lastReadingTimestamp = await createTable(dbRef, lastReadingTimestamp);

    lastReadingTimestampValue = lastReadingTimestamp;
    //console.log(epochToDateTime(lastReadingTimestampValue));

    // Adicionar mais leituras a tabela
    // Adicionar um evento de clique
    moreDataBTN.addEventListener("click", async () => {
      moreDataInfo.innerHTML = "Carregando...";

      moreDataBTN.disabled = true;
      
      if (lastReadingTimestampValue) {
        lastReadingTimestampValue = await appendToTable(dbRef, lastReadingTimestampValue);
        //console.log(epochToDateTime(lastReadingTimestampValue))
      } else { //Provavelmente gerará um bug.
        lastReadingTimestampValue = await createTable(dbRef);
      }
      
      if(lastReadingTimestampValue == -1){
        moreDataInfo.innerHTML = "Provavelmente não tem mais dados.";
        moreDataBTN.disabled = false;
      }else{
        moreDataInfo.innerHTML = "";
        moreDataBTN.disabled = false;
      }
    });
    

  } else {
    console.log("Não existe alguém conectado");
    window.location.href = "../../../index.html";
  }
});
