//Funções para criar os chats
// Create Temperature Chart
export function createTemperatureChart(color) {
  var chart = new Highcharts.Chart({
    chart:{ 
      renderTo:'TempChart',
      type: 'line',
      backgroundColor: 'none'
    },
    series: [
      {
        name: 'BME280'
      }
    ],
    title: { 
      style: {"color":color},
      text: 'Temperatura'
    },
    plotOptions: {
      line: { 
        animation: false,
        dataLabels: { 
          enabled: true,
          style: {"color":"#e0e0e0"}
        }
      },series: { 
        color: '#41f1b6' 
      }
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: { second: '%H:%M:%S' }
    },
    yAxis: {
      title: { 
        text: 'Temperatura (°C)',
        style: {"color":color}  
      },
      labels: {
        style: {"color":color} // Definindo a cor dos labels do eixo Y como um tom de cinza claro
      }
    },
    credits: { 
      enabled: false 
    },
    responsive: {
      rules: [{
          condition: {
              maxWidth: 500
          },
          chartOptions: {
              legend: {
                  layout: 'horizontal',
                  align: 'center',
                  verticalAlign: 'bottom'
              }
          }
      }]
  }
  });
  return chart;
}

// Create Humidity Chart
export function createHumidityChart(color ='#e0e0e0'){
  var chart = new Highcharts.Chart({
    chart:{ 
      renderTo:'HumChart',
      type: 'line',
      backgroundColor: 'none' 
    },
    series: [{
      name: 'BME280'
    }],
    title: {
      style: {"color":color},
      text: 'Umidade'
    },    
    plotOptions: {
      line: { 
        animation: false,
        dataLabels: { 
          enabled: true,
          style: {"color":"#e0e0e0"}
        }
      },series: { 
        color: '#DCE1EB' 
      }
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: { second: '%H:%M:%S' }
    },
    yAxis: {
      title: { 
        text: 'Pressão (hPa)',
        style: {"color": color} // Usando a cor passada como parâmetro
      },
      labels: {
        style: {"color": color} // Usando a cor passada como parâmetro
      }
    },
    credits: { 
      enabled: false 
    },
    responsive: {
      rules: [{
          condition: {
              maxWidth: 500
          },
          chartOptions: {
              legend: {
                  layout: 'horizontal',
                  align: 'center',
                  verticalAlign: 'bottom'
              }
          }
      }]
  }
  });
  return chart;
}

// Create Pressure Chart
export function createPressureChart(color ='#e0e0e0') {
  var chart = new Highcharts.Chart({
    chart:{ 
      renderTo:'PressChart',
      type: 'line',
      backgroundColor: 'none'
    },
    series: [{
      name: 'BME280'
    }],
    title: { 
      style: {"color": color}, // Usando a cor passada como parâmetro
      text: 'Pressão'
    },    
    plotOptions: {
      line: { 
        animation: false,
        dataLabels: { 
          enabled: true,
          style: {"color":"#e0e0e0"}// Usando a cor passada como parâmetro
        }
      },series: { 
        color: '#7380ec' // Usando a cor passada como parâmetro
      }
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: { second: '%H:%M:%S' }
    },
    yAxis: {
      title: { 
        text: 'Pressão (hPa)',
        style: {"color": color} // Usando a cor passada como parâmetro
      },
      labels: {
        style: {"color": color} // Usando a cor passada como parâmetro
      }
    },
    credits: { 
      enabled: false 
    },
    responsive: {
      rules: [{
          condition: {
              maxWidth: 500
          },
          chartOptions: {
              legend: {
                  layout: 'horizontal',
                  align: 'center',
                  verticalAlign: 'bottom'
              }
          }
      }]
    }
  });
  return chart;
}



  // Criando chart para o pluviômetro
export function createPluvChart(color ='#e0e0e0') {
      var chart = new Highcharts.Chart({
        chart:{ 
          renderTo:'PluvChart',
          type: 'line',
          backgroundColor: 'none'
        },
        series: [{
          name: 'Pluviômetro'
        }],
        title: { 
          style: {"color":color},
          text: 'Pluviômetro'
        },    
        plotOptions: {
          line: { 
            animation: false,
            dataLabels: { 
              enabled: true,
              style: {"color":"#e0e0e0"}
            }
          },series: { 
            color: '#ff7782' 
          }
        },
        xAxis: {
          type: 'datetime',
          dateTimeLabelFormats: { second: '%H:%M:%S' }
        },
        yAxis: {
          title: { 
            text: 'Pluviômetro (mm)',
            style: {"color":color} // Definindo a cor do título do eixo Y como um tom de cinza claro
          },
          labels: {
            style: {"color":color} // Definindo a cor dos labels do eixo Y como um tom de cinza claro
          }
        },
        credits: { 
          enabled: false 
        },
        responsive: {
          rules: [{
              condition: {
                  maxWidth: 500
              },
              chartOptions: {
                  legend: {
                      layout: 'horizontal',
                      align: 'center',
                      verticalAlign: 'bottom'
                  }
              }
          }]
      }
      });
      return chart;
    }