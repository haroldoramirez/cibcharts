angular.module("cibcharts")
    .controller("home.controller", function ($scope, $state, BaseTotal, toastr, $q, $timeout) {

    let defer = $q.defer();
    let dataAtual = new Date();
    let dataSelecionada = dataAtual;
    $scope.indicadorAno = 0;

    "use strict";

    /*Lista auxiliar para os meses*/
    let listaMeses = new Array();
    listaMeses[0] = "Janeiro";
    listaMeses[1] = "Fevereiro";
    listaMeses[2] = "Março";
    listaMeses[3] = "Abril";
    listaMeses[4] = "Maio";
    listaMeses[5] = "Junho";
    listaMeses[6] = "Julho";
    listaMeses[7] = "Agosto";
    listaMeses[8] = "Setembro";
    listaMeses[9] = "Outubro";
    listaMeses[10] = "Novembro";
    listaMeses[11] = "Dezembro";

    window.chartColors = {
        red: "rgb(255, 99, 132)",
        orange: "rgb(255, 159, 64)",
        yellow: "rgb(255, 205, 86)",
        green: "rgb(75, 192, 192)",
        blue: "rgb(54, 162, 235)",
        purple: "rgb(153, 102, 255)",
        grey: "rgb(201, 203, 207)"
    };

    /*-----------------------------------------------------------------------------------------------------------------------------------------*/

    /*Canvas grafico-barras-propriedades*/
    let color = Chart.helpers.color;
    let colorNames = Object.keys(window.chartColors);

    /*Inicializa o grafico*/
    atualiza_home(dataSelecionada);

    /*Inicio do Atualiza Home*/
    function atualiza_home(dataSelecionada) {

        $scope.loading = true;

        $scope.fullYear = dataSelecionada.getFullYear();
        $scope.month = dataSelecionada.getMonth() + 1;
        $scope.fullMonth = listaMeses[dataSelecionada.getMonth()];

        /*Servico que recebe indicador de ano calculado pelo backend*/
        BaseTotal.getBaseYears(function (dados) {

            $scope.anos = dados;

            /*Select Anos*/
            $scope.selectYears = { "type": "select",
                "name": "Ano",
                "value": dataSelecionada.getFullYear(),
                "values": $scope.anos
            };

        }, function(dados) {
            toastr.error("Falha ao carregar a base de anos", "Internal Server Error");
        });

        /*Verificar os anos para carregar os meses corretos - buscar uma forma mais dinamica*/
        if ($scope.fullYear > 2018) {
            /*Select Meses*/
            $scope.selectMonths = { "type": "select",
                "name": "Mês",
                "value": $scope.fullMonth,
                "values": [listaMeses[0],
                    listaMeses[1],
                    listaMeses[2],
                    listaMeses[3],
                    listaMeses[4],
                    listaMeses[5],
                    listaMeses[6],
                    listaMeses[7],
                    listaMeses[8]]
            };
        } else {
            /*Select Meses*/
            $scope.selectMonths = { "type": "select",
                "name": "Mês",
                "value": $scope.fullMonth,
                "values": [listaMeses[10], listaMeses[11]]
            };
        }

        /*Inicio - Promessa do BackEnd - auxilia no carregamento do graficos*/
        defer.promise.then(function() {

            /*Servico que recebe indicador de ano calculado pelo backend*/
            BaseTotal.getIndicatorYear({ano: $scope.fullYear}, function (dados) {

                $scope.indicadorAno = dados.indicador;

            }, function(dados) {
                toastr.error("Falha ao carregar indicador de ano", "Internal Server Error");
            });

            /*Servico angular que filtra a base por ano e mes*/
            BaseTotal.getBaseFiltered({ano: $scope.fullYear, mes: $scope.month}, function(dados) {

                $scope.propriedades = dados;

                let ctx = document.getElementById("grafico-barras-propriedades").getContext("2d");

                window.graficoComunicacaoTotal = new Chart(ctx, {
                    type: "bar",
                    data: getDataIndPropriedades(dados),
                    options: {
                        responsive: true,
                        legend: {
                            display: false,
                            position: "top",
                        },
                        title: {
                            display: false,
                            text: "Disponibilidade de Comunicação Total - " + dataSelecionada.getFullYear() + " - " + listaMeses[dataSelecionada.getMonth()],
                        },
                        tooltips: {
                            //mode: "index",
                            //intersect: false,
                            callbacks: {
                                label: function(tooltipItem, data) {
                                    let label = data.datasets[tooltipItem.datasetIndex].label || "";
                                    if (label) {
                                        label += ": ";
                                    }
                                    label += tooltipItem.yLabel;
                                    return label + " %";
                                }
                            }
                        },
                        scales: {
                            xAxes: [{
                                display: true,
                                ticks: {
                                    beginAtZero:true
                                },
                                scaleLabel: {
                                    display: false,
                                    labelString: "Mês"
                                },
                                gridLines: {
                                    display:false
                                }
                            }],
                            yAxes: [{
                                display: false,
                                scaleLabel: {
                                    display: false,
                                    labelString: "Valores em %"
                                },
                                gridLines: {
                                    display:false
                                },
                                ticks: {
                                    //stepSize: 1,
                                    beginAtZero:true,
                                    min: 0,
                                    max: 115,
                                },
                            }]
                        },
                        plugins: {
                            datalabels: {
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
                                    size: 16,
                                    weight: 600
                                },
                                //Posicionamento dos valores no grafico
                                //offset: 7,
                                //padding: 1,
                                anchor: "end",
                                formatter: function(value) {
                                    return value + "%";
                                }
                            }
                        },
                        onClick: selecionaPropriedade
                    }
                });

            }, function(dados) {
                toastr.error("Falha ao carregar indicador das propriedades", "Internal Server Error");
            });

        });
        /*Fim - Promessa do BackEnd - auxilia no carregamento do graficos*/

        resolveLater(defer);
        /*Fim do Servico angular*/

        /*Logica de carregar os dados no grafico*/
        function getDataIndPropriedades(dados) {

            /*Fazer um for ate o tamanho do dados e atribuir a */
            let propriedades = [];
            let indicadores = [];

            let barChartData = {
                /*lista propriedades*/
                labels: propriedades,
                datasets: [{
                    //label: "",
                    fill: false,
                    //borderColor: window.chartColors.orange,
                    //borderWidth: 0,
                    /*Cores das Barras dos Meses*/
                    backgroundColor: [
                        color(window.chartColors.blue).alpha(0.5).rgbString(),
                        color(window.chartColors.purple).alpha(0.5).rgbString(),
                        color(window.chartColors.orange).alpha(0.5).rgbString(),
                        color(window.chartColors.green).alpha(0.5).rgbString(),
                        color(window.chartColors.yellow).alpha(0.5).rgbString(),
                        color(window.chartColors.grey).alpha(0.5).rgbString(),
                        color(window.chartColors.purple).alpha(0.5).rgbString(),
                        color(window.chartColors.green).alpha(0.5).rgbString(),
                        color(window.chartColors.yellow).alpha(0.5).rgbString()
                    ],
                    /*Lista dos indicadores*/
                    data: indicadores
                }]
            };

            /*Inicializa os dados da barra de anos antes das barras de propriedades*/
            barChartData.labels[0] = 0;
            barChartData.datasets[0].data[0] = 0;

            /*Adicionar os valores na barra do ano atual*/
            barChartData.labels[0] = dataSelecionada.getFullYear();

            if($scope.indicadorAno.indicador == 0) {
                barChartData.datasets[0].data[0] = 0;
            } else {
                /*realizar o calculo novamente  da quantidade de pings e falhas que vem do backend*/
                barChartData.datasets[0].data[0] = Number($scope.indicadorAno).toFixed(0);
            }

            /*Percorre a lista de dados*/
            for (let i = 0; i < dados.length; i++) {
                propriedades.push(dados[i].propriedade.nome);
                indicadores.push(Number(dados[i].indicador).toFixed(0));
            }

            $scope.loading = false;

            return barChartData;
        }

        /*Evento ao clicar no grafico*/
        function selecionaPropriedade(evt) {
            let activeElementOrigem = graficoComunicacaoTotal.getElementAtEvent(evt);

            if (activeElementOrigem[0]._model.label === "Haacke") {
                $state.go("monitoramento-haacke", {obj:dataSelecionada});
            }
            else if (activeElementOrigem[0]._model.label === "Colombari") {
                $state.go("monitoramento-colombari", {obj:dataSelecionada});
            }
            else if (activeElementOrigem[0]._model.label === "Itaipu") {
                $state.go("monitoramento-itaipu", {obj:dataSelecionada});
            }
            else if (activeElementOrigem[0]._model.label === "Starmilk") {
                $state.go("monitoramento-starmilk", {obj:dataSelecionada});
            }
            else  if (activeElementOrigem[0]._model.label === "Stein") {
                $state.go("monitoramento-stein", {obj:dataSelecionada});
            }
        }

    }
    /*Fim Atualiza Home*/

    /*-----------------------------------------------------------------------------------------------------------------------------------------*/

    /*Resolve da Promise*/
    function resolveLater(defer) {
        doLater(defer, 'resolve');
    }

    /*Funcao que e exacutada em um determinado tempo - para auxiliar nas animacoes*/
    function doLater(defer, what) {
        $timeout(function() {
            defer[what]();
        }, 500);
    }

    /*-----------------------------------------------------------------------------------------------------------------------------------------*/

    /*Quando clickar no ano*/
    $scope.hasChangedYear = function(ano) {
        if (ano == 2018) {
            dataSelecionada = new Date("12-28-2018");
            graficoComunicacaoTotal.destroy();
            atualiza_home(dataSelecionada);
        } else if (ano == 2019) {
            dataSelecionada = new Date();
            graficoComunicacaoTotal.destroy();
            atualiza_home(dataSelecionada);
        }
    };

    /*Quando clickar no mes*/
    $scope.hasChangedMonth = function(month) {
        if (dataSelecionada.getFullYear() == 2019) {
            if (month == "Janeiro") {
                dataSelecionada = new Date("01-28-2019");
                graficoComunicacaoTotal.destroy();
                atualiza_home(dataSelecionada);
            } else if (month == "Fevereiro") {
                dataSelecionada = new Date("02-20-2019");
                graficoComunicacaoTotal.destroy();
                atualiza_home(dataSelecionada);
            } else if (month == "Março") {
                dataSelecionada = new Date("03-28-2019");
                graficoComunicacaoTotal.destroy();
                atualiza_home(dataSelecionada);
            } else if (month == "Abril") {
                dataSelecionada = new Date("04-29-2019");
                graficoComunicacaoTotal.destroy();
                atualiza_home(dataSelecionada);
            } else if (month == "Maio") {
                dataSelecionada = new Date("05-29-2019");
                graficoComunicacaoTotal.destroy();
                atualiza_home(dataSelecionada);
            } else if (month == "Junho") {
                dataSelecionada = new Date("06-29-2019");
                graficoComunicacaoTotal.destroy();
                atualiza_home(dataSelecionada);
            } else if (month == "Julho") {
                dataSelecionada = new Date("07-29-2019");
                graficoComunicacaoTotal.destroy();
                atualiza_home(dataSelecionada);
            } else if (month == "Agosto") {
                dataSelecionada = new Date("08-29-2019");
                graficoComunicacaoTotal.destroy();
                atualiza_home(dataSelecionada);
            } else if (month == "Setembro") {
                dataSelecionada = new Date("09-29-2019");
                graficoComunicacaoTotal.destroy();
                atualiza_home(dataSelecionada);
            } else if (month == "Outubro") {
                dataSelecionada = new Date("10-29-2019");
                graficoComunicacaoTotal.destroy();
                atualiza_home(dataSelecionada);
            }  else if (month == "Novembro") {
                dataSelecionada = new Date("11-29-2019");
                graficoComunicacaoTotal.destroy();
                atualiza_home(dataSelecionada);
            }  else if (month == "Dezembro") {
                dataSelecionada = new Date("12-29-2019");
                graficoComunicacaoTotal.destroy();
                atualiza_home(dataSelecionada);
            }
        } else if (dataSelecionada.getFullYear() == 2018) {
            if (month == "Novembro") {
                dataSelecionada = new Date("11-28-2018");
                graficoComunicacaoTotal.destroy();
                atualiza_home(dataSelecionada);
            } else if (month == "Dezembro") {
                dataSelecionada = new Date("12-28-2018");
                graficoComunicacaoTotal.destroy();
                atualiza_home(dataSelecionada);
            }
        }
    }

});