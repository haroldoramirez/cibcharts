angular.module("cibcharts")
    .controller("enermac.controller", function ($scope, $state, EnermacMonitoramento, EnermacEstatistica, toastr, $q, $timeout) {

        "use strict";

        $scope.ultimoIdGrafico = 0;
        $scope.ultimoIdBanco = 0;
        $scope.validadorUltimoId = false;
        $scope.maximo = 0;
        $scope.media = 0;
        $scope.mediana = 0;
        $scope.minimo = 0;
        $scope.desvioPadrao = 0;
        $scope.assimetria = 0;
        $scope.moda = 0;
        $scope.amplitude = 0;
        $scope.estatisticaCol = "Teste Front-End";
        $scope.monitoramento = null;
        $scope.parametro = null;
        $scope.newEstatistica = null;

        /*Lista auxiliar para os meses*/
        let listaMeses = new Array();
        listaMeses[1] = "Janeiro";
        listaMeses[2] = "Fevereiro";
        listaMeses[3] = "Março";
        listaMeses[4] = "Abril";
        listaMeses[5] = "Maio";
        listaMeses[6] = "Junho";
        listaMeses[7] = "Julho";
        listaMeses[8] = "Agosto";
        listaMeses[9] = "Setembro";
        listaMeses[10] = "Outubro";
        listaMeses[11] = "Novembro";
        listaMeses[12] = "Dezembro";

        window.chartColors = {
            red: "rgb(255, 99, 132)",
            orange: "rgb(255, 159, 64)",
            yellow: "rgb(255, 205, 86)",
            green: "rgb(75, 192, 192)",
            blue: "rgb(54, 162, 235)",
            purple: "rgb(153, 102, 255)",
            grey: "rgb(201, 203, 207)"
        };

        var fonts = {
                    Roboto: {
                        normal: 'fonts/Roboto-Regular.ttf',
                        bold: 'fonts/Roboto-Medium.ttf',
                        italics: 'fonts/Roboto-Italic.ttf',
                        bolditalics: 'fonts/Roboto-MediumItalic.ttf'
                    }
                };

        /*Formatador de numeros*/
        function currencyFormatDE (num) {
            return num
               .toFixed(0) // always two decimal digits
               .replace(".", ",") // replace decimal point character with ,
               .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")// use . as a separator
        }

        function getMedia(vetor) {
            let media = 0;

            for (let i = 0; i < vetor.length; i++) {
                media+= vetor[i].valor;
            }

            media = media/vetor.length;

            return media;
        }

        function getMediana(vetor) {

            let mediana = 0;

             if(vetor.length%2 == 0){
             mediana = ((vetor[vetor.length/2].valor)+(vetor[(vetor.length/2)+1].valor))/2;

            } else {

                mediana = vetor[vetor.length/2].valor;

            }

            return mediana;
        }

        function getMinValue(vetor) {

            let minValue = vetor[0].valor;

            for (let i = 0; i < vetor.length; i++) {

                if(vetor[i].valor < minValue){
                    minValue = vetor[i].valor;
                }

            }

            return minValue;
        }

        function getMaxValue(vetor) {

            let maxValue = vetor[0].valor;

            for (let i = 0; i < vetor.length; i++) {

                if(vetor[i].valor > maxValue){
                    maxValue = vetor[i].valor;
                }

            }

            return maxValue;
        }

        function getDesvioPadrao(vetor) {

            let media = getMedia(vetor);

            let desvioPadrao = 0;
            let calculo = 0;

            for (let i = 0; i < vetor.length; i++) {
                calculo = (vetor[i].valor - media) ^ 2;
                desvioPadrao += calculo;
            }

            desvioPadrao /= (vetor.length-1);

            Math.sqrt(desvioPadrao);

            return desvioPadrao;
        }

        function getAssimetria(vetor) {

            let media = getMedia(vetor);

            let desvioPadrao = getDesvioPadrao(vetor);

            let sum=1;

            for (let i = 0; i < vetor.length; i++)
                sum = (vetor[i].valor - media) * (vetor[i].valor - media) * (vetor[i].valor - media);

            return sum / (vetor.length * desvioPadrao * desvioPadrao * desvioPadrao * desvioPadrao);

        }

        function getAmplitude(min,max) {
            //Maximo menos o minimo
            return max - min;
        }

        function getModa(vetor) {

            let moda = 0;
            let conta = 0;

            var cont = [];
            cont[0] = 0;

            for(let i=0; i < vetor.length; i++) {

                for(let j=i+1; j < vetor.length; j++) {

                    if(vetor[i].valor == vetor[j].valor) {

                        cont[i]++;

                        if(cont[i] > conta) {
                            conta=cont[i];
                            moda = vetor[i].valor;
                        }

                    }

                    cont[i] = 0;
                }
                return moda;

            }
        }

        /*Cores dos Charts*/
        let color = Chart.helpers.color;

        /*Extending Line Chart*/
        Chart.defaults.LineWithLine = Chart.defaults.line;

        Chart.controllers.LineWithLine = Chart.controllers.line.extend({
          draw: function(ease) {
              Chart.controllers.line.prototype.draw.call(this, ease);

              if (this.chart.tooltip._active && this.chart.tooltip._active.length) {
                  var activePoint = this.chart.tooltip._active[0],
                      ctx = this.chart.ctx,
                      x = activePoint.tooltipPosition().x,
                      topY = this.chart.scales['y-axis-0'].top,
                      bottomY = this.chart.scales['y-axis-0'].bottom;

                  // draw line
                  ctx.save();
                  ctx.beginPath();
                  ctx.moveTo(x, topY);
                  ctx.lineTo(x, bottomY);
                  ctx.setLineDash([10, 10]);
                  ctx.lineWidth = 1;
                  ctx.strokeStyle = 'black';
                  ctx.stroke();
                  ctx.restore();
              }
          }
        });

        /*create initial empty chart*/
        let ctx = document.getElementById("grafico-linhas-enermac").getContext("2d");
        let graficoComunicacaoEnermac = null;

        let ctx2 = document.getElementById("grafico-scatter-enermac-media").getContext("2d");
        let graficoComunicacaoEnermac2 = null;

        let ctx3 = document.getElementById("grafico-scatter-enermac-maxima").getContext("2d");
        let graficoComunicacaoEnermac3 = null;

        /*INICIO - Apos a pagina ser carregada - monte todos os  graficos*/
        montaDadosGrafico();

        /*INICIO - Cria a estrutura do grafico e os dados do getDados do back-end*/
        function montaDadosGrafico() {

            EnermacMonitoramento.getAll(function(dados) {

                let dadosGrafico = [];
                let aux = 0;//dados.length;

                if (dados.length > 30) {
                    //dados
                    aux = dados.length - 30;
                }

                for (let i = aux; i < dados.length; i++) {
                    //repeticao
                    dadosGrafico.push(dados[i]);
                }

                EnermacEstatistica.getLastEstatistica(function(data) {

                    $scope.newEstatistica = {
                    "monitoramento"      : data.monitoramento,
                    "parametros"         : data.parametros,
                    "maximo"             : data.maximo,
                    "media"              : data.media,
                    "mediana"            : data.mediana,
                    "minimo"             : data.minimo,
                    "desvioPadrao"       : data.desvioPadrao,
                    "assimetria"         : data.assimetria,
                    "moda"               : data.moda,
                    "amplitude"          : data.amplitude};

                    $scope.monitoramento = data.monitoramento;
                    $scope.parametro = data.parametros;
                    $scope.maximo = data.maximo;
                    $scope.media = data.media;
                    $scope.mediana = data.mediana;
                    $scope.minimo = data.minimo;
                    $scope.desvioPadrao = data.desvioPadrao;
                    $scope.assimetria = data.assimetria;
                    $scope.moda = data.moda;
                    $scope.amplitude = data.amplitude;

                    graficoComunicacaoEnermac = new Chart(ctx, {
                        type: "LineWithLine",
                        data: getDados(dadosGrafico),
                        options: {
                            animation: {
                                //Animacao
                                duration: 0
                            },
                            elements: {
                                  //Pontos dos graficos
                                  point:{
                                      radius: 0
                                  }
                              },
                            responsive: true,
                            maintainAspectRatio: false,
                            legend: {
                                display: false,
                                position: "top",
                            },
                            title: {
                                display: false,
                                //text: "Disponibilidade de Comunicação Total por Dia - " + listaMeses[dataSelecionada.getMonth()] + " de " + dataSelecionada.getFullYear(),
                            },
                            tooltips: {
                                //mode: "index",
                                intersect: false,
                                callbacks: {
                                    title: function(tooltipItems) {
                                        //Return value for title
                                        return "Temperatura: " + tooltipItems[0].xLabel;
                                    },
                                    label: function(tooltipItem, data) {
                                        let label = data.datasets[tooltipItem.datasetIndex].label || "";
                                        if (label) {
                                            label += ": ";
                                        }
                                        label += tooltipItem.yLabel;
                                        return label + " ºC";
                                    }
                                }
                            },
                            scales: {
                                xAxes: [{
                                    display: true,
                                    stacked: true,
                                    offset: true,
                                    ticks: {
                                        beginAtZero:false,
                                        fontSize: 12,
                                        fontStyle: "bold",
                                    },
                                    scaleLabel: {
                                        display: true,
                                        labelString: "Medição",
                                        fontSize: 12,
                                        fontStyle: "bold",
                                    },
                                    gridLines: {
                                        display:false
                                    }
                                }],
                                yAxes: [{
                                    display: true,
                                    stacked: true,
                                    offset: true,
                                    ticks: {
                                        //stepSize: 1,
                                        beginAtZero:true,
                                        //min: 0,
                                        //max: 200,
                                        fontSize: 12,
                                        fontStyle: "bold",
                                    },
                                    scaleLabel: {
                                        display: true,
                                        fontSize: 12,
                                        fontStyle: "bold",
                                        labelString: "Temperatura [ºC]"
                                    },
                                    gridLines: {
                                        display:false
                                    }
                                }]
                            },
                            plugins: {
                                datalabels: {
                                   display:false,
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
                                        size: 11,
                                        weight: 600
                                    },
                                    //Posicionamento dos valores no grafico
                                    //offset: 7,
                                    //padding: 1,
                                    anchor: "end",
                                    //formatter: function(value) {
                                        //return value + " %";
                                    //}
                                    //formatter: function(value) {
                                        //return value + " ºC";
                                    //}
                                }
                            },
                            //onClick: clickDia
                        }
                    });

                    /*Grafico de Pontos 1 e 2*/
                    EnermacEstatistica.getAll(function(dados) {

                        let scatterChartDataMedia = {
                            datasets: [{
                                label: "",
                                borderColor: window.chartColors.red,
                                backgroundColor: color(window.chartColors.red).alpha(0.2).rgbString(),
                                data: getDadosScatterMedia(dados)
                            }]
                        };

                        let scatterChartDataMaxima = {

                            datasets: [{
                                label: "",
                                borderColor: window.chartColors.green,
                                backgroundColor: color(window.chartColors.green).alpha(0.2).rgbString(),
                                data: getDadosScatterMaxima(dados)
                            }]

                        };

                        graficoComunicacaoEnermac2 = new Chart.Scatter(ctx2, {
                            data: scatterChartDataMedia,
                            options: {
                                animation: {
                                    //Animacao
                                    duration: 0
                                },
                                elements: {
                                      //Pontos dos graficos
                                      point:{
                                          radius: 3
                                      }
                                  },
                                responsive: true,
                                legend: {
                                    display: false,
                                    position: "top",
                                },
                                title: {
                                    display: false,
                                    //text: "Disponibilidade de Comunicação Total por Dia - " + listaMeses[dataSelecionada.getMonth()] + " de " + dataSelecionada.getFullYear(),
                                },
                                tooltips: {
                                    display : false,
                                    //mode: "index",
                                    intersect: false,
                                    callbacks: {
                                        title: function(tooltipItems) {
                                            //Return value for title
                                            return "" + tooltipItems[0].xLabel;
                                        },
                                        label: function(tooltipItem, data) {
                                            let label = data.datasets[tooltipItem.datasetIndex].label || "";
                                            if (label) {
                                                label += ": ";
                                            }
                                            label += tooltipItem.yLabel;
                                            return label + "";
                                        }
                                    }
                                },
                                scales: {
                                    xAxes: [{
                                        display: true,
                                        stacked: true,
                                        offset: true,
                                        ticks: {
                                            beginAtZero:false,
                                            fontSize: 12,
                                            fontStyle: "bold",
                                        },
                                        scaleLabel: {
                                            display: true,
                                            labelString: "(Desvio Padrão)",
                                            fontSize: 12,
                                            fontStyle: "bold",
                                        },
                                        gridLines: {
                                            display:false
                                        }
                                    }],
                                    yAxes: [{
                                        display: true,
                                        stacked: true,
                                        offset: true,
                                        ticks: {
                                            //stepSize: 1,
                                            beginAtZero:true,
                                            //min: 0,
                                            //max: $scope.maximoGrafico + 10,
                                            fontSize: 12,
                                            fontStyle: "bold",
                                        },
                                        scaleLabel: {
                                            display: true,
                                            fontSize: 12,
                                            fontStyle: "bold",
                                            labelString: "(Média)"
                                        },
                                        gridLines: {
                                            display:false
                                        }
                                    }]
                                },
                                plugins: {
                                    datalabels: {
                                       display:false,
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
                                            size: 11,
                                            weight: 600
                                        },
                                        //Posicionamento dos valores no grafico
                                        //offset: 7,
                                        //padding: 1,
                                        anchor: "end",
                                        //formatter: function(value) {
                                            //return value + " %";
                                        //}
                                        //formatter: function(value) {
                                            //return value + " ºC";
                                        //}
                                    }
                                },
                                //onClick: clickDia
                            }
                        });

                        graficoComunicacaoEnermac3 = new Chart.Scatter(ctx3, {
                            data: scatterChartDataMaxima,
                            options: {
                            animation: {
                                //Animacao
                                duration: 0
                            },
                            elements: {
                                  //Pontos dos graficos
                                  point:{
                                      radius: 3
                                  }
                              },
                            responsive: true,
                            legend: {
                                display: false,
                                position: "top",
                            },
                            title: {
                                display: false,
                                //text: "Disponibilidade de Comunicação Total por Dia - " + listaMeses[dataSelecionada.getMonth()] + " de " + dataSelecionada.getFullYear(),
                            },
                            tooltips: {
                                //mode: "index",
                                intersect: false,
                                callbacks: {
                                    title: function(tooltipItems) {
                                        //Return value for title
                                        return "" + tooltipItems[0].xLabel;
                                    },
                                    label: function(tooltipItem, data) {
                                        let label = data.datasets[tooltipItem.datasetIndex].label || "";
                                        if (label) {
                                            label += ": ";
                                        }
                                        label += tooltipItem.yLabel;
                                        return label + "";
                                    }
                                }
                            },
                            scales: {
                                xAxes: [{
                                    display: true,
                                    stacked: true,
                                    offset: true,
                                    ticks: {
                                        beginAtZero:false,
                                        fontSize: 12,
                                        fontStyle: "bold",
                                    },
                                    scaleLabel: {
                                        display: true,
                                        labelString: "(Mínimo)",
                                        fontSize: 12,
                                        fontStyle: "bold",
                                    },
                                    gridLines: {
                                        display:false
                                    }
                                }],
                                yAxes: [{
                                    display: true,
                                    stacked: true,
                                    offset: true,
                                    ticks: {
                                        //stepSize: 1,
                                        beginAtZero:true,
                                        //min: 0,
                                        //max: $scope.maximoGrafico + 10,
                                        fontSize: 12,
                                        fontStyle: "bold",
                                    },
                                    scaleLabel: {
                                        display: true,
                                        fontSize: 12,
                                        fontStyle: "bold",
                                        labelString: "(Máximo)"
                                    },
                                    gridLines: {
                                        display:false
                                    }
                                }]
                            },
                            plugins: {
                                datalabels: {
                                   display:false,
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
                                        size: 11,
                                        weight: 600
                                    },
                                    //Posicionamento dos valores no grafico
                                    //offset: 7,
                                    //padding: 1,
                                    anchor: "end",
                                    //formatter: function(value) {
                                        //return value + " %";
                                    //}
                                    //formatter: function(value) {
                                        //return value + " ºC";
                                    //}
                                }
                            },
                            //onClick: clickDia
                            }
                        });

                    });

                }, function(data) {
                    console.log("Ocorreu um erro: ", data);
                })

            });

        }
        /*FIM - Cria a estrutura do grafico e os dados do getDados do back-end*/

        /*INICIO - Funcao responsavel por tratar os dados do backend e enviar para o grafico*/
        function getDados(dados) {

            let indicadores = [];
            let dias = [];

            let lineChartDataDias = {
               /*lista propriedades*/
               labels: dias,
               datasets: [{
                   //label: "",
                   fill: false,
                   backgroundColor: color(window.chartColors.blue).alpha(0.5).rgbString(),
                   borderColor: window.chartColors.blue,
                   borderWidth: 2,
                   pointHoverRadius: 1,
                   pointHoverBackgroundColor: window.chartColors.blue,
                   /*Lista dos indicadores*/
                   data: indicadores
               }],

            };

            for (let j = 0; j < dados.length; j++) {
                indicadores.push(Number(dados[j].valor).toFixed(0));
                dias.push("");
            }

            $scope.ultimoIdGrafico = dados[dados.length - 1].id;

            return lineChartDataDias;

        }
        /*FIM - Funcao responsavel por tratar os dados do backend e enviar para o grafico*/

        /*INICIO - Funcao responsavel por tratar os dados do backend e enviar para o grafico SCATTER DA MEDIA*/
        function getDadosScatterMedia(dados) {

            var dataTeste = [];

            for (let i = 0; i < dados.length; i++) {
                dataTeste.push({
                    x: dados[i].desvioPadrao,
                    y: dados[i].media
                })
            }

            //console.log("Media e desvio padrao", dataTeste);

            return dataTeste;
        }
        /*FIM - Funcao responsavel por tratar os dados do backend e enviar para o grafico SCATTER DA MEDIA*/

        /*INICIO - Funcao responsavel por tratar os dados do backend e enviar para o grafico SCATTER DO MAXIMO*/
        function getDadosScatterMaxima(dados) {

            var dataTeste = [];

            for (let i = 0; i < dados.length; i++) {

                dataTeste.push({
                    x: dados[i].minimo,
                    y: dados[i].maximo
                })
            }

            //console.log("Dados maxima e minima", dataTeste);

            return dataTeste;
        }
        /*FIM - Funcao responsavel por tratar os dados do backend e enviar para o grafico SCATTER DO MAXIMO*/

        /*-INICIO-PDF--------------------------------------------------------------------------------------*/

        /*Inicio - Relatorio*/
        $scope.downloadRelatorio = function() {

            var agora = new moment(Date.now()).format('DD-MM-YYYY - HH:mm:ss');

            var graficoBarraMes = document.querySelector('#grafico-barras-mes');
            var graficoLinhaDia = document.querySelector('#grafico-linhas-dia');
            //var graficoLinhaPing = document.querySelector('#grafico-linhas-pings');

            //create image from dummy canvas
            //formato precisa ser em png por causa do fundo branco
            var imgGraficoBarrasMes = graficoBarraMes.toDataURL("image/png");
            var imgGraficoBarrasDia = graficoLinhaDia.toDataURL("image/png");
            //var imgGraficoBarrasPing = graficoLinhaPing.toDataURL("image/png");

            //Conteudo do Arquivo PDF
            var conteudo = [
                {canvas: [ { type: 'line', x1: 0, y1: 0, x2: 716, y2: 0, lineWidth: 1 } ]},
                ' ',
                {text: 'Indicador: Disponibilidade de Comunicação em '+ dataSelecionada.getFullYear(), style: 'titulo', alignment: 'center'},
                ' ',
                {text: 'Disponibilidade de Comunicação Diária em '+ listaMeses[dataSelecionada.getMonth()+1] +' de '+ dataSelecionada.getFullYear(), style: 'paragrafo', alignment: 'left'},
                ' ',
                {
                    // if you specify both width and height - image will be stretched
                    image: imgGraficoBarrasDia,
                    width: 610,
                    height: 150,
                    alignment: 'center'
                },
                ' ',
                {text: 'Disponibilidade de Comunicação Mensal em '+ dataSelecionada.getFullYear(), style: 'paragrafo', alignment: 'left'},
                ' ',
                {
                    // if you specify both width and height - image will be stretched
                    image: imgGraficoBarrasMes,
                    width: 610,
                    height: 150,
                    alignment: 'center'
                },
/*                ' ',
                {text: 'Status de Comunicação em '+ listaMeses[dataSelecionada.getMonth()+1] +' de '+ dataSelecionada.getFullYear(), style: 'paragrafo', alignment: 'left'},
                ' ',
                {
                    // if you specify both width and height - image will be stretched
                    image: imgGraficoBarrasPing,
                    width: 450,
                    height: 150,
                    alignment: 'center'
                },*/

            ];

            //Definicao do arquivo PDF
            var docDefinition = {
                header: function() {
                    return [
                        {
                            style: 'table',
                            margin: [62,35,62,35],
                            table: {
                                widths: [100, '*'],
                                headerRows: 0,
                                body: [
                                    [
                                       {
                                            // usually you would use a dataUri instead of the name for client-side printing
                                            // sampleImage.jpg however works inside playground so you can play with it
                                            image: cib_logo,
                                            width: 90,
                                            height: 25,
                                            alignment: 'left'
                                        },
                                        {text: 'CIBCharts Reports - ' + $scope.nomePropriedade, style: 'topHeader', alignment: 'right'}

                                    ]
                                ]
                            },
                            layout: 'noBorders'
                        },
                    ]
                },
                footer: function(currentPage, pageCount) {
                    return [
                        {text: 'Data do Relatório: '+ agora , alignment: 'center', style: 'footer'}
                    ]
                },
                content: conteudo,
                pageSize: 'A4',
                pageOrientation: 'landscape',
                pageMargins: [62,80,62,80],
                styles: {
                    topHeader: {
                        fontSize: 16,
                        bold: true,
                        margin: [0, 6, 0, 30],
                        alignment: 'right'
                    },
                    titulo: {
                        fontSize: 12,
                        bold: true,
                        margin: [0, 6, 0, 10],
                        alignment: 'center'
                    },
                    paragrafo: {
                        fontSize: 9,
                        alignment: 'left'
                    },
                    table: {
                        fontSize: 8,
                        alignment: 'left',
                        color: 'black',
                        margin: [0, 5, 0, 15]
                    },
                    header: {
                        fontSize: 16,
                        bold: true,
                        margin: [0, 10, 0, 15],
                        alignment: 'left'
                    },
                    footer: {
                        fontSize: 6,
                        margin: [0, 25, 0, 17],
                        alignment: 'right'
                    }
                }
            };

            var pdf = pdfMake.createPdf(docDefinition).download('cibcharts-'+ $scope.nomePropriedade +'-reports-'+ agora +'.pdf');

        };
        /*Fim - Relatorio*/

        /*-FIM-PDF-----------------------------------------------------------------------------------------*/

        /*INICIO - Funcao responsavel por verificar se mudou o ultimo valor no banco*/
        function getLast() {

            EnermacMonitoramento.getLast(function(data) {

                $scope.ultimoIdBanco = data.id;

                if ($scope.ultimoIdBanco > $scope.ultimoIdGrafico) {

                    EnermacMonitoramento.getAll(function(dados) {

                        let dadosGrafico = [];
                        let aux = 0;//dados.length;

                        if (dados.length > 30) {
                            aux = dados.length - 30;
                        }

                        for (let i = aux; i < dados.length; i++) {
                            dadosGrafico.push(dados[i]);

                            graficoComunicacaoEnermac.data.datasets[0].data.pop();
                        }

                        for (let i = 0; i < 30; i++) {

                            graficoComunicacaoEnermac.data.datasets[0].data.push(dadosGrafico[i].valor);

                        }

                        $scope.monitoramento = dadosGrafico[0].monitoramento;
                        $scope.parametro = dadosGrafico[0].parametros;
                        $scope.maximo = getMaxValue(dadosGrafico);
                        $scope.media = getMedia(dadosGrafico);
                        $scope.mediana = getMediana(dadosGrafico);
                        $scope.minimo = getMinValue(dadosGrafico);
                        $scope.desvioPadrao = getDesvioPadrao(dadosGrafico);
                        $scope.assimetria = getAssimetria(dadosGrafico);
                        $scope.moda = getModa(dadosGrafico);
                        $scope.amplitude = getAmplitude(getMinValue(dadosGrafico), getMaxValue(dadosGrafico));

                        $scope.newEstatistica = {
                            "monitoramento"      : $scope.monitoramento,
                            "parametros"         : $scope.parametro,
                            "maximo"             : $scope.maximo,
                            "media"              : $scope.media,
                            "mediana"            : $scope.mediana,
                            "minimo"             : $scope.minimo,
                            "desvioPadrao"       : $scope.desvioPadrao,
                            "assimetria"         : $scope.assimetria,
                            "moda"               : $scope.moda,
                            "amplitude"          : $scope.amplitude};

                        EnermacEstatistica.save($scope.newEstatistica, function(data) {

                        }, function(data) {
                            console.log("Ocorreu um erro: ", data);
                        });

                        console.log("Desvio Padrao: ", $scope.desvioPadrao);
                           console.log("Medio: ", $scope.media);
                              console.log("Minimo: ", $scope.minimo);
                                 console.log("Maximo: ", $scope.maximo);

                        graficoComunicacaoEnermac2.data.datasets[0].data.push({x: $scope.desvioPadrao , y:$scope.media});
                        graficoComunicacaoEnermac3.data.datasets[0].data.push({x: $scope.minimo , y:$scope.maximo});

                        graficoComunicacaoEnermac.update();
                        graficoComunicacaoEnermac2.update();
                        graficoComunicacaoEnermac3.update();
                        $scope.ultimoIdGrafico = $scope.ultimoIdBanco;

                    });
                }

            });

        }
        /*FIM - Funcao responsavel por verificar se mudou o ultimo valor no banco*/

        // get new data every 3 seconds
        setInterval(getLast, 3000);

});