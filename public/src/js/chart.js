//Funções para criar os chats
// Create Temperature Chart
export function createTemperatureChart() {
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
        style: {"color":"gray"},
        text: 'Temperatura'
      },
      plotOptions: {
        line: { 
          animation: false,
          dataLabels: { 
            enabled: true 
          }
        }
      },
      xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: { second: '%H:%M:%S' }
      },
      yAxis: {
        title: { 
          text: 'Temperatura (°C)' 
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
export function createHumidityChart(){
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
        style: {"color":"gray"},
        text: 'Humidade'
      },    
      plotOptions: {
        line: { 
          animation: false,
          dataLabels: { 
            enabled: true 
          }
        },
        series: { 
          color: '#50b8b4' 
        }
      },
      xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: { second: '%H:%M:%S' }
      },
      yAxis: {
        title: { 
          text: 'Humidade (%)' 
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
export function createPressureChart() {
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
        style: {"color":"gray"},
        text: 'Pressão'
      },    
      plotOptions: {
        line: { 
          animation: false,
          dataLabels: { 
            enabled: true 
          }
        },
        series: { 
          color: '#A62639' 
        }
      },
      xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: { second: '%H:%M:%S' }
      },
      yAxis: {
        title: { 
          text: 'Pressão (hPa)' 
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
export function createPluvChart() {
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
            style: {"color":"gray"},
            text: 'Pluviômetro'
          },    
          plotOptions: {
            line: { 
              animation: false,
              dataLabels: { 
                enabled: true 
              }
            },
            series: { 
              color: '#A62639' 
            }
          },
          xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: { second: '%H:%M:%S' }
          },
          yAxis: {
            title: { 
              text: 'nível de água (mm)' 
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