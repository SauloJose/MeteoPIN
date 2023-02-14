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
  limitToLast
} from 'https://www.gstatic.com/firebasejs/9.16.0/firebase-database.js';

import {
  createTemperatureChart,
  createHumidityChart,
  createPressureChart,
  createPluvChart
} from "../../js/chart.js";


/* FIM DA SEÇÃO DE IMPORTS */
/* FUNÇÕES DO SCRIPT */

/* ================ PLOT DOS CHARTS ==================== */
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

//função para plotar os valores nos charts
function plotValues(chart, timestamp, value){
  var x = epochToJsDate(timestamp-10800).getTime();
  var y = Number(value);
  if(chart.series[0].data.length >40){
    chart.series[0].addPoint([x,y],true,true,true);
  }else{
    chart.series[0].addPoint([x,y],true,false,true);
  }
}

//função parar criar o gráfico de uma vez só
function plotGraph(chart, dados){
  //chart: objeto chart
  //dados é um json com os valores x e y, após pegar do banco. 
  var x; //Valores de x
  var y; //valores de y

  //Adicionado tudo de uma vez no gráfico.
}

/* FIM DAS FUNÇÕES DO SCRIPT */
// Elementos DOM para leituras dos sensores.
//Defines importantes
const tempData = document.getElementById("tempData");
const pressData = document.getElementById("pressData");
const pluvioData = document.getElementById("pluvioData");
const humData = document.getElementById("humData");
const lastUpdate = document.getElementById("lastUpdate");
const nickName = document.getElementsByClassName("nickName");
const chartInput = document.getElementById("chartValue");
const okBtn = document.getElementById("chartBtn");


/* Evento de escolha */
//graficos
const charts = document.getElementById('graphs').getElementsByClassName('ChartData');
//Radios input
const Radios = document.getElementById('radios').getElementsByClassName('radioState');


/*================== autenticação do firebase ==================== */
//criando autenticação
const auth = getAuth(app);
let lastNReads; //número de leituras
/*================== atualização dos charts ==================== */
//variáveis de chart 
let chartT;
let chartH;
let chartP;
let chartPluv;

//criará os charts quando a pagina web carregar
window.addEventListener('load', ()=>{
  //Criando os objetos charts
  chartT=createTemperatureChart();
  chartH=createHumidityChart();
  chartP=createPressureChart();
  chartPluv=createPluvChart();

  //Analisando qual modo de execução
  if(window.innerWidth > 1330){//modo computador
    //Mantendo apenas um chart aberto
    for(let j=0; j<charts.length ; j++){
      if(j==0){
        if(charts[j].classList.contains('offChart')){
          charts[j].classList.remove('offChart');
        }else{

        }
      }else{
        if(charts[j].classList.contains('offChart')){
        }else{
          charts[j].classList.add('offChart');
        }
      }
    }

    //Adicionando os eventos
    for(let i=0; i < Radios.length; i++){
      //Adicionando os eventos para cada um das divs
      Radios[i].addEventListener('click',()=>{
        //verifica se o chart está ligado
        for(let j=0; j<Radios.length; j++){
          if(Radios[j].checked){
            if(charts[j].classList.contains('offChart')){
              charts[j].classList.remove('offChart');
            }else{}
          }else{
            if(charts[j].classList.contains('offChart')){}
            else{
              charts[j].classList.add('offChart');
            }
          }
        }
      })
    }
  }else{//Modo Celular
    for(let j=0; j<charts.length ; j++){
      if(charts[j].classList.contains('offChart')){
        charts[j].classList.remove('offChart');
      }
    }
  }
});

/* analisa características do usuários*/
//Variáveis para manipular os dados.


