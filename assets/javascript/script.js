$(document).ready(function() {
    var grafico_criado = false; //verifica se já existe um gráfico evitando criação desnecessária

    function carregarDados() {
        const dadosGramas = localStorage.getItem('gramas');
        const dadosMetaDiaria = localStorage.getItem('meta_diaria')

        if (dadosGramas) {
            gramas = JSON.parse(dadosGramas);
        }
        if (dadosMetaDiaria) {
            meta_diaria - JSON.parse(dadosMetaDiaria);
        }
    }

    function salvarDados() {
        localStorage.setItem('gramas'.JSON.stringify(gramas));
        localStorage.setItem('meta_diaria', JSON.stringify(meta_diaria));
    }

    carregarDados();

    $('#visualizacao').click(function() {
        somar_calorias(); // calcula calorias a partir dos macronutrientes

        //executado quando o ID visualização é clicado
        $('#adicionar-refeicao').show();
        $('#tabela-refeicoes').show();

        //verifica se o gráfico já foi criado, se não,
        if(!grafico_criado) {
            grafico_metas_diarias(); //chama o grafico
            grafico_criado = true; //passa a ser verdadeiro
        }
    });

    //executado quando o ID adicionar refeição é clicado
    $('#adicionar-refeicao').click(function() {
        adicionar_refeicao(); //adiciona uma nova refeiçã à tabela
        $('.input-alimento').val(''); //limpa os valores com campos com essa classe
    });

    //executado quando o ID confirmar meta é clicado
    $('#confirmar_meta').click(function() {
        confirmarMeta_diaria(); //define a meta diária
    });
});

// variaveis globais para armazenar informações dos valores de macronutrientes
var gramas = {}; //armazena a quantidade de gramas de cada alimento
var carboidratosPorGrama = { //objeto que mapeia o nome do alimento para a quantidade em 1 grama do alimento
    Arroz: 0.282,
    Feijão: 0.20,
    Pão: 0.50,
    Laranja: 0.1175,
    Carne: 0.00,
    Frango: 0.00,
    Ovos: 0.0072,
    Café: 0.00,
    Banana: 0.2284,
    Batata: 0.1758
};

var proteinasPorGrama = {
    Arroz: 0.027,
    Feijão: 0.09,
    Pão: 0.09,
    Laranja: 0.0094,
    Carne: 0.26,
    Frango: 0.31,
    Ovos: 0.13,
    Café: 0.00,
    Banana: 0.0109,
    Batata: 0.0202
};

var gordurasPorGrama = {
    Arroz: 0.003,
    Feijão: 0.005,
    Pão: 0.005,
    Laranja: 0.0012,
    Carne: 0.20,
    Frango: 0.036,
    Ovos: 0.10,
    Café: 0.00,
    Banana: 0.0033,
    Batata: 0.001
};

//variáveis globais para aramzenar informações sobre metas diárias e consumo diário
var meta_diaria = { //objeto que armazena a meta diária dos macronutrientes com valores inicializados com 0
    carboidratos: 0,
    proteinas: 0,
    gorduras: 0
};

var consumo_diario = []; //array para aramazenar o percentual de cumprimento de meta diária de cada macronutriente, vai ser preenchido a medida que o alimento é consumido
var grafico_linhas; //armazena o grafico para exibir o progresso do consumo diário em relação às metas

//grafico de metas diárias
function grafico_metas_diarias() {
    var ctx = document.getElementById('chart-container').getContext('2d');
    grafico_linhas = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'],
            datasets: [
                {
                    label: 'Carboidratos',
                    data: [],
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: false,
                    borderWidth: 2
                },

                {
                    label: 'Proteínas',
                    data: [],
                    borderColor: 'rgba(153, 102, 255, 1)',
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    fill: false,
                    borderWidth: 2
                },

                {
                    label: 'Gorduras',
                    data: [],
                    borderColor: 'rgba(255, 159, 64, 0.2)',
                    backgroundColor: 'rgba(255, 159, 64, 0.2)',
                    fill: false,
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                text: 'Meta Diária em %',
                font: {
                    size: 16,
                    weight: 'bold'
                },
                padding: {
                    bottom: 20
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Dia da Semana'
                    },
                    ticks: {
                        font: {
                            size: 14
                        }
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Porcentagem (%)'
                    },
                    ticks: {
                        min: 0,
                        max: 100,
                        stepSize: 10,
                        font: {
                            size: 14
                        }
                    }
                }
            }
        }
    });
}

//função para atualizar as metas diárias de macronutrientes com os valores dadso pelo usuário
function confirmarMeta_diaria() {
    meta_diaria.carboidratos = parseFloat($('#meta_carboidratos').val());
    meta_diaria.proteinas = parseFloat($('#meta_proteinas').val());
    meta_diaria.gorduras = parseFloat($('#meta_gorduras').val());

    if (!isNaN(meta_diaria.carboidratos) && meta_diaria.carboidratos > 0 &&
        !isNaN(meta_diaria.proteinas) && meta_diaria.proteinas > 0 &&
        !isNaN(meta_diaria.gorduras) && meta_diaria.gorduras > 0) {
            alert('Meta diária atualizada com sucesso!')
        } else {
            alert('Insira somente valores válidos, por favor!');
        }
}

