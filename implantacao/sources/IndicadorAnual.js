angular.module("cibcharts")
/*1 - Controller Indicador Mensal Receita*/
    .controller("indicadoranual.receita.controller", function ($scope, $state, Indicador, Area, IndicadorAnual, toastr) {

        "use strict";

        /*-VARIAVEIS-------------------------------------------------------------------------------------------------------------------------------------*/

        let maxChart = 0;
        let dataAtual = new Date();

        /*Primeiro filtro realizado ao carregar a pagina*/
        let areaSelecionada = "CIBiogás";
        let indicadorSelecionado = '';
        let anoSelecionado = dataAtual.getFullYear().toString();
        let ultimoAno = '';
        let habilita = 0;

        $scope.listaAnos = [];
        $scope.listaIndicadores = [];
        $scope.listaAreas = [];

        /*-FIM-VARIAVEIS----------------------------------------------------------------------------------------------------------------------------------*/

        /*-GRAFICO-CORES----------------------------------------------------------------------------------------------------------------------------------*/

        window.chartColors = {
            red: "rgb(255, 99, 132)",
            orange: "rgb(255, 159, 64)",
            yellow: "rgb(255, 205, 86)",
            green: "rgb(75, 192, 192)",
            blue: "rgb(54, 162, 235)",
            purple: "rgb(153, 102, 255)",
            grey: "rgb(201, 203, 207)"
        };

        /*Canvas grafico-barras*/
        let color = Chart.helpers.color;

        /*-FIM-GRAFICO-CORES------------------------------------------------------------------------------------------------------------------------------*/

        /*-UTIL-------------------------------------------------------------------------------------------------------------------------------------------*/

        /*Funcao para formatar valores monetarios*/
        function formatCurrencyBR(n, c, d, t) {
            let s, j, i;
            c = isNaN(c = Math.abs(c)) ? 2 : c, d = d == undefined ? "," : d, t = t == undefined ? "." : t, s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
            return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
        }

        /*Funcao para remover valores duplicados dentro das listas*/
        function removeDuplicados(lista) {

            let unique = {};
            lista.forEach(function(i) {
                if(!unique[i]) {
                    unique[i] = true;
                }
            });

            return Object.keys(unique);
        }

        /*-FIM-UTIL---------------------------------------------------------------------------------------------------------------------------------------*/

        /*-CORE------------------------------------------------------------------------------------------------------------------------------------------*/

        /*Servico que resgata uma lista das areas ativadas*/
        Area.getAreas(function(listaAreas) {

            $scope.selectAreas = { "type": "select",
                "name": "Area",
                "value": listaAreas[0],
                "values": listaAreas

            };

        });

        /*Inicializa os Selects*/
        atualizaAreaAno(areaSelecionada, anoSelecionado);

        /*Inicio do Atualiza Area e Ano*/
        function atualizaAreaAno(areaSelecionada, anoSelecionado) {

            $scope.area = areaSelecionada;
            $scope.ano = anoSelecionado;

            IndicadorAnual.getIndicadorAnualByArea({area: $scope.area}, function(listaGestao) {

                /*Repeticao para montar a lista de selects de anos baseado por Indicador Anual*/
                for (let i = 0; i < listaGestao.length; i++) {
                    $scope.listaAnos.push(listaGestao[i].anoReferencia);
                }

                ultimoAno = $scope.listaAnos[0];

                $scope.selectYears = { "type": "select",
                    "name": "Ano",
                    "value": ultimoAno,
                    "values": removeDuplicados($scope.listaAnos)
                };

                /*Repeticao para verificar se o ano referencia for igual ao ano selecionado e o nome da area for igual a area selecionada*/
                for (let i = 0; i < listaGestao.length; i++) {
                    if (listaGestao[i].anoReferencia == ultimoAno && listaGestao[i].area.nome == $scope.selectAreas.value) {
                        $scope.listaIndicadores.push(listaGestao[i].indicador.nomenclatura);
                    }
                }

                if (habilita == 0) {
                    indicadorSelecionado = 'Receita Realizada';
                    habilita = 1;
                }
                else {
                    indicadorSelecionado = $scope.listaIndicadores[0];
                }

                $scope.selectIndicadores = { "type": "select",
                    "name": "Indicador",
                    "value": indicadorSelecionado,
                    "values": removeDuplicados($scope.listaIndicadores)
                };

                atualizaGraficoReceita(areaSelecionada, indicadorSelecionado, ultimoAno);

            }, function (dados) {
                console.log(dados);
                toastr.error(dados.statusText, "Internal Server Error");
            });

        }
        /*Fim Atualiza Area e Ano*/

        /*Inicio do Atualiza Area Ano e Indicador*/
        function atualizaAreaAnoIndicador(areaSelecionada, anoSelecionado) {

            IndicadorAnual.getIndicadorAnualByAreaIndicador({area: areaSelecionada, ano: anoSelecionado}, function(listaIndicadores) {

                /*Repeticao para verificar se o ano referencia for igual ao ano selecionado e o nome da area for igual a area selecionada*/
                for (let i = 0; i < listaIndicadores.length; i++) {

                    $scope.listaIndicadores.push(listaIndicadores[i].indicador.nomenclatura);

                }

                $scope.selectIndicadores = { "type": "select",
                    "name": "Indicador",
                    "value": $scope.listaIndicadores[0],
                    "values": removeDuplicados($scope.listaIndicadores)
                };

                indicadorSelecionado = $scope.listaIndicadores[0];

                atualizaGraficoReceita(areaSelecionada, indicadorSelecionado, anoSelecionado);

            }, function (dados) {
                console.log(dados);
                toastr.error(dados.statusText, "Internal Server Error");
            });

        }
        /*Fim do Atualiza Area Ano e Indicador*/

        /*Inicio do Atualiza Grafico*/
        function atualizaGraficoReceita(areaSelecionada, indicadorSelecionado, anoSelecionado) {

            /*RECEITA Servico angular que filtra a base por area e ano*/
            IndicadorAnual.getIndicadorAnualByAreaIndicadorAndYear({area: areaSelecionada, indicador: indicadorSelecionado, ano: anoSelecionado}, function (dados) {

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
                        /*Balao de informacoes quando passar o mouse*/
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
                                stacked: false,
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
                                    suggestedMax: maxChart,
                                    max: maxChart*1.15,
                                },
                            }]
                        },
                        plugins: {
                            datalabels: {
                                //Posicionamento dos valores no grafico
                                align: "top",
                                anchor: "end",
                                offset: 2,
                                padding: 0,
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
                                    weight: 400
                                },
                                formatter: (value, ctx) => {

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
            /*Fim Atualiza Grafico*/
        }

        /*RECEITA Logica de carregar os dados no grafico de receita*/
        function getDataIndicadorAnualReceita(dados) {

            let areas = [];
            let valores = [];
            let metas = [];
            let sentidoIndicador = [];

            let porcentagem = 0;

            let barChartDataReceita = {
                /*lista areas*/
                labels: areas,
                datasets: [{
                    //label: "",
                    fill: false,
                    //borderColor: window.chartColors.orange,
                    //borderWidth: 0,
                    /*Cores das Barras dos Meses*/
                    backgroundColor: [
                        color(window.chartColors.blue).alpha(0.5).rgbString(),
                    ],
                    /*Lista dos indicadores*/
                    stack: 'Stack 0',
                    data: valores
                },
                    {
                        //label: "",
                        fill: false,
                        //borderColor: window.chartColors.orange,
                        //borderWidth: 0,
                        /*Cores das Barras*/
                        backgroundColor: [
                            color(window.chartColors.grey).alpha(0.5).rgbString(),

                        ],
                        /*Lista dos indicadores*/
                        stack: 'Stack 0',
                        data: ''
                    }

                ]
            };

            /*Dados para printar no grafico*/

            areas.push(dados.area.nome);

            /*Cálculo da diferença do gráfico*/
            metas.push(Number(dados.meta - dados.valor));

            valores.push(Number(dados.valor));

            sentidoIndicador.push(dados.indicador.sentidoIndicador);

            /*            if (Math.max(valores) > Math.max(metas)) {
                            maxChart = Math.max(valores) * 1.5;
                        } else {
                            maxChart = Math.max(metas) * 1.5;
                        }*/

            maxChart = Math.max(valores);

            /*Repeticao responsavel por mudar a cor da barra atraves do sentido do indicador*/

            if (sentidoIndicador == 'CIMA') {
                if (metas < 0) {
                    barChartDataReceita.datasets[0].backgroundColor = color(window.chartColors.green).rgbString();
                } else {
                    barChartDataReceita.datasets[0].backgroundColor = color(window.chartColors.red).rgbString();
                }
            } else {
                if (metas < 0) {
                    barChartDataReceita.datasets[0].backgroundColor = color(window.chartColors.red).rgbString();
                } else {
                    barChartDataReceita.datasets[0].backgroundColor = color(window.chartColors.green).rgbString();
                }
            }

            return barChartDataReceita;
        }

        /*Evento ao clicar no grafico*/
        function selecionaArea(evt) {
            console.log("Área selecionada")
        }

        /*--------------------------------------------------------------------------------------------------------------------------------------------------*/

        /*Select - Quando selecionar a área - Receita*/
        $scope.hasChangedArea = function(area) {

            areaSelecionada = area;
            anoSelecionado = ultimoAno;

            $scope.listaIndicadores = [];
            $scope.listaAnos = [];

            window.graficoReceita.destroy();

            atualizaAreaAno(areaSelecionada, anoSelecionado);

        };

        /*Select - Quando selecionar o indicador*/
        $scope.hasChangedIndicador = function() {

            areaSelecionada = $scope.selectAreas.value;
            indicadorSelecionado = $scope.selectIndicadores.value;
            anoSelecionado = $scope.selectYears.value;

            window.graficoReceita.destroy();

            atualizaGraficoReceita(areaSelecionada, indicadorSelecionado, anoSelecionado);

        };

        /*Select - Quando selecionar o ano*/
        $scope.hasChangedYear = function() {

            areaSelecionada = $scope.selectAreas.value;
            anoSelecionado = $scope.selectYears.value;

            $scope.listaIndicadores = [];

            window.graficoReceita.destroy();

            atualizaAreaAnoIndicador(areaSelecionada, anoSelecionado);

        };

        /*-FIM*CORE------------------------------------------------------------------------------------------------------------------------------------------*/

    })
    /*2 - Controller Indicador Mensal Despesa*/
    .controller("indicadoranual.despesa.controller", function($scope, $state, Indicador, Area, IndicadorAnual, toastr){

        "use strict";

        /*-VARIAVEIS-------------------------------------------------------------------------------------------------------------------------------------*/

        let maxChart = 0;
        let dataAtual = new Date();

        /*Primeiro filtro realizado ao carregar a pagina*/
        let areaSelecionada = "CIBiogás";
        let indicadorSelecionado = '';
        let anoSelecionado = dataAtual.getFullYear().toString();
        let ultimoAno = '';
        let habilita2 = 0;

        $scope.listaAnos = [];
        $scope.listaIndicadores = [];
        $scope.listaAreas = [];

        /*-FIM-VARIAVEIS----------------------------------------------------------------------------------------------------------------------------------*/

        /*-GRAFICO-CORES----------------------------------------------------------------------------------------------------------------------------------*/

        window.chartColors = {
            red: "rgb(255, 99, 132)",
            orange: "rgb(255, 159, 64)",
            yellow: "rgb(255, 205, 86)",
            green: "rgb(75, 192, 192)",
            blue: "rgb(54, 162, 235)",
            purple: "rgb(153, 102, 255)",
            grey: "rgb(201, 203, 207)"
        };

        /*Canvas grafico-barras*/
        let color = Chart.helpers.color;

        /*-FIM-GRAFICO-CORES------------------------------------------------------------------------------------------------------------------------------*/

        /*-UTIL-------------------------------------------------------------------------------------------------------------------------------------------*/

        /*Funcao para formatar valores monetarios*/
        function formatCurrencyBR(n, c, d, t) {
            let s, j, i;
            c = isNaN(c = Math.abs(c)) ? 2 : c, d = d == undefined ? "," : d, t = t == undefined ? "." : t, s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
            return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
        }

        /*Funcao para remover valores duplicados dentro das listas*/
        function removeDuplicados(lista) {

            let unique = {};
            lista.forEach(function(i) {
                if(!unique[i]) {
                    unique[i] = true;
                }
            });

            return Object.keys(unique);
        }

        /*-FIM-UTIL---------------------------------------------------------------------------------------------------------------------------------------*/

        /*-CORE------------------------------------------------------------------------------------------------------------------------------------------*/

        /*Servico que resgata uma lista das areas ativadas*/
        Area.getAreas(function(listaAreas) {

            $scope.selectAreas = { "type": "select",
                "name": "Area",
                "value": listaAreas[0],
                "values": listaAreas

            };

        });

        /*Inicializa os Selects*/
        atualizaAreaAno(areaSelecionada, anoSelecionado);

        /*Inicio do Atualiza Area e Ano*/
        function atualizaAreaAno(areaSelecionada, anoSelecionado) {

            $scope.area = areaSelecionada;
            $scope.ano = anoSelecionado;

            IndicadorAnual.getIndicadorAnualByArea({area: $scope.area}, function(listaGestao) {

                /*Repeticao para montar a lista de selects de anos baseado por Indicador Anual*/
                for (let i = 0; i < listaGestao.length; i++) {
                    $scope.listaAnos.push(listaGestao[i].anoReferencia);
                }

                ultimoAno = $scope.listaAnos[0];

                $scope.selectYears = { "type": "select",
                    "name": "Ano",
                    "value": ultimoAno,
                    "values": removeDuplicados($scope.listaAnos)
                };

                /*Repeticao para verificar se o ano referencia for igual ao ano selecionado e o nome da area for igual a area selecionada*/
                for (let i = 0; i < listaGestao.length; i++) {
                    if (listaGestao[i].anoReferencia == ultimoAno && listaGestao[i].area.nome == $scope.selectAreas.value) {
                        $scope.listaIndicadores.push(listaGestao[i].indicador.nomenclatura);
                    }
                }

                if (habilita2 == 0) {
                    indicadorSelecionado = 'Despesa Realizada';
                    habilita2 = 1;
                }
                else {
                    indicadorSelecionado = $scope.listaIndicadores[0];
                }

                $scope.selectIndicadores = { "type": "select",
                    "name": "Indicador",
                    "value": indicadorSelecionado,
                    "values": removeDuplicados($scope.listaIndicadores)
                };

                atualizaGraficoDespesa(areaSelecionada, indicadorSelecionado, ultimoAno);

            }, function (dados) {
                console.log(dados);
                toastr.error(dados.statusText, "Internal Server Error");
            });

        }
        /*Fim Atualiza Area e Ano*/

        /*Inicio do Atualiza Area Ano e Indicador*/
        function atualizaAreaAnoIndicador(areaSelecionada, anoSelecionado) {

            IndicadorAnual.getIndicadorAnualByAreaIndicador({area: areaSelecionada, ano: anoSelecionado}, function(listaIndicadores) {

                /*Repeticao para verificar se o ano referencia for igual ao ano selecionado e o nome da area for igual a area selecionada*/
                for (let i = 0; i < listaIndicadores.length; i++) {

                    $scope.listaIndicadores.push(listaIndicadores[i].indicador.nomenclatura);

                }

                $scope.selectIndicadores = { "type": "select",
                    "name": "Indicador",
                    "value": $scope.listaIndicadores[0],
                    "values": removeDuplicados($scope.listaIndicadores)
                };

                indicadorSelecionado = $scope.listaIndicadores[0];

                atualizaGraficoDespesa(areaSelecionada, indicadorSelecionado, anoSelecionado);

            }, function (dados) {
                console.log(dados);
                toastr.error(dados.statusText, "Internal Server Error");
            });

        }
        /*Fim do Atualiza Area Ano e Indicador*/

        /*Inicio do Atualiza Grafico*/
        function atualizaGraficoDespesa(areaSelecionada, indicadorSelecionado, anoSelecionado) {

            /*RECEITA Servico angular que filtra a base por area e ano*/
            IndicadorAnual.getIndicadorAnualByAreaIndicadorAndYear({area: areaSelecionada, indicador: indicadorSelecionado, ano: anoSelecionado}, function (dados) {

                let ctx = document.getElementById("grafico-barras-despesa").getContext("2d");

                window.graficoDespesa = new Chart(ctx, {
                    type: "bar",
                    data: getDataIndicadorAnualDespesa(dados),
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
                        /*Balao de informacoes quando passar o mouse*/
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
                                stacked: false,
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
                                    suggestedMax: maxChart,
                                    max: maxChart*1.15,
                                },
                            }]
                        },
                        plugins: {
                            datalabels: {
                                //Posicionamento dos valores no grafico
                                align: "top",
                                anchor: "end",
                                offset: 2,
                                padding: 0,
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
                                    weight: 400
                                },
                                formatter: (value, ctx) => {

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
            /*Fim Atualiza Grafico*/
        }

        /*RECEITA Logica de carregar os dados no grafico de receita*/
        function getDataIndicadorAnualDespesa(dados) {

            let areas = [];
            let valores = [];
            let metas = [];

            let sentidoIndicador = [];

            let barChartDataReceita = {
                /*lista areas*/
                labels: areas,
                datasets: [{
                    //label: "",
                    fill: false,
                    //borderColor: window.chartColors.orange,
                    //borderWidth: 0,
                    /*Cores das Barras dos Meses*/
                    backgroundColor: [
                        color(window.chartColors.blue).alpha(0.5).rgbString(),
                    ],
                    /*Lista dos indicadores*/
                    stack: 'Stack 0',
                    data: valores
                },
                    {
                        //label: "",
                        fill: false,
                        //borderColor: window.chartColors.orange,
                        //borderWidth: 0,
                        /*Cores das Barras*/
                        backgroundColor: [
                            color(window.chartColors.grey).alpha(0.5).rgbString(),

                        ],
                        /*Lista dos indicadores*/
                        stack: 'Stack 0',
                        data: ''
                    }

                ]
            };

            /*Dados para printar no grafico*/

            areas.push(dados.area.nome);

            /*Cálculo da diferença do gráfico*/
            metas.push(Number(dados.meta - dados.valor));

            valores.push(Number(dados.valor));

            sentidoIndicador.push(dados.indicador.sentidoIndicador);

            /*            if (Math.max(valores) > Math.max(metas)) {
                            maxChart = Math.max(valores) * 1.5;
                        } else {
                            maxChart = Math.max(metas) * 1.5;
                        }*/

            maxChart = Math.max(valores);

            /*Repeticao responsavel por mudar a cor da barra atraves do sentido do indicador*/

            if (sentidoIndicador == 'CIMA') {
                if (metas < 0) {
                    barChartDataReceita.datasets[0].backgroundColor = color(window.chartColors.green).rgbString();
                } else {
                    barChartDataReceita.datasets[0].backgroundColor = color(window.chartColors.red).rgbString();
                }
            } else {
                if (metas < 0) {
                    barChartDataReceita.datasets[0].backgroundColor = color(window.chartColors.red).rgbString();
                } else {
                    barChartDataReceita.datasets[0].backgroundColor = color(window.chartColors.green).rgbString();
                }
            }

            return barChartDataReceita;
        }

        /*Evento ao clicar no grafico*/
        function selecionaArea(evt) {
            console.log("Área selecionada")
        }

        /*--------------------------------------------------------------------------------------------------------------------------------------------------*/

        /*Select - Quando selecionar a área - Receita*/
        $scope.hasChangedArea = function(area) {

            areaSelecionada = area;
            anoSelecionado = ultimoAno;

            $scope.listaIndicadores = [];
            $scope.listaAnos = [];

            window.graficoDespesa.destroy();

            atualizaAreaAno(areaSelecionada, anoSelecionado);

        };

        /*Select - Quando selecionar o indicador*/
        $scope.hasChangedIndicador = function() {

            areaSelecionada = $scope.selectAreas.value;
            indicadorSelecionado = $scope.selectIndicadores.value;
            anoSelecionado = $scope.selectYears.value;

            window.graficoDespesa.destroy();

            atualizaGraficoDespesa(areaSelecionada, indicadorSelecionado, anoSelecionado);

        };

        /*Select - Quando selecionar o ano*/
        $scope.hasChangedYear = function() {

            areaSelecionada = $scope.selectAreas.value;
            anoSelecionado = $scope.selectYears.value;

            $scope.listaIndicadores = [];

            window.graficoDespesa.destroy();

            atualizaAreaAnoIndicador(areaSelecionada, anoSelecionado);

        };

        /*-FIM*CORE------------------------------------------------------------------------------------------------------------------------------------------*/
    });
/*Final Controller Angular*/


<div class="col-md-6" ng-controller="indicadoranual.receita.controller">
    <!--Box Grafico-->
<div class="box">
    <div class="box-header with-border">
    <h3 class="box-title">Indicador Anual</h3>
<div class="form-group pull-right">
    <div class="btn-group input-group-sm">
    <div class="form-group">
    <select class="form-control" ng-change="hasChangedArea(selectAreas.value)" ng-model="selectAreas.value" ng-options="y for y in selectAreas.values"></select>
    </div>
    </div>
    <div class="btn-group input-group-sm">
    <div class="form-group">
    <select class="form-control" ng-change="hasChangedIndicador(selectIndicadores.value)" ng-model="selectIndicadores.value" ng-options="y for y in selectIndicadores.values"></select>
    </div>
    </div>
    <div class="btn-group input-group-sm">
    <div class="form-group">
    <select class="form-control" ng-change="hasChangedYear(selectYears.value)" ng-model="selectYears.value" ng-options="y for y in selectYears.values"></select>
    </div>
    </div>
    </div>
    </div>
    <div class="box-body">
    <div class="chart">
    <canvas id="grafico-barras-receita" class="chartjs-render-monitor" style="height: 230px; width: 788px;" width="788" height="300"></canvas>
    </div>
    </div>
    </div>
    <!--Fim - Box Grafico-->
    </div>