//verifica se o usuário está logado ou não.
onAuthStateChanged(auth, (user) => {
  if(user){
    //variáveis
    var uid = user.uid;
    var chartRange;

    //Caminhos da base de dados (dados sensíveis)
    var dbPath = 'UsersData/'+uid.toString() +'/readings'; 
    var chartPath = 'UsersData/'+uid.toString()+'/charts/range';
    var nickNamePath = 'UsersData/'+uid.toString()+'/private/nickName';

    //referências da base de dados
    var dbRef = ref(db,dbPath);
    var chartRef = ref(db,chartPath);
    var dbnickNamePath=ref(db,nickNamePath);

    //Adicionando a funcionalidade de escolher quantas leituras terei.
    okBtn.addEventListener('click', ()=>{
     if(chartInput.value < 1){
     set(chartRef,30);
     }else{
     set(chartRef, chartInput.value);}});  

    //Constantes importantes
    //puxa as ultimas leituras e plota elas nos charts, junto com o range
    //gerando querys
    const lastReads = query(dbRef, orderByKey());
    const lastRead = query(lastReads, limitToLast(1));

    //Coletando o nickname do usuário (apenas uma vez)
    onValue(dbnickNamePath, (snapshot)=>{
      let username = snapshot.val();

      for (let i = 0; i < nickName.length; i++) {
        nickName[i].innerHTML = `${username}`;
      }
    },{//carregar dados do cashe
      onlyOnce: true
    });

    /*Esse intervalo do código toma muito tempo! */

    //Caso não tenha escolha, 30 por default
    chartRange = 30; //Para evitar conflito
    set(chartRef, 30);


    //Aqui tem um "ouvinte" para puxar a ultima leitura.
    onChildAdded(lastRead, (snapshot) => {
      var jsonData = snapshot.toJSON();

      //Dados do Json
      var temperatureT = jsonData.temperature;
      var humidityT = jsonData.humidity;
      var pressureT = jsonData.pressure;
      var pluviometerT= jsonData.pluviometer;
      var timestampT = jsonData.timestamp;

      //Modificando valores no document.
      tempData.innerHTML= `${temperatureT} °C`;
      humData.innerHTML = `${humidityT} %`;
      pressData.innerHTML=`${pressureT} hPa`;
      pluvioData.innerHTML=`${pluviometerT} mm`;
      lastUpdate.innerHTML=epochToDateTime(timestampT);
    })   

    
    //atualizar dados do gráfico de acordo com o range no banco
    onValue(chartRef, (snapshot) => {
      chartRange = Number(snapshot.val());

      //valor que varia de acordo com a mudança no chart.
      lastNReads = query(lastReads,limitToLast(chartRange));

      //Deleta os charts para então refazê-los
      chartT.destroy();
      chartH.destroy();
      chartP.destroy();
      chartPluv.destroy();

      //gerar novos charts para mostrar o novo intervalo de dados
      chartT=createTemperatureChart();
      chartH=createHumidityChart();
      chartP=createPressureChart();
      chartPluv=createPluvChart();  

      //Adicionar as ultimas leituras
      onChildAdded(lastNReads,(snapshot) =>{
      var jsonData = snapshot.toJSON(); //Puxa um json da base de dados?
      //variáveis para salvar as leituras da base de dados
      var temperature = jsonData.temperature;
      var humidity = jsonData.humidity;
      var pressure = jsonData.pressure;
      var pluviometer= jsonData.pluviometer;
      var timestamp = jsonData.timestamp;

      plotValues(chartT ,timestamp, temperature);
      plotValues(chartP,timestamp, pressure);
      plotValues(chartPluv,timestamp, pluviometer);
      plotValues(chartH,timestamp, humidity);
      });
    })

    //Adicionar as ultimas leituras
    onChildAdded(lastNReads,(snapshot) =>{
      var jsonData = snapshot.toJSON(); //Puxa um json da base de dados?
      //variáveis para salvar as leituras da base de dados
      console.log(jsonData);
      var temperature = jsonData.temperature;
      var humidity = jsonData.humidity;
      var pressure = jsonData.pressure;
      var pluviometer= jsonData.pluviometer;
      var timestamp = jsonData.timestamp;

      plotValues(chartT,timestamp, temperature);
      plotValues(chartP,timestamp, pressure);
      plotValues(chartPluv,timestamp, pluviometer);
      plotValues(chartH,timestamp, humidity);
      });
  } else {
      auth.signOut();
      console.log("Não existe alguém conectado");
      window.location.href = "../../../index.html";
    }
});
