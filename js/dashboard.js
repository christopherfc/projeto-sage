document.addEventListener('DOMContentLoaded', () => {
    fetch('../api/dados.json')
        .then(response => response.json())
        .then(data => {
            // Saudação
            document.getElementById('welcome-message').textContent = `Olá, Seja bem vindo ${data.usuario.nome}!`;

            // Card de Frequência
            const freqCard = document.getElementById('frequency-card');
            freqCard.innerHTML = `
                <p>Média de Frequência</p>
                <h2>${data.metricasGerais.mediaFrequencia.toFixed(2).replace('.', ',')}%</h2>
                <span>Status: ${data.metricasGerais.mediaFrequencia >= 90 ? 'Excelente' : 'Bom'}</span>
            `;

            // Card de Média Geral
            const gradeCard = document.getElementById('grade-card');
            gradeCard.innerHTML = `
                <p>Média Geral</p>
                <h2>${data.metricasGerais.mediaGeral.toFixed(1).replace('.', ',')}</h2>
                <span>Status: ${data.metricasGerais.mediaGeral >= 8 ? 'Bom' : 'Atenção'}</span>
            `;

            // Relatório Semanal
            const reportList = document.getElementById('report-list');
            data.relatorioSemanal.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = `<span class="dot ${item.status}"></span> ${item.atividade}`;
                reportList.appendChild(li);
            });

// Lista de Disciplinas (AGORA COM LINKS)
            const subjectList = document.getElementById('subject-list');
            data.disciplinas.forEach(disciplina => {
                // Cria um elemento de link <a> em vez de <div>
                const link = document.createElement('a');
                link.className = 'subject-item'; // A mesma classe para manter o estilo
                link.textContent = disciplina.nome;
                // Define o destino do link para a nova página, passando o ID da disciplina na URL
                link.href = `disciplina-detalhe.html?id=${disciplina.id}`; 
                subjectList.appendChild(link);
            });
            
            // Aviso Importante
            document.getElementById('notices-message').textContent = data.avisoImportante.mensagem;
        })
        .catch(error => console.error('Erro ao carregar dados do dashboard:', error));
});