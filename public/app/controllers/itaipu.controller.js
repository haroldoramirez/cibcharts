angular.module("cibcharts")
    .controller("itaipu.controller", function ($scope, $state, $stateParams, BaseTotal, BaseCalculadaDia, BasePing, toastr, $q, $timeout, Usuario, $rootScope) {

        "use strict";

        //Logo convertida em base64
        let cib_logo = 'data:image/png;base64,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'

        //Flag para mostrar botao
        $scope.mostrar = false;

        /*Verifica pelo usuario se esta logado*/
        $scope.init = function() {
            Usuario.getAutenticado(function(data) {
                $rootScope.usuario = data;
                $scope.mostrar = true;
            },function() {
                $scope.mostrar = false;
            });
        };

        let defer = $q.defer();
        let dataAtual;

        $scope.loading = true;
        $scope.nomePropriedade = "Itaipu";

        /*Verifica se o parametro veio nulo*/
        if ($stateParams.obj === null) {
            dataAtual = new Date();
        } else {
            dataAtual = new Date($stateParams.obj);
        }

        let dataSelecionada = dataAtual;

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

        /*Cores dos Charts*/
        let color = Chart.helpers.color;

        /*--------------------------------------------------------------------------------*/

        /*Inicia e atualiza os graficos com a data atual*/
        atualizaMeses(dataSelecionada);
        atualizaDias(dataSelecionada);
        atualizaPings(dataSelecionada);

        /*--------------------------------------------------------------------------------*/

        /*Inicio da Funcao AtualizaMeses*/
        function atualizaMeses(dataSelecionada) {

            $scope.fullYear = dataSelecionada.getFullYear();
            $scope.month = dataSelecionada.getMonth() + 1;

            let totalPings = 0;
            let totalFalhas = 0;
            let indicadorAno = 0;

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
                toastr.error("Falha ao carregar os anos", "Internal Server Error");
            });

            /*Servico angular que filtra a basetotal por propriedade e ano*/
            BaseTotal.getBaseFilteredByPropertyAndYear({propriedade: $scope.nomePropriedade, ano: $scope.fullYear}, function(dados) {

                $scope.baseTotalFiltrada = dados;

                let ctx = document.getElementById("grafico-barras-mes").getContext("2d");

                window.graficoComunicacaoMeses = new Chart(ctx, {
                    type: "bar",
                    data: getDataIndMeses(dados),
                    options: {
                        responsive: true,
                        legend: {
                            display: false,
                            position: "top",
                        },
                        title: {
                            display: false,
                            text: "Disponibilidade de Comunicação Total - " + listaMeses[dataSelecionada.getMonth()] + " de " + dataSelecionada.getFullYear(),
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
                                    beginAtZero:true,
                                    fontSize: 12,
                                    fontStyle: "bold",
                                },
                                scaleLabel: {
                                    display: true,
                                    fontSize: 12,
                                    fontStyle: "bold",
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
                                    size: 14,
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
                        onClick: clickMes
                    },
                });
            }, function(dados) {
                console.log(dados);
                toastr.error("Falha ao carregar os meses", "Internal Server Error");
            });
            /*Fim do Servico angular*/

            /*Funcao responsavel por tratar os dados dos MESES*/
            function getDataIndMeses(dados) {
                let indicadores = [];

                let barChartDataMeses = {
                    /*lista propriedades*/
                    labels: listaMeses,
                    datasets: [{
                        //label: "",
                        //borderColor: window.chartColors.blue,
                        //borderWidth: 0,
                        /*Cores das Barras dos Meses*/
                        backgroundColor: [
                            /*Cor blue da barra do ano*/
                            color(window.chartColors.blue).alpha(0.5).rgbString(),
                            color(window.chartColors.orange).alpha(0.5).rgbString(),
                            color(window.chartColors.orange).alpha(0.5).rgbString(),
                            color(window.chartColors.orange).alpha(0.5).rgbString(),
                            color(window.chartColors.orange).alpha(0.5).rgbString(),
                            color(window.chartColors.orange).alpha(0.5).rgbString(),
                            color(window.chartColors.orange).alpha(0.5).rgbString(),
                            color(window.chartColors.orange).alpha(0.5).rgbString(),
                            color(window.chartColors.orange).alpha(0.5).rgbString(),
                            color(window.chartColors.orange).alpha(0.5).rgbString(),
                            color(window.chartColors.orange).alpha(0.5).rgbString(),
                            color(window.chartColors.orange).alpha(0.5).rgbString(),
                            color(window.chartColors.orange).alpha(0.5).rgbString()
                        ],
                        /*Lista dos indicadores*/
                        data: indicadores
                    }]

                };

                /*Inicializa os dados da barra do ano*/
                listaMeses[0] = dataSelecionada.getFullYear();

                /*Separa a primeira barra para o indicador de ano*/
                barChartDataMeses.datasets[0].data[0] = 0;

                /*Caso for carregado o ano anterior devemos empurrar os dados - solucao paleativa*/
                if (dataSelecionada.getFullYear() == "2018") {
                    barChartDataMeses.datasets[0].data[1] = 0;
                    barChartDataMeses.datasets[0].data[2] = 0;
                    barChartDataMeses.datasets[0].data[3] = 0;
                    barChartDataMeses.datasets[0].data[4] = 0;
                    barChartDataMeses.datasets[0].data[5] = 0;
                    barChartDataMeses.datasets[0].data[6] = 0;
                    barChartDataMeses.datasets[0].data[7] = 0;
                    barChartDataMeses.datasets[0].data[8] = 0;
                    barChartDataMeses.datasets[0].data[9] = 0;
                    barChartDataMeses.datasets[0].data[10] = 0;
                }

                /*Percorre a lista de dados*/
                for (let i = 0; i < dados.length; i++) {
                    indicadores.push(Number(dados[i].indicador).toFixed(0));
                    totalPings = parseFloat(dados[i].totalPing) + totalPings;
                    totalFalhas = parseFloat(dados[i].totalFalha) + totalFalhas;
                }

                if (totalPings == 0 || totalFalhas == 0) {
                    indicadorAno = 0;
                } else {
                    /*Adicionar o valor do indicador na barra do ano selecionado*/
                    indicadorAno = (1-(totalFalhas/totalPings))*100;
                }

                /*Adicionar os valores na barra do ano atual*/
                barChartDataMeses.datasets[0].data[0] = Number(indicadorAno).toFixed(0);

                /*Deixa na cor verde a barra com data atual*/
                barChartDataMeses.datasets[0].backgroundColor[$scope.month] = color(window.chartColors.green).alpha(0.5).rgbString();

                return barChartDataMeses;
            }
            /*Fim dos graficos de Meses*/

        }
        /*Fim da funcao atualizaMeses*/

        /*--------------------------------------------------------------------------------*/

        /*Inicio da Funcao atualizaDias*/
        function atualizaDias(dataSelecionada) {

            $scope.loadingDias = true;

            $scope.fullYear = dataSelecionada.getFullYear();
            $scope.month = dataSelecionada.getMonth() + 1;
            $scope.fullMonth = listaMeses[dataSelecionada.getMonth() + 1];

            /*Inicio - Promessa para efeitos de loading*/
            defer.promise.then(function() {

                /*Grafico de base total de Comunicacao por DIA*/
                BaseCalculadaDia.getBaseDayFilteredByPropertyAndYear({propriedade: $scope.nomePropriedade, ano: $scope.fullYear, mes: $scope.month}, function(dados) {

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

                    let ctx = document.getElementById("grafico-linhas-dia").getContext("2d");

                    window.graficoComunicacaoDias = new Chart(ctx, {
                        type: "LineWithLine",
                        data: getDataIndDias(dados),
                        options: {
                            responsive: true,
                            legend: {
                                display: false,
                                position: "top",
                            },
                            title: {
                                display: false,
                                text: "Disponibilidade de Comunicação Total por Dia - " + listaMeses[dataSelecionada.getMonth()] + " de " + dataSelecionada.getFullYear(),
                            },
                            tooltips: {
                                //mode: "index",
                                intersect: false,
                                callbacks: {
                                    title: function(tooltipItems) {
                                        //Return value for title
                                        return "Dia: " + tooltipItems[0].xLabel;
                                    },
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
                                    stacked: true,
                                    offset: true,
                                    ticks: {
                                        beginAtZero:false,
                                        fontSize: 12,
                                        fontStyle: "bold",
                                    },
                                    scaleLabel: {
                                        display: true,
                                        labelString: "Dia",
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
                                        min: 0,
                                        max: 115,
                                        fontSize: 12,
                                        fontStyle: "bold",
                                        callback: function(label) {
                                            switch (label) {
                                                case 0:
                                                    return "0 %";
                                                case 50:
                                                    return "50 %";
                                                case 100:
                                                    return "100 %";
                                            }
                                        }
                                    },
                                    scaleLabel: {
                                        display: true,
                                        fontSize: 12,
                                        fontStyle: "bold",
                                        labelString: "Disponibilidade de Comunicação"
                                    },
                                    gridLines: {
                                        display:false
                                    }
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
                                        size: 15,
                                        weight: 600
                                    },
                                    //Posicionamento dos valores no grafico
                                    //offset: 7,
                                    //padding: 1,
                                    anchor: "end",
                                    formatter: function(value) {
                                        return value + " %";
                                    }
                                }
                            },
                            //onClick: clickDia
                        }
                    });
                });

            });
            /*Fim - Promessa para efeitos de loading*/

            resolveLaterDias(defer);

            /*Funcao responsavel por tratar os dados dos DIAS*/
            function getDataIndDias(dados)
            {
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
                        borderWidth: 4,
                        pointHoverRadius: 6,
                        pointHoverBackgroundColor: window.chartColors.blue,
                        /*Lista dos indicadores*/
                        data: indicadores
                    }],

                };

                /*Percorre a lista de dados*/
                for (let i = 0; i < dados.length; i++) {
                    indicadores.push(Number(dados[i].indicador).toFixed(0));
                    dias.push(dados[i].dia)
                }

                $scope.loadingDias = false;

                return lineChartDataDias;
            }
            /*Fim graficos do dia*/

        }
        /*Fim da funcao atualizaDias*/

        /*--------------------------------------------------------------------------------*/

        /*Inicio da Funcao atualizaPings*/
        function atualizaPings(dataSelecionada) {

            $scope.loadingPings = true;

            $scope.fullYear = dataSelecionada.getFullYear();
            $scope.month = dataSelecionada.getMonth() + 1;
            $scope.fullMonth = listaMeses[dataSelecionada.getMonth() + 1];

            /*Promessa para efeitos de loading*/
            defer.promise.then(function() {

                /*Grafico de Tentativas de Conexão - PINGS*/
                BasePing.getBasePingFilteredByPropertyYearMonth({propriedade: $scope.nomePropriedade, ano: $scope.fullYear, mes: $scope.month}, function(dados) {

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

                    let ctx = document.getElementById("grafico-linhas-pings").getContext("2d");

                    window.graficoComunicacaoPings = new Chart(ctx, {
                        type: "LineWithLine",
                        data: getDataPings(dados),
                        options: {
                            responsive: true,
                            legend: {
                                display: false,
                                position: "top",
                            },
                            plugins: {
                                datalabels: {
                                    display: false
                                }
                            },
                            title: {
                                display: false,
                                text: "Tentativas de Conexão - " + listaMeses[dataSelecionada.getMonth()] + " de " + dataSelecionada.getFullYear(),
                            },
                            tooltips: {
                                mode: "index",
                                intersect: false,
                                callbacks: {
                                    title: function(tooltipItems) {
                                        //Return value for title
                                        return "Timestamp: " + tooltipItems[0].xLabel;
                                    },
                                    label: function(tooltipItem, data) {

                                        let conexao = "";

                                        let label = data.datasets[tooltipItem.datasetIndex].label || "";

                                        label += tooltipItem.yLabel;

                                        if (label == 1) {
                                            conexao = "CONECTADO"
                                        } else {
                                            conexao = "DESCONECTADO"
                                        }

                                        return label + " - " + conexao;
                                    }
                                }
                            },
                            scaleShowValues: true,
                            scales: {
                                xAxes: [{
                                    display: true,
                                    stacked: true,
                                    offset: true,
                                    ticks: {
                                        /*Precisa autoSkip pra nao aparecer muitas informacoes*/
                                        autoSkip: true,
                                        maxRotation: 90,
                                        minRotation: 90,
                                        maxTicksLimit: 15,
                                    },
                                    scaleLabel: {
                                        display: true,
                                        labelString: "Timestamp"
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
                                        autoSkip: false,
                                        beginAtZero:true,
                                        min: 0,
                                        max: 1,
                                        stepSize: 1,
                                        callback: function(label) {
                                            switch (label) {
                                                case 0:
                                                    return "DESCONECTADO";
                                                case 1:
                                                    return "CONECTADO";
                                            }
                                        }
                                    },
                                    scaleLabel: {
                                        display: false,
                                        labelString: "Pings"
                                    },
                                    gridLines: {
                                        display:false
                                    }
                                }],
                            },
                            elements: {
                                line: {
                                    tension: 0, // disables bezier curves
                                }
                            }
                            //onClick: clickPing
                        }
                    });
                });

            });

            resolveLaterPings(defer);

            /*Funcao responsavel por tratar os dados dos PINGS*/
            function getDataPings(dados)
            {
                let tempo = [];
                let listaPings = [];

                let lineChartDataPings = {
                    /*lista propriedades*/
                    labels: tempo,
                    datasets: [{
                        //label: "",
                        fill: false,
                        backgroundColor: color(window.chartColors.blue).alpha(0.5).rgbString(),
                        borderColor: window.chartColors.blue,
                        borderWidth: 1,
                        pointRadius: 0,
                        steppedLine: true,
                        /*Lista dos indicadores*/
                        data: listaPings
                    }],

                };

                /*Percorre a lista de dados*/
                for (let i = 0; i < dados.length; i++) {

                    var date = new moment(dados[i].dataDoPing).format('DD-MM-YYYY - HH:mm:ss');

                    tempo.push(date);

                    if(dados[i].socketConnectionTest === "FAIL" || dados[i].socketConnectionTest === "SLOW" || dados[i].socketConnectionTest === "") {
                        listaPings.push(0);
                    } else {
                        listaPings.push(1);
                    }

                }

                $scope.loadingPings = false;

                return lineChartDataPings;
            }
            /*Fim do grafico de Pings*/

        }
        /*Fim da Funcao atualizaPings*/

        /*--------------------------------------------------------------------------------*/

        /*Resolve da Promise - Dias*/
        function resolveLaterDias(defer) {
            doLaterDias(defer, 'resolve');
        }

        /*Funcao que e exacutada em um delay - para auxiliar nas animacoes - Dias*/
        function doLaterDias(defer, what) {
            $timeout(function() {
                defer[what]();
            }, 1000);
        }

        /*Resolve da Promise - Pings*/
        function resolveLaterPings(defer) {
            doLaterPings(defer, 'resolve');
        }

        /*Funcao que e exacutada em um delay - para auxiliar nas animacoes - Pings*/
        function doLaterPings(defer, what) {
            $timeout(function() {
                defer[what]();
            }, 4000);
        }

        /*--------------------------------------------------------------------------------*/

        /*Evento ao clicar no grafico de Meses*/
        function clickMes(evt) {

            let background = [color(window.chartColors.blue).alpha(0.5).rgbString(),
                color(window.chartColors.orange).alpha(0.5).rgbString(),
                color(window.chartColors.orange).alpha(0.5).rgbString(),
                color(window.chartColors.orange).alpha(0.5).rgbString(),
                color(window.chartColors.orange).alpha(0.5).rgbString(),
                color(window.chartColors.orange).alpha(0.5).rgbString(),
                color(window.chartColors.orange).alpha(0.5).rgbString(),
                color(window.chartColors.orange).alpha(0.5).rgbString(),
                color(window.chartColors.orange).alpha(0.5).rgbString(),
                color(window.chartColors.orange).alpha(0.5).rgbString(),
                color(window.chartColors.orange).alpha(0.5).rgbString(),
                color(window.chartColors.orange).alpha(0.5).rgbString(),
                color(window.chartColors.orange).alpha(0.5).rgbString()];

            let activeElementMes = graficoComunicacaoMeses.getElementAtEvent(evt);

            if (activeElementMes[0]._model.label == "Novembro") {

                if ((dataSelecionada.getFullYear() == 2018) && (dataSelecionada.getMonth() != 10)) {
                    dataSelecionada = new Date("11-02-2018");
                }

                if (activeElementMes.length) {
                    activeElementMes[0]._chart.config.data.datasets[0].data.forEach((value, index) => {

                        // set element to the original colour (resets all).
                        activeElementMes[0]._chart.config.data.datasets[0].backgroundColor[index] = background[index];
                        if (index == activeElementMes[0]._index) {
                            // set the clicked element to red.
                            activeElementMes[0]._chart.config.data.datasets[0].backgroundColor[index] = color(window.chartColors.green).alpha(0.5).rgbString();
                        }
                    });

                    graficoComunicacaoMeses.update();
                    graficoComunicacaoDias.destroy();
                    graficoComunicacaoPings.destroy();
                    atualizaDias(dataSelecionada);
                    atualizaPings(dataSelecionada);

                    /*Apply para atualizar o scope dos meses*/
                    $scope.$apply();
                }
            } else if (activeElementMes[0]._model.label == "Dezembro") {

                if ((dataSelecionada.getFullYear() == 2018) && (dataSelecionada.getMonth() != 11)) {
                    dataSelecionada = new Date("12-02-2018");
                }

                if (activeElementMes.length) {
                    activeElementMes[0]._chart.config.data.datasets[0].data.forEach((value, index) => {

                        // set element to the original colour (resets all).
                        activeElementMes[0]._chart.config.data.datasets[0].backgroundColor[index] = background[index];
                        if (index == activeElementMes[0]._index) {
                            // set the clicked element to red.
                            activeElementMes[0]._chart.config.data.datasets[0].backgroundColor[index] =  color(window.chartColors.green).alpha(0.5).rgbString();
                        }
                    });

                    graficoComunicacaoMeses.update();
                    graficoComunicacaoDias.destroy();
                    graficoComunicacaoPings.destroy();
                    atualizaDias(dataSelecionada);
                    atualizaPings(dataSelecionada);

                    /*Apply para atualizar o scope dos meses*/
                    $scope.$apply();
                }
            } else if (activeElementMes[0]._model.label === "Janeiro") {

                dataSelecionada = new Date("01-30-2019");

                if (activeElementMes.length) {
                    activeElementMes[0]._chart.config.data.datasets[0].data.forEach((value, index) => {

                        // set element to the original colour (resets all).
                        activeElementMes[0]._chart.config.data.datasets[0].backgroundColor[index] = background[index];
                        if (index == activeElementMes[0]._index) {
                            // set the clicked element to red.
                            activeElementMes[0]._chart.config.data.datasets[0].backgroundColor[index] =  color(window.chartColors.green).alpha(0.5).rgbString();
                        }
                    });

                    graficoComunicacaoMeses.update();
                    graficoComunicacaoDias.destroy();
                    graficoComunicacaoPings.destroy();
                    atualizaDias(dataSelecionada);
                    atualizaPings(dataSelecionada);

                    /*Apply para atualizar o scope dos meses*/
                    $scope.$apply();
                }
            } else if (activeElementMes[0]._model.label === "Fevereiro") {

                dataSelecionada = new Date("02-02-2019");

                if (activeElementMes.length) {
                    activeElementMes[0]._chart.config.data.datasets[0].data.forEach((value, index) => {

                        // set element to the original colour (resets all).
                        activeElementMes[0]._chart.config.data.datasets[0].backgroundColor[index] = background[index];
                        if (index == activeElementMes[0]._index) {
                            // set the clicked element to green.
                            activeElementMes[0]._chart.config.data.datasets[0].backgroundColor[index] =  color(window.chartColors.green).alpha(0.5).rgbString();
                        }
                    });

                    graficoComunicacaoMeses.update();
                    graficoComunicacaoDias.destroy();
                    graficoComunicacaoPings.destroy();
                    atualizaDias(dataSelecionada);
                    atualizaPings(dataSelecionada);

                    /*Apply para atualizar o scope dos meses*/
                    $scope.$apply();
                }
            } else if (activeElementMes[0]._model.label === "Março") {

                dataSelecionada = new Date("03-02-2019");

                if (activeElementMes.length) {
                    activeElementMes[0]._chart.config.data.datasets[0].data.forEach((value, index) => {

                        // set element to the original colour (resets all).
                        activeElementMes[0]._chart.config.data.datasets[0].backgroundColor[index] = background[index];
                        if (index == activeElementMes[0]._index) {
                            // set the clicked element to red.
                            activeElementMes[0]._chart.config.data.datasets[0].backgroundColor[index] =  color(window.chartColors.green).alpha(0.5).rgbString();
                        }
                    });

                    graficoComunicacaoMeses.update();
                    graficoComunicacaoDias.destroy();
                    graficoComunicacaoPings.destroy();
                    atualizaDias(dataSelecionada);
                    atualizaPings(dataSelecionada);

                    /*Apply para atualizar o scope dos meses*/
                    $scope.$apply();
                }
            } else if (activeElementMes[0]._model.label === "Abril") {

                dataSelecionada = new Date("04-02-2019");

                if (activeElementMes.length) {
                    activeElementMes[0]._chart.config.data.datasets[0].data.forEach((value, index) => {

                        // set element to the original colour (resets all).
                        activeElementMes[0]._chart.config.data.datasets[0].backgroundColor[index] = background[index];
                        if (index == activeElementMes[0]._index) {
                            // set the clicked element to red.
                            activeElementMes[0]._chart.config.data.datasets[0].backgroundColor[index] =  color(window.chartColors.green).alpha(0.5).rgbString();
                        }
                    });

                    graficoComunicacaoMeses.update();
                    graficoComunicacaoDias.destroy();
                    graficoComunicacaoPings.destroy();
                    atualizaDias(dataSelecionada);
                    atualizaPings(dataSelecionada);

                    /*Apply para atualizar o scope dos meses*/
                    $scope.$apply();
                }
            } else if (activeElementMes[0]._model.label === "Maio") {

                dataSelecionada = new Date("05-02-2019");

                if (activeElementMes.length) {
                    activeElementMes[0]._chart.config.data.datasets[0].data.forEach((value, index) => {

                        // set element to the original colour (resets all).
                        activeElementMes[0]._chart.config.data.datasets[0].backgroundColor[index] = background[index];
                        if (index == activeElementMes[0]._index) {
                            // set the clicked element to red.
                            activeElementMes[0]._chart.config.data.datasets[0].backgroundColor[index] =  color(window.chartColors.green).alpha(0.5).rgbString();
                        }
                    });

                    graficoComunicacaoMeses.update();
                    graficoComunicacaoDias.destroy();
                    graficoComunicacaoPings.destroy();
                    atualizaDias(dataSelecionada);
                    atualizaPings(dataSelecionada);

                    /*Apply para atualizar o scope dos meses*/
                    $scope.$apply();
                }
            } else if (activeElementMes[0]._model.label === "Junho") {

                dataSelecionada = new Date("06-02-2019");

                if (activeElementMes.length) {
                    activeElementMes[0]._chart.config.data.datasets[0].data.forEach((value, index) => {

                        // set element to the original colour (resets all).
                        activeElementMes[0]._chart.config.data.datasets[0].backgroundColor[index] = background[index];
                        if (index == activeElementMes[0]._index) {
                            // set the clicked element to red.
                            activeElementMes[0]._chart.config.data.datasets[0].backgroundColor[index] =  color(window.chartColors.green).alpha(0.5).rgbString();
                        }
                    });

                    graficoComunicacaoMeses.update();
                    graficoComunicacaoDias.destroy();
                    graficoComunicacaoPings.destroy();
                    atualizaDias(dataSelecionada);
                    atualizaPings(dataSelecionada);

                    /*Apply para atualizar o scope dos meses*/
                    $scope.$apply();
                }
            } else if (activeElementMes[0]._model.label === "Julho") {

                dataSelecionada = new Date("07-02-2019");

                if (activeElementMes.length) {
                    activeElementMes[0]._chart.config.data.datasets[0].data.forEach((value, index) => {

                        // set element to the original colour (resets all).
                        activeElementMes[0]._chart.config.data.datasets[0].backgroundColor[index] = background[index];
                        if (index == activeElementMes[0]._index) {
                            // set the clicked element to red.
                            activeElementMes[0]._chart.config.data.datasets[0].backgroundColor[index] =  color(window.chartColors.green).alpha(0.5).rgbString();
                        }
                    });

                    graficoComunicacaoMeses.update();
                    graficoComunicacaoDias.destroy();
                    graficoComunicacaoPings.destroy();
                    atualizaDias(dataSelecionada);
                    atualizaPings(dataSelecionada);

                    /*Apply para atualizar o scope dos meses*/
                    $scope.$apply();
                }
            } else if (activeElementMes[0]._model.label === "Agosto") {

                dataSelecionada = new Date("08-02-2019");

                if (activeElementMes.length) {
                    activeElementMes[0]._chart.config.data.datasets[0].data.forEach((value, index) => {

                        // set element to the original colour (resets all).
                        activeElementMes[0]._chart.config.data.datasets[0].backgroundColor[index] = background[index];
                        if (index == activeElementMes[0]._index) {
                            // set the clicked element to red.
                            activeElementMes[0]._chart.config.data.datasets[0].backgroundColor[index] =  color(window.chartColors.green).alpha(0.5).rgbString();
                        }
                    });

                    graficoComunicacaoMeses.update();
                    graficoComunicacaoDias.destroy();
                    graficoComunicacaoPings.destroy();
                    atualizaDias(dataSelecionada);
                    atualizaPings(dataSelecionada);

                    /*Apply para atualizar o scope dos meses*/
                    $scope.$apply();
                }
            } else if (activeElementMes[0]._model.label === "Setembro") {

                dataSelecionada = new Date("09-02-2019");

                if (activeElementMes.length) {
                    activeElementMes[0]._chart.config.data.datasets[0].data.forEach((value, index) => {

                        // set element to the original colour (resets all).
                        activeElementMes[0]._chart.config.data.datasets[0].backgroundColor[index] = background[index];
                        if (index == activeElementMes[0]._index) {
                            // set the clicked element to red.
                            activeElementMes[0]._chart.config.data.datasets[0].backgroundColor[index] =  color(window.chartColors.green).alpha(0.5).rgbString();
                        }
                    });

                    graficoComunicacaoMeses.update();
                    graficoComunicacaoDias.destroy();
                    graficoComunicacaoPings.destroy();
                    atualizaDias(dataSelecionada);
                    atualizaPings(dataSelecionada);

                    /*Apply para atualizar o scope dos meses*/
                    $scope.$apply();
                }
            } else if (activeElementMes[0]._model.label === "Outubro") {

                dataSelecionada = new Date("10-02-2019");

                if (activeElementMes.length) {
                    activeElementMes[0]._chart.config.data.datasets[0].data.forEach((value, index) => {

                        // set element to the original colour (resets all).
                        activeElementMes[0]._chart.config.data.datasets[0].backgroundColor[index] = background[index];
                        if (index == activeElementMes[0]._index) {
                            // set the clicked element to red.
                            activeElementMes[0]._chart.config.data.datasets[0].backgroundColor[index] =  color(window.chartColors.green).alpha(0.5).rgbString();
                        }
                    });

                    graficoComunicacaoMeses.update();
                    graficoComunicacaoDias.destroy();
                    graficoComunicacaoPings.destroy();
                    atualizaDias(dataSelecionada);
                    atualizaPings(dataSelecionada);

                    /*Apply para atualizar o scope dos meses*/
                    $scope.$apply();
                }
            } else if (activeElementMes[0]._model.label === "Novembro") {

                dataSelecionada = new Date("11-02-2019");

                if (activeElementMes.length) {
                    activeElementMes[0]._chart.config.data.datasets[0].data.forEach((value, index) => {

                        // set element to the original colour (resets all).
                        activeElementMes[0]._chart.config.data.datasets[0].backgroundColor[index] = background[index];
                        if (index == activeElementMes[0]._index) {
                            // set the clicked element to red.
                            activeElementMes[0]._chart.config.data.datasets[0].backgroundColor[index] =  color(window.chartColors.green).alpha(0.5).rgbString();
                        }
                    });

                    graficoComunicacaoMeses.update();
                    graficoComunicacaoDias.destroy();
                    graficoComunicacaoPings.destroy();
                    atualizaDias(dataSelecionada);
                    atualizaPings(dataSelecionada);

                    /*Apply para atualizar o scope dos meses*/
                    $scope.$apply();
                }
            } else if (activeElementMes[0]._model.label === "Dezembro") {

                dataSelecionada = new Date("12-02-2019");

                if (activeElementMes.length) {
                    activeElementMes[0]._chart.config.data.datasets[0].data.forEach((value, index) => {

                        // set element to the original colour (resets all).
                        activeElementMes[0]._chart.config.data.datasets[0].backgroundColor[index] = background[index];
                        if (index == activeElementMes[0]._index) {
                            // set the clicked element to red.
                            activeElementMes[0]._chart.config.data.datasets[0].backgroundColor[index] =  color(window.chartColors.green).alpha(0.5).rgbString();
                        }
                    });

                    graficoComunicacaoMeses.update();
                    graficoComunicacaoDias.destroy();
                    graficoComunicacaoPings.destroy();
                    atualizaDias(dataSelecionada);
                    atualizaPings(dataSelecionada);

                    /*Apply para atualizar o scope dos meses*/
                    $scope.$apply();
                }
            }

        }
        /*Fim clickar no mes*/

        /*--------------------------------------------------------------------------------*/

        /*Change ao clickar no ano*/
        $scope.hasChangedYear = function(ano) {
            if (ano == 2018) {
                dataSelecionada = new Date("12-25-2018");
                graficoComunicacaoMeses.destroy();
                graficoComunicacaoDias.destroy();
                graficoComunicacaoPings.destroy();
                atualizaMeses(dataSelecionada);
                atualizaDias(dataSelecionada);
                atualizaPings(dataSelecionada);
            } else if (ano == 2019) {
                dataSelecionada = new Date();
                graficoComunicacaoMeses.destroy();
                graficoComunicacaoDias.destroy();
                graficoComunicacaoPings.destroy();
                atualizaMeses(dataSelecionada);
                atualizaDias(dataSelecionada);
                atualizaPings(dataSelecionada);
            }
        };
        /*Fim clickar no ano*/

        /*-INICIO-PDF-------------------------------------------------------------------------------*/

        var fonts = {
                    Roboto: {
                        normal: 'fonts/Roboto-Regular.ttf',
                        bold: 'fonts/Roboto-Medium.ttf',
                        italics: 'fonts/Roboto-Italic.ttf',
                        bolditalics: 'fonts/Roboto-MediumItalic.ttf'
                    }
                };

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

        /*-FIM-PDF----------------------------------------------------------------------------------*/

    });
/*Fim do modulo Angular*/
