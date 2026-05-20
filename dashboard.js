// dashboard.js
document.addEventListener('DOMContentLoaded', () => {
    // --- State & Config ---
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
    let dashboardCards = JSON.parse(localStorage.getItem('github_dashboard_cards')) || [];

    // --- DOM Elements ---
    const datetimeDisplay = document.getElementById('datetime-display');
    const dashboardGrid = document.getElementById('dashboard-grid');
    const addCardBtn = document.getElementById('add-card-btn');
    const modal = document.getElementById('add-card-modal');
    const closeBtn = document.getElementById('close-modal-btn');
    const cancelBtn = document.getElementById('cancel-card-btn');
    const saveBtn = document.getElementById('save-card-btn');
    const cardTypeSelect = document.getElementById('card-type');
    const dynamicFieldsContainer = document.getElementById('dynamic-fields');

    // --- Initialize ---
    updateDateTime();
    setInterval(updateDateTime, 1000);
    renderDashboard();
    initSortable();

    // --- Event Listeners ---
    addCardBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    cardTypeSelect.addEventListener('change', (e) => {
        renderDynamicFields(e.target.value);
        validateForm();
    });

    saveBtn.addEventListener('click', addCard);

    // --- Functions ---
    function updateDateTime() {
        const now = new Date();
        const options = { 
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        };
        datetimeDisplay.textContent = now.toLocaleDateString('pt-BR', options);
    }

    function initSortable() {
        new Sortable(dashboardGrid, {
            animation: 150,
            ghostClass: 'dashboard-card-ghost',
            handle: '.card-header', // Só arrasta pelo header para não bugar texto
            onEnd: function (evt) {
                const newIndex = evt.newIndex;
                const oldIndex = evt.oldIndex;
                
                const movedItem = dashboardCards.splice(oldIndex, 1)[0];
                dashboardCards.splice(newIndex, 0, movedItem);
                saveState();
            },
        });
    }

    function saveState() {
        localStorage.setItem('github_dashboard_cards', JSON.stringify(dashboardCards));
    }

    function openModal() {
        modal.classList.remove('hidden');
        cardTypeSelect.value = '';
        dynamicFieldsContainer.innerHTML = '';
        dynamicFieldsContainer.classList.add('hidden');
        validateForm();
    }

    function closeModal() {
        modal.classList.add('hidden');
    }

    function renderDynamicFields(type) {
        dynamicFieldsContainer.innerHTML = '';
        dynamicFieldsContainer.classList.remove('hidden');

        let html = '';
        if (['user_info', 'user_followers'].includes(type)) {
            html = `
                <label for="input-username">Nome de Usuário do GitHub</label>
                <input type="text" id="input-username" placeholder="Ex: torvalds" required autocomplete="off">
            `;
        } else if (['repo_commits', 'repo_issues', 'repo_prs', 'repo_releases', 'repo_contributors', 'repo_stats'].includes(type)) {
            html = `
                <label for="input-repo">Repositório (dono/nome)</label>
                <input type="text" id="input-repo" placeholder="Ex: facebook/react" required autocomplete="off">
            `;
        }

        dynamicFieldsContainer.innerHTML = html;
        const inputField = dynamicFieldsContainer.querySelector('input');
        if (inputField) {
            inputField.addEventListener('input', validateForm);
            inputField.focus();
            
            // Adicionar com ENTER
            inputField.addEventListener('keypress', function (e) {
                if (e.key === 'Enter' && !saveBtn.disabled) {
                    addCard();
                }
            });
        }
    }

    function validateForm() {
        const type = cardTypeSelect.value;
        if (!type) {
            saveBtn.disabled = true;
            return;
        }
        const inputField = dynamicFieldsContainer.querySelector('input');
        if (inputField && inputField.value.trim() !== '') {
            saveBtn.disabled = false;
        } else {
            saveBtn.disabled = true;
        }
    }

    function addCard() {
        const type = cardTypeSelect.value;
        const inputField = dynamicFieldsContainer.querySelector('input');
        const param = inputField.value.trim();

        const newCard = {
            id: 'card_' + Date.now() + Math.random().toString(36).substr(2, 9),
            type: type,
            param: param,
            lastUpdated: null,
            data: null
        };

        dashboardCards.push(newCard);
        saveState();
        closeModal();
        renderCard(newCard);
        refreshCardData(newCard.id);
    }

    function removeCard(id) {
        dashboardCards = dashboardCards.filter(card => card.id !== id);
        saveState();
        const cardEl = document.getElementById(id);
        if (cardEl) cardEl.remove();
    }

    function renderDashboard() {
        dashboardGrid.innerHTML = '';
        dashboardCards.forEach(card => {
            renderCard(card);
            // Verifica cache
            if (!card.data || (Date.now() - card.lastUpdated > CACHE_DURATION)) {
                refreshCardData(card.id);
            } else {
                updateCardContent(card.id, card.data, false);
            }
        });
    }

    function renderCard(card) {
        const cardEl = document.createElement('div');
        cardEl.className = 'dashboard-card';
        cardEl.id = card.id;

        let title = '';
        let icon = '';
        if (card.type === 'user_info') { title = 'Perfil: ' + card.param; icon = 'ph-user'; }
        else if (card.type === 'user_followers') { title = 'Seguidores: ' + card.param; icon = 'ph-users'; }
        else if (card.type === 'repo_commits') { title = 'Commits: ' + card.param; icon = 'ph-git-commit'; }
        else if (card.type === 'repo_issues') { title = 'Issues: ' + card.param; icon = 'ph-warning-circle'; }
        else if (card.type === 'repo_prs') { title = 'PRs: ' + card.param; icon = 'ph-git-pull-request'; }
        else if (card.type === 'repo_releases') { title = 'Releases: ' + card.param; icon = 'ph-tag'; }
        else if (card.type === 'repo_contributors') { title = 'Colaboradores: ' + card.param; icon = 'ph-users-three'; }
        else if (card.type === 'repo_stats') { title = 'Atividade (Commits): ' + card.param; icon = 'ph-chart-line-up'; }

        // Gráficos podem ocupar mais espaço em telas maiores
        if (card.type === 'repo_stats' && window.innerWidth > 768) {
             cardEl.style.gridColumn = "span 2";
        }

        const dateStr = card.lastUpdated ? new Date(card.lastUpdated).toLocaleTimeString('pt-BR') : 'Nunca';

        cardEl.innerHTML = `
            <div class="card-header" style="cursor: grab;">
                <div class="card-title"><i class="ph ${icon}"></i> ${title}</div>
                <div class="card-actions">
                    <button class="icon-btn refresh-btn" title="Atualizar"><i class="ph ph-arrows-clockwise"></i></button>
                    <button class="icon-btn delete-btn" title="Remover"><i class="ph ph-trash"></i></button>
                </div>
            </div>
            <div class="card-body" id="body-${card.id}">
                ${card.data ? '' : '<div class="loading-spinner"><i class="ph ph-spinner-gap"></i></div>'}
            </div>
            <div class="card-footer">
                <span class="last-update-text">Atualizado: ${dateStr}</span>
            </div>
        `;

        dashboardGrid.appendChild(cardEl);

        cardEl.querySelector('.delete-btn').addEventListener('click', () => removeCard(card.id));
        cardEl.querySelector('.refresh-btn').addEventListener('click', () => refreshCardData(card.id));
    }

    async function refreshCardData(id) {
        const cardIndex = dashboardCards.findIndex(c => c.id === id);
        if (cardIndex === -1) return;
        const card = dashboardCards[cardIndex];

        const bodyEl = document.getElementById(`body-${id}`);
        
        bodyEl.innerHTML = '<div class="loading-spinner"><i class="ph ph-spinner-gap"></i></div>';

        try {
            let data = null;
            if (card.type === 'user_info') data = await fetchAPI(`users/${card.param}`);
            else if (card.type === 'user_followers') data = await fetchAPI(`users/${card.param}/followers?per_page=30`);
            else if (card.type === 'repo_commits') data = await fetchAPI(`repos/${card.param}/commits?per_page=30`);
            else if (card.type === 'repo_issues') data = await fetchAPI(`repos/${card.param}/issues?state=all&per_page=30`);
            else if (card.type === 'repo_prs') data = await fetchAPI(`repos/${card.param}/pulls?state=all&per_page=30`);
            else if (card.type === 'repo_releases') data = await fetchAPI(`repos/${card.param}/releases?per_page=30`);
            else if (card.type === 'repo_contributors') data = await fetchAPI(`repos/${card.param}/contributors?per_page=30`);
            else if (card.type === 'repo_stats') data = await fetchAPI(`repos/${card.param}/stats/participation`);

            dashboardCards[cardIndex].data = data;
            dashboardCards[cardIndex].lastUpdated = Date.now();
            saveState();

            updateCardContent(id, data, true);
        } catch (error) {
            let errorMsg = error.message;
            if(errorMsg.includes('403')) errorMsg = 'Limite de API excedido. Tente novamente mais tarde.';
            if(errorMsg.includes('404')) errorMsg = 'Recurso não encontrado. Verifique o nome.';
            bodyEl.innerHTML = `<div class="error-message"><i class="ph ph-warning"></i><br>${errorMsg}</div>`;
        }
    }

    async function fetchAPI(endpoint) {
        const response = await fetch(`https://api.github.com/${endpoint}`);
        if (!response.ok) {
            throw new Error(`${response.status} ${response.statusText}`);
        }
        // Retorna json apenas se não for 204 No Content (pode acontecer em stats)
        if(response.status === 204) return [];
        return await response.json();
    }

    function updateCardContent(id, data, updateTime = false) {
        const card = dashboardCards.find(c => c.id === id);
        if (!card) return;
        
        const cardEl = document.getElementById(id);
        const bodyEl = document.getElementById(`body-${id}`);
        
        if (updateTime && card.lastUpdated) {
            const footerText = cardEl.querySelector('.last-update-text');
            footerText.textContent = `Atualizado: ${new Date(card.lastUpdated).toLocaleTimeString('pt-BR')}`;
        }

        let html = '';

        if (!data || (Array.isArray(data) && data.length === 0) || (data.message === "Not Found")) {
            // Algumas rotas de stats retornam empty ou status 202
            if (card.type === 'repo_stats' && !data.all) {
                html = '<div class="empty-state"><i class="ph ph-chart-line-down"></i> Dados do gráfico ainda sendo processados pelo GitHub. Tente atualizar em alguns minutos.</div>';
            } else {
                html = '<div class="empty-state"><i class="ph ph-magnifying-glass"></i> Nenhum dado encontrado.</div>';
            }
            bodyEl.innerHTML = html;
            return;
        }

        switch (card.type) {
            case 'user_info':
                html = `
                    <div class="user-profile">
                        <img src="${data.avatar_url}" alt="${data.login}">
                        <div class="user-details">
                            <h3><a href="${data.html_url}" target="_blank">${data.name || data.login}</a></h3>
                            <p>${data.bio || 'Sem biografia disponível.'}</p>
                            <div class="user-stats">
                                <span title="Seguidores"><i class="ph ph-users"></i> ${data.followers}</span>
                                <span title="Repositórios Públicos"><i class="ph ph-book-bookmark"></i> ${data.public_repos}</span>
                            </div>
                        </div>
                    </div>
                `;
                break;
            case 'user_followers':
            case 'repo_contributors':
                html = '<div class="grid-cols-2">';
                data.forEach(user => {
                    html += `
                        <div class="follower-item">
                            <img src="${user.avatar_url}" alt="${user.login}">
                            <a href="${user.html_url}" target="_blank" title="${user.login}">${user.login}</a>
                        </div>
                    `;
                });
                html += '</div>';
                break;
            case 'repo_commits':
                data.forEach(item => {
                    const commit = item.commit;
                    html += `
                        <div class="list-item">
                            <div class="list-item-icon"><i class="ph ph-git-commit"></i></div>
                            <div class="list-item-content">
                                <h4><a href="${item.html_url}" target="_blank" title="${commit.message}">${commit.message.split('\n')[0]}</a></h4>
                                <p>${commit.author.name} em ${new Date(commit.author.date).toLocaleDateString('pt-BR')}</p>
                            </div>
                        </div>
                    `;
                });
                break;
            case 'repo_issues':
            case 'repo_prs':
                data.forEach(item => {
                    // Se for issues, ignorar pull requests (a API de issues do github retorna PRs tbm)
                    if (card.type === 'repo_issues' && item.pull_request) return;
                    
                    const isClosed = item.state === 'closed';
                    const isMerged = item.pull_request && item.pull_request.merged_at;
                    
                    let statusClass = 'status-open';
                    let statusText = 'Aberto';
                    if (isMerged) {
                        statusClass = 'status-merged';
                        statusText = 'Merged';
                    } else if (isClosed) {
                        statusClass = 'status-closed';
                        statusText = 'Fechado';
                    }

                    const icon = card.type === 'repo_issues' 
                        ? (isClosed ? 'ph-check-circle' : 'ph-warning-circle') 
                        : 'ph-git-pull-request';
                        
                    html += `
                        <div class="list-item">
                            <div class="list-item-icon"><i class="ph ${icon}"></i></div>
                            <div class="list-item-content">
                                <h4><a href="${item.html_url}" target="_blank" title="${item.title}">${item.title}</a> <span class="status-badge ${statusClass}">${statusText}</span></h4>
                                <p>#${item.number} por ${item.user.login}</p>
                            </div>
                        </div>
                    `;
                });
                break;
            case 'repo_releases':
                data.forEach(item => {
                    html += `
                        <div class="list-item">
                            <div class="list-item-icon"><i class="ph ph-tag"></i></div>
                            <div class="list-item-content">
                                <h4><a href="${item.html_url}" target="_blank">${item.name || item.tag_name}</a></h4>
                                <p>Publicado em ${new Date(item.published_at).toLocaleDateString('pt-BR')}</p>
                            </div>
                        </div>
                    `;
                });
                break;
            case 'repo_stats':
                if (data.all && data.all.length > 0) {
                    html = '<div class="chart-container"><canvas id="chart-' + id + '"></canvas></div>';
                    bodyEl.innerHTML = html;
                    
                    const ctx = document.getElementById('chart-' + id).getContext('2d');
                    
                    // Gradiente para o gráfico
                    const gradient = ctx.createLinearGradient(0, 0, 0, 250);
                    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.4)');
                    gradient.addColorStop(1, 'rgba(59, 130, 246, 0.0)');

                    new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: Array.from({length: 52}, (_, i) => `Sem. ${i+1}`),
                            datasets: [{
                                label: 'Commits (Últimas 52 semanas)',
                                data: data.all,
                                borderColor: '#3b82f6',
                                backgroundColor: gradient,
                                borderWidth: 2,
                                fill: true,
                                tension: 0.4,
                                pointRadius: 1,
                                pointHoverRadius: 5
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: { display: false },
                                tooltip: {
                                    mode: 'index',
                                    intersect: false,
                                    backgroundColor: 'rgba(9, 9, 11, 0.9)',
                                    titleColor: '#f8fafc',
                                    bodyColor: '#94a3b8',
                                    borderColor: 'rgba(255,255,255,0.1)',
                                    borderWidth: 1
                                }
                            },
                            scales: {
                                x: { display: false },
                                y: { 
                                    beginAtZero: true,
                                    grid: { color: 'rgba(255,255,255,0.05)' },
                                    ticks: { color: '#94a3b8' }
                                }
                            },
                            interaction: {
                                mode: 'nearest',
                                axis: 'x',
                                intersect: false
                            }
                        }
                    });
                    return; 
                } else {
                    html = '<div class="empty-state"><i class="ph ph-chart-line-down"></i> Sem dados de estatística.</div>';
                }
                break;
        }
        
        if(html === '') html = '<div class="empty-state"><i class="ph ph-magnifying-glass"></i> Nenhum dado encontrado.</div>';
        bodyEl.innerHTML = html;
    }
});
