IndicadorAnual.getIndicadorAnualByAreaIndicadorAndYearAndReceita({area: areaSelecionada, indicador: indicadorSelecionado, ano: anoSelecionado}, function (dados) {

    let ctx = document.getElementById("grafico-barras-receita").getContext("2d");

    window.graficoReceita = new Chart(ctx, {
        type: "bar",
        data: getDataIndicadorAnualReceita(dados),
        options: {
            responsive: true,
            legend: {
                display: false,
                position: "top",
            },
            /*Mostra o titulo dentro do gráfico*/
            title: {
                display: false,
                text: "Indicador Anual",
            },
            /*Balao de informacoes quando passa o mouse*/
            tooltips: {
                //mode: "index",
                //intersect: false,
                callbacks: {
                    label: function (tooltipItem, data) {

                        let label = data.datasets[tooltipItem.datasetIndex].label || "";

                        if (label) {
                            label += "";
                        }

                        label += tooltipItem.yLabel;

                        /*Nao funciona com toLocaleString por isso foi criado uma funcao para formatar valores monetarios*/
                        let formattedValue = formatCurrencyBR(label);

                        return "R$ " + formattedValue;
                    }
                }
            },
            scales: {
                xAxes: [{
                    stacked: true,
                    display: true,
                    ticks: {
                        beginAtZero: true
                    },
                    scaleLabel: {
                        display: false,
                        labelString: "labelString"
                    },
                    gridLines: {
                        display: false
                    }
                }],
                yAxes: [{
                    stacked: true,
                    display: false,
                    scaleLabel: {
                        display: false,
                        labelString: "Valores em R$"
                    },
                    gridLines: {
                        display: false
                    },
                    ticks: {
                        //stepSize: 1,
                        beginAtZero: true,
                        min: 0,
                        max: maxChart,
                    },
                }]
            },
            plugins: {
                datalabels: {
                    //display: false,
                    align: "top",
                    function(context) {
                        let index = context.dataIndex;
                        let value = context.dataset.data[index];
                        let invert = Math.abs(value) <= 1;
                        return value < 1 ? "end" : "start"
                    },
                    //cor dos quadrados da label
                    backgroundColor: null,
                    borderColor: null,
                    borderRadius: 3,
                    borderWidth: 1,
                    //cor da fonte dos valores no grafico
                    color: "#232d37",
                    font: {
                        size: 14,
                        weight: 600
                    },
                    //Posicionamento dos valores no grafico
                    //offset: 7,
                    //padding: 1,
                    anchor: "end",
                    formatter: function (value) {
                        /*Funcao para formatar valores monetarios R$*/
                        let formatedValue = value.toLocaleString('pt-br', {
                            style: 'currency',
                            currency: 'BRL'
                        });
                        return formatedValue;
                    }
                }
            },
            onClick: selecionaArea
        }
    });

}, function (dados) {
    console.log(dados);
    toastr.error(dados.statusText, "Internal Server Error");
});



let canvas = document.getElementById('chart') as HTMLCanvasElement;
let ctx = canvas.getContext('2d');

this.incomesChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Brut', 'Net imposable', 'Net'],
    datasets: [
      {
				label: 'ARTISTES ET TECHNICIENS',
        data: [2000, 1812.64, 1812.62],
        backgroundColor: 'purple'
      },
      {
				label: 'Test MtoM',
        data: [300, 240.65, 215.56],
        backgroundColor: 'cyan'
      },
    ]
  },
  options: {
    scales: {
      xAxes: [{
        stacked: true,
        ticks: {
          beginAtZero: true,
          suggestedMax: 2600
        }
      }],
      yAxes: [{
        stacked: true
      }]
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {

          let datasets = ctx.chart.data.datasets.filter(ds => {
          	return !ds._meta[0].hidden
          });

          console.log('ctx :', ctx);
          console.log('ctx.chart.data :', ctx.chart.data);

          if (datasets.indexOf(ctx.dataset) === datasets.length - 1) {
            let sum = 0;
            datasets.map(dataset => {
              sum += dataset.data[ctx.dataIndex];
            });
            return sum.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
          }
          else {
            return '';
          }
        },
        anchor: 'end',
        align: 'end'
      }
    }
  }
});
