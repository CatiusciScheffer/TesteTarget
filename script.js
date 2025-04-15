function renderTable(id, data) {
  const table = document.getElementById(id);
  const total = data.reduce((sum, d) => sum + d.valor, 0);
  
  table.innerHTML = `
    <thead><tr><th>Dia</th><th>Valor</th></tr></thead>
    <tbody>
      ${data
        .map(
          (d) => `
        <tr class="${d.valor === 0 ? 'table-secondary' : ''}">
          <td>${d.dia}</td>
          <td>R$ ${d.valor.toFixed(2)}</td>
        </tr>`
        )
        .join('')}
      <tr class="table-info fw-bold">
        <td>Total</td>
        <td>R$ ${total.toFixed(2)}</td>
      </tr>
    </tbody>`;
}

function parseXml(xmlStr) {
  const parser = new DOMParser();
  const xml = parser.parseFromString(xmlStr, 'application/xml');
  return [...xml.getElementsByTagName('row')].map((row) => ({
    dia: Number(row.querySelector('dia').textContent),
    valor: parseFloat(row.querySelector('valor').textContent),
  }));
}

function calcularEstatisticas(data, nome) {
  const valores = data.map(d => d.valor).filter(v => v > 0);
  const total = valores.reduce((sum, v) => sum + v, 0);
  const media = total / valores.length;
  const maximo = Math.max(...valores);
  const minimo = Math.min(...valores);
  const diasComFaturamento = valores.length;
  const diasSemFaturamento = data.length - diasComFaturamento;
  
  return {
    nome,
    data,
    total,
    media,
    maximo,
    minimo,
    diasComFaturamento,
    diasSemFaturamento
  };
}

function exibirEstatisticas(estatisticas) {
  const container = document.createElement('div');
  container.className = 'col-md-6';
  
  container.innerHTML = `
    <div class="card mb-4">
      <div class="card-header">
        <h4>Estatísticas - ${estatisticas.nome}</h4>
      </div>
      <div class="card-body">
        <ul class="list-group list-group-flush">
          <li class="list-group-item">Total: R$ ${estatisticas.total.toFixed(2)}</li>
          <li class="list-group-item">Média: R$ ${estatisticas.media.toFixed(2)}</li>
          <li class="list-group-item">Máximo: R$ ${estatisticas.maximo.toFixed(2)} (dia ${estatisticas.data.find(d => d.valor === estatisticas.maximo).dia})</li>
          <li class="list-group-item">Mínimo: R$ ${estatisticas.minimo.toFixed(2)} (dia ${estatisticas.data.find(d => d.valor === estatisticas.minimo).dia})</li>
          <li class="list-group-item">Dias com faturamento: ${estatisticas.diasComFaturamento}</li>
          <li class="list-group-item">Dias sem faturamento: ${estatisticas.diasSemFaturamento}</li>
        </ul>
      </div>
    </div>
  `;
  
  return container;
}

function criarGrafico(id, data, titulo) {
  const ctx = document.getElementById(id).getContext('2d');
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.map(d => d.dia),
      datasets: [{
        label: 'Valor por dia',
        data: data.map(d => d.valor),
        backgroundColor: data.map(d => d.valor === 0 ? 'rgba(200, 200, 200, 0.5)' : 'rgba(54, 162, 235, 0.5)'),
        borderColor: data.map(d => d.valor === 0 ? 'rgba(200, 200, 200, 1)' : 'rgba(54, 162, 235, 1)'),
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: titulo
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return 'R$ ' + context.raw.toFixed(2);
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return 'R$ ' + value.toFixed(2);
            }
          }
        }
      }
    }
  });
}

function criarGraficoComparacao(jsonData, xmlData) {
  const ctx = document.getElementById('comparacao-chart').getContext('2d');
  
  // Agrupar dados por dia para comparação
  const dias = Array.from({length: 30}, (_, i) => i + 1);
  
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: dias,
      datasets: [
        {
          label: 'JSON',
          data: dias.map(dia => {
            const item = jsonData.find(d => d.dia === dia);
            return item ? item.valor : 0;
          }),
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.1)',
          borderWidth: 2,
          tension: 0.1
        },
        {
          label: 'XML',
          data: dias.map(dia => {
            const item = xmlData.find(d => d.dia === dia);
            return item ? item.valor : 0;
          }),
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.1)',
          borderWidth: 2,
          tension: 0.1
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Comparação entre JSON e XML'
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return context.dataset.label + ': R$ ' + context.raw.toFixed(2);
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return 'R$ ' + value.toFixed(2);
            }
          }
        }
      }
    }
  });
}

// Carregar os dados
async function carregarDados() {
  const [jsonResp, xmlResp] = await Promise.all([
    fetch('dados.json'),
    fetch('dados1.xml'),
  ]);

  const dadosJson = await jsonResp.json();
  const dadosXmlStr = await xmlResp.text();
  const dadosXml = parseXml(dadosXmlStr);

  renderTable('json-table', dadosJson);
  renderTable('xml-table', dadosXml);
  
  // Calcular e exibir estatísticas
  const estatisticasJson = calcularEstatisticas(dadosJson, 'JSON');
  const estatisticasXml = calcularEstatisticas(dadosXml, 'XML');
  
  const estatisticasContainer = document.getElementById('estatisticas-container');
  estatisticasContainer.appendChild(exibirEstatisticas(estatisticasJson));
  estatisticasContainer.appendChild(exibirEstatisticas(estatisticasXml));
  
  // Criar gráficos
  criarGrafico('json-chart', dadosJson, 'Dados JSON - Valores por dia');
  criarGrafico('xml-chart', dadosXml, 'Dados XML - Valores por dia');
  criarGraficoComparacao(dadosJson, dadosXml);
}

carregarDados();