//função para calcular as calorias e gerar os dois gráficos para comparação
function somar_calorias() {
    gramas = {
        Arroz: +$('#grama_arroz').val(),
        Feijão: +$('#grama_feijao').val(),
        Pão: +$('#grama_pao').val(),
        Laranja: +$('#grama_laranja').val(),
        Carne: +$('#grama_carneBovina').val(),
        Frango: +$('#grama_carneFrango').val(),
        Ovos: +$('#grama_ovos').val(),
        Café: +$('#grama_cafe').val(),
        Banana: +$('#grama_banana').val(),
        Batata: +$('#grama_batata').val()
    };

    var calorias_por_alimento = {}; //dicionario para armazenar as calorias totais de cada alimento
    for (var alimento in gramas) {
        var carboidratos = carboidratosPorGrama[alimento] * gramas[alimento];
        var proteinas = proteinasPorGrama[alimento] * gramas[alimento];
        var gorduras = gordurasPorGrama[alimento] * gramas[alimento];

        var calorias = (carboidratos * 4) + (proteinas * 4) + (gorduras * 9);
        calorias_por_alimento[alimento] = calorias;
    }

    var labels = Object.keys(calorias_por_alimento);
    var data = Object.values(calorias_por_alimento);

    new Chart($('.column-chart')[0].getContext('2d'), {
        type: 'bar',
        data: {
            labels: labels,
        datasets: [{
            label: 'Calorias por Alimento',
            data: data,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
        }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });

    gerar_graficospizza_individuais();

//gerar gráficos de pizza individuais
function gerar_graficospizza_individuais() {
    $('#graficos-pizza').empty(); //limpa os gráficos existentespara evitar duplicações

    for (var alimento in gramas) {
        var carboidratos = carboidratosPorGrama[alimento] * gramas[alimento];
        var proteinas = proteinasPorGrama[alimento] * gramas[alimento];
        var gorduras = gordurasPorGrama[alimento] * gramas[alimento];

        var calorias = (carboidratos * 4) + (proteinas * 4) + (gorduras * 9);
        calorias_por_alimento[alimento] = calorias;

        //cria um canvas para cada gráfico de pizza
        var canvasId = 'pizza-' + alimento;
        $('#graficos-pizza').append('<canvas id="' + canvasId + '" width="200px" height="200px"></canvas>');

        //dados para o gráfico de pizza
        var data = {
            labels: ['Carboidratos', 'Proteínas', 'Gorduras'],
            datasets: [{
                data: [carboidratos, proteinas, gorduras],
                backgroundColor: ['#ff6384', '#36a2eb', '#ffce56'],
            }]
        };

        //obter contexto do canvas corretamente
        var ctx = document.getElementById(canvasId).getContext('2d');

        //criar o gráfico de pizza
        new Chart(ctx, {
            type: 'pie',
            data: data,
            options: {
                responsive: true,
                title: {
                    display: true,
                    text: 'Distribuição de Calorias - ' + alimento
                }
            }
        });
    }
}
}

function adicionar_refeicao() {
    var total_carbo = 0, total_prot = 0, total_gord = 0;

    for (var alimento in gramas) {
        if (gramas[alimento] > 0) {
            total_carbo += carboidratosPorGrama[alimento] * gramas[alimento];
            total_prot += proteinasPorGrama[alimento] * gramas[alimento];
            total_gord += gordurasPorGrama[alimento] * gramas[alimento];
        }
    }

    var linhaVazia = $('#tabela-refeicoes tbody tr:has(td:empty)').first();
    if (linhaVazia.length > 0) {
        linhaVazia.find('td:eq(1)').text(total_carbo.toFixed(2));
        linhaVazia.find('td:eq(2)').text(total_prot.toFixed(2));
        linhaVazia.find('td:eq(3)').text(total_gord.toFixed(2));

        atualizar_grafico_metas_diarias();
    } else {
        alert('Todas as refeições para a semana já foram adicionadas com sucesso')
    }
}

function atualizar_grafico_metas_diarias() {
    var total_carbo = 0, total_prot = 0, total_gord = 0;

    for (var alimento in gramas) {
        total_carbo += carboidratosPorGrama[alimento] * grmas[alimento];
        total_prot += proteinasPorGrama[alimento] * gramas[alimento];
        total_gord += gordurasPorGrama[alimento] * gramas[alimento];
    }

    var porcentagemCarbo = Math.min((total_carbo / meta_diaria.carboidratos) * 100, 100);
    var porcentagemProt = Math.min((total_prot / meta_diaria.proteinas) * 100, 100);
    var porcentagemGord = Math.min((total_gord / meta_diaria.gorduras) * 100, 100);

    consumo_diario.push({
        carboidratos: porcentagemCarbo,
        proteinas: porcentagemProt,
        gorduras: porcentagemGord
    });

    var contDias = consumo_diario - 1;
    if (contDias < 5) {
        grafico_linhas.data.datasets[0].data.push(porcentagemCarbo);
        grafico_linhas.data.datasets[1].data.push(porcentagemProt);
        grafico_linhas.data.datasets[2].data.push(porcentagemGord);
        grafico_linhas.update();
    }
}