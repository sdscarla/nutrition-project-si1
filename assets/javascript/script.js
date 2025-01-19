$(document).ready(function() {
    var grafico_criado = false; //verifica se já existe um gráfico evitando criação desnecessária

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
        salvarMetaDiaria();
        exibirHistorico();
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


function grafico_metas_diarias() {
    grafico_linhas = Highcharts.chart('chart-container-tabela', {
        chart: { type: 'line' },
        title: { text: 'Meta Diária em %' },
        xAxis: {
            categories: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'],
            title: { text: 'Dias da semana'}
        },
        yAxis: {
            title: { text: 'Porcentagem (%)'},
            max: 100,
            min: 0
        },
        series: [
            { name: 'Carboidratos', data: []},
            { name: 'Proteínas', data: []},
            { name: 'Gorduras', data: []}
        ]
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

    Highcharts.chart('container-column', {
        chart: { type: 'column' },
        title: { text: 'Calorias Ingeeridas por Alimento'},
        xAxis: { categories: Object.keys(calorias_por_alimento) },
        yAxis: {
            min: 0,
            tiitle: { text: 'Calorias (kcal)' }
        },
        series: [{
            name: 'Calorias (kcal)',
            data: Object.values(calorias_por_alimento)
        }]
    });

    var container_pies = $('#container-pies');
    container_pies.empty();

    for(var alimento in gramas) {
        if (gramas[alimento] > 0) {
            var div = $('<div></div>').css({
                width: '23%', height: '300px', margin: '10px'
            });
            container_pies.append(div);

            Highcharts.chart(div[0], {
                chart: { type: 'pie' },
                title: { text: alimento },
                series: [{
                    name: 'Macronutrientes',
                    data: [
                        { name: 'Carboidratos', y: carboidratosPorGrama[alimento] * gramas[alimento] },
                        { name: 'Proteínas', y: proteinasPorGrama[alimento] * gramas[alimento] },
                        { name: 'Gorduras', y: gordurasPorGrama[alimento] * gramas[alimento] },
                    ]
                }]
            });
        }
    }
}

    function atualizar_grafico_metas_diarias() {
        var total_carbo = 0, total_prot = 0, total_gord = 0;

        for (var alimento in gramas) {
            total_carbo += carboidratosPorGrama[alimento] * gramas[alimento];
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

        var contDias = consumo_diario.length - 1;
        if (contDias < 5) {
            grafico_linhas.series[0].addPoint(porcentagemCarbo);
            grafico_linhas.series[1].addPoint(porcentagemProt);
            grafico_linhas.series[2].addPoint(porcentagemGord);
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

    function salvarMetaDiaria() {
        var dataAtual = new Date().toLocaleDateString();
        var meta_diaria = {
            data: dataAtual,
            carboidratos: $('#meta_carboidratos').val(),
            proteinas: $('#meta_proteinas').val(),
            gorduras: $('#meta_gorduras').val(),
        };
        
        if (meta_diaria.carboidratos && meta_diaria.proteinas && meta_diaria.gorduras) {
            var historico = JSON.parse(localStorage.getItem('historicoMetas')) || [];
            historico.push(meta_diaria);  // Adiciona as metas no histórico
            localStorage.setItem('historicoMetas', JSON.stringify(historico));

            alert('Meta diária salva com sucesso!');
        } else {
            alert('Por favor, insira valores válidos para a meta diária!')
        }

        $('#meta_carboidratos').val('');
        $('#meta_proteinas').val('');
        $('#meta_gorduras').val('');
    }

    function exibirHistorico() {
        var historico = JSON.parse(localStorage.getItem('historicoMetas')) || [];
        var tabelaHistorico = $('#tabela-historico');

        tabelaHistorico.empty();

        historico.forEach(function(meta) {
            tabelaHistorico.append(
                '<tr>' +
                    '<td>' + meta.data + '</td>' +
                    '<td>' + meta.carboidratos + '</td>' +
                    '<td>' + meta.proteinas + '</td>' +
                    '<td>' + meta.gorduras + '</td>' +
                '</tr>'
            );
        });
    }

    $(document).ready(function() {
        exibirHistorico();
    });

