document.addEventListener('DOMContentLoaded', () => {
    // Pega o ID da disciplina da URL (ex: ?id=1)
    const urlParams = new URLSearchParams(window.location.search);
    const disciplinaId = parseInt(urlParams.get('id'));

    if (!disciplinaId) {
        document.getElementById('disciplina-titulo').textContent = "Disciplina não encontrada!";
        return;
    }

    fetch('api/dados.json')
        .then(response => response.json())
        .then(data => {
            const disciplina = data.disciplinas.find(d => d.id === disciplinaId);

            if (!disciplina) {
                document.getElementById('disciplina-titulo').textContent = "Disciplina não encontrada!";
                return;
            }

            // Popula o título da página
            document.getElementById('disciplina-titulo').textContent = disciplina.nome;

            // --- Popula os cards de NOTAS ---
            const media = (disciplina.notas.ab1 + disciplina.notas.ab2) / 2;
            document.getElementById('nota-ab1').innerHTML = `<p>Nota AB1</p><h2>${disciplina.notas.ab1.toFixed(1).replace('.',',')}</h2>`;
            document.getElementById('nota-ab2').innerHTML = `<p>Nota AB2</p><h2>${disciplina.notas.ab2.toFixed(1).replace('.',',')}</h2>`;
            document.getElementById('nota-media').innerHTML = `<p>Média Final</p><h2>${media.toFixed(1).replace('.',',')}</h2>`;

            // --- Popula os cards de FREQUÊNCIA ---
            const presencas = disciplina.frequencia.aulasMinistradas - disciplina.frequencia.faltas.length;
            const percentualFrequencia = disciplina.frequencia.aulasMinistradas > 0 ? (presencas / disciplina.frequencia.aulasMinistradas) * 100 : 100;
            document.getElementById('freq-percentual').innerHTML = `<p>Frequência</p><h2>${percentualFrequencia.toFixed(2).replace('.',',')}%</h2>`;
            document.getElementById('freq-aulas').innerHTML = `<p>Aulas Ministradas</p><h2>${disciplina.frequencia.aulasMinistradas}</h2>`;
            document.getElementById('freq-faltas').innerHTML = `<p>Faltas</p><h2>${disciplina.frequencia.faltas.length}</h2>`;

            // --- Popula a LISTA DE FALTAS ---
            const absencesList = document.getElementById('absences-details-list');
            absencesList.innerHTML = '';
            if (disciplina.frequencia.faltas.length > 0) {
                disciplina.frequencia.faltas.forEach(falta => {
                    const item = document.createElement('div');
                    item.className = 'absence-item';
                    item.innerHTML = `<span class="date">${falta.data}</span><span class="topic">${falta.assunto}</span>`;
                    absencesList.appendChild(item);
                });
            } else {
                absencesList.innerHTML = '<p style="text-align:center; color: #555;">Nenhuma falta registrada para esta disciplina.</p>';
            }
        })
        .catch(error => {
            console.error('Erro ao carregar detalhes da disciplina:', error);
            document.getElementById('disciplina-titulo').textContent = "Erro ao carregar dados.";
        });
});