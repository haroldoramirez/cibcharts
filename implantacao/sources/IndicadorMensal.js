IndicadorMensal.getIndicadorMensalDespesa({ano: $scope.fullYear}, function(dados) {

    $scope.baseIndicadorMensalDespesa = dados;

    let graficoDespesa = document.getElementById("grafico-barras-mes-despesas").getContext("2d");

    /*Inicio do grafico Despesa*/
    window.graficoDespesasMeses = new Chart(graficoDespesa, {
        type: "bar",
        data: getDataIndDespesaMeses(dados),
        options: {
            responsive: true,
            legend: {
                display: false,
                position: "top",
            },
            title: {
                display: false,
                text: "Indicador Mensal - " + listaMeses[dataSelecionada.getMonth()] + " de " + dataSelecionada.getFullYear(),
            },
            tooltips: {
                //mode: "index",
                //intersect: false,
                callbacks: {
                    label: function(tooltipItem, data) {

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
                        beginAtZero:true
                    },
                    scaleLabel: {
                        display: true,
                        labelString: "Mês"
                    },
                    gridLines: {
                        display:false
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
                        display:false
                    },
                    ticks: {
                        //stepSize: 1,
                        beginAtZero:true,
                        min: 0,
                        max: 1000000,
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
                        size: 12,
                        weight: 350
                    },
                    //Posicionamento dos valores no grafico
                    //offset: 7,
                    //padding: 1,
                    //anchor: "end",
                    formatter: function(value) {
                        /*Funcao para formatar valores monetarios R$*/
                        let formatedValue = formatCurrencyBR(value);

                        return "R$ " + formatedValue;
                    }
                }
            },
            onClick: clickMes
        },
    });
    /*Fim do grafico Despesa*/

}, function(dados) {
    console.log(dados);
    toastr.error(dados.statusText, "Internal Server Error");
});

/*Funcao responsavel por tratar os dados dos MESES do grafico DESPESAS*/
function getDataIndDespesaMeses(despesas) {

    let valores = [];
    let metas = [];
    let sentidoIndicador = [];

    let barChartDataMeses = {
        /*lista propriedades*/
        labels: listaMeses,
        datasets: [{
            type: 'line',
            //label: "",
            //borderWidth: 2,
            /*Cores das Barras*/
            /*backgroundColor: [
              color(window.chartColors.red).rgbString(),
            ],*/
            /*Lista dos indicadores*/
            //stack: 'Stack 0',
            fill: false,
            backgroundColor: color(window.chartColors.yellow).alpha(0.5).rgbString(),
            borderColor: window.chartColors.yellow,
            borderWidth: 1,
            pointHoverRadius: 3,
            pointHoverBackgroundColor: window.chartColors.yellow,
            /*Lista dos indicadores*/
            data: metas
        },
            {
                fill: false,
                //label: "",
                //borderColor: window.chartColors.blue,
                //borderWidth: 0,
                /*Cores das Barras dos Meses*/
                backgroundColor: [
                    /*Cor blue da barra do ano*/
                    color(window.chartColors.blue).alpha(0.5).rgbString()
                ],
                /*Lista dos valores para a barra*/
                stack: 'Stack 0',
                data: valores
            }
        ]

    };

    /*Inicializa os dados da barra do ano*/
    listaMeses[0] = dataSelecionada.getFullYear();

    /*Separa a primeira barra para o escrever a META*/
    barChartDataMeses.datasets[0].data[0] = Number(despesas[0].gestaoCentro.meta);
    barChartDataMeses.datasets[1].data[0] = Number(despesas[0].gestaoCentro.valor);
    sentidoIndicador.push(despesas[0].gestaoCentro.indicador.cimaBaixo);

    /*Percorre a lista de dados*/
    for (let i = 0; i < despesas.length; i++)
    {
        metas.push(Number(despesas[i].meta));

        valores.push(Number(despesas[i].valor).toFixed(0));

        /*Pegar sentido do indicador*/
        sentidoIndicador.push(despesas[i].gestaoCentro.indicador.cimaBaixo);
    }

    /*Repeticao responsavel por mudar a cor da barra atraves do sentido do indicador*/
    for(let i = 0; i < valores.length; i++)
    {

        if (sentidoIndicador[i] == 'CIMA')
        {
            if (metas[i] - valores[i] > 0)
            {
                barChartDataMeses.datasets[1].backgroundColor[i] = color(window.chartColors.red).rgbString();
            }
            else
            {
                barChartDataMeses.datasets[1].backgroundColor[i] = color(window.chartColors.green).rgbString();
            }
        }
        else
        {
            /*BAIXO*/
            if (metas[i] - valores[i] > 0)
            {
                barChartDataMeses.datasets[1].backgroundColor[i] = color(window.chartColors.green).rgbString();
            }
            else
            {
                barChartDataMeses.datasets[1].backgroundColor[i] = color(window.chartColors.red).rgbString();
            }
        }
    }

    return barChartDataMeses;
}
/*Fim dos graficos de Meses do grafico 2*/

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


<div class="col-md-6">
    <!--Box Grafico de Despesas-->
<div class="box">
    <div class="box-header with-border">
    <h3 class="box-title">Indicador Mensal - Despesas {{fullYear}}</h3>
<div class="btn-group pull-right">
    <select ng-change="hasChangedYear(selectYears.value)" ng-model="selectYears.value" ng-options="y for y in selectYears.values"></select>
    </div>
    </div>
    <div class="box-body">
    <div class="chart">
    <canvas id="grafico-barras-mes-despesas" class="chartjs-render-monitor" style="height: 230px; width: 788px;" width="788" height="230"></canvas>
    </div>
    </div>
    </div>
    <!--Fim - Box Grafico de Despesas-->
    </div>