const API_URL_DOCUMENTOS = "http://127.0.0.1:5000/api/documentos";
const API_URL_SOLICITACOES = "http://127.0.0.1:5000/api/solicitacoes";

window.solicitacoesGlobais = [];
window.documentosGlobais = [];
window.documentoEditandoId = null;

// ==========================================
// INICIALIZAÇÃO DO SISTEMA
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    aplicarControleDeAcesso();

    if (document.getElementById("tabela-solicitacoes")) {
        carregarSolicitacoes();
        carregarEstatisticasDashboard();
    }

    if (document.getElementById("tabela-documentos")) listarDocumentos();
    if (document.getElementById("tabela-auditoria")) carregarFilaAuditoria();

    carregarMateriais();
    carregarDropdownMateriais();
    configurarFiltrosTabela();
    configurarEnvioSolicitacao();
});

// ==========================================
// CONTROLE DE ACESSO (RBAC)
// ==========================================
function aplicarControleDeAcesso() {
    const nome = sessionStorage.getItem('usuarioNome');
    const perfil = sessionStorage.getItem('usuarioPerfil');

    if (!nome || !perfil) {
        window.location.href = 'login.html';
        return;
    }

    const nameDisplay = document.getElementById('user-name-display');
    const roleDisplay = document.getElementById('user-role-display');

    if (nameDisplay) nameDisplay.textContent = nome;
    if (roleDisplay) roleDisplay.textContent = perfil === 'medico' ? 'Médico Cirurgião' : 'Auditor Chefe';

    const menuAuditoria = document.getElementById('menu-auditoria');
    const btnNovaSolicitacao = document.getElementById('btn-nova-solicitacao');

    if (perfil === 'medico' && menuAuditoria) {
        menuAuditoria.style.display = 'none';
    } else if (perfil === 'auditor' && btnNovaSolicitacao) {
        btnNovaSolicitacao.style.display = 'none';
    }

    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', async (e) => {
            e.preventDefault();
            sessionStorage.clear();
            try { await fetch('http://127.0.0.1:5000/api/logout', { method: 'POST' }); } catch (err) { }
            window.location.href = 'login.html';
        });
    }
}

// ==========================================
// GESTÃO DE SOLICITAÇÕES
// ==========================================
function configurarFiltrosTabela() {
    const tabs = document.querySelectorAll('.filter-tabs .tab');
    if (tabs.length === 0) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const filtro = tab.textContent.trim().toLowerCase();
            let listaFiltrada = window.solicitacoesGlobais || [];

            if (filtro === 'pendentes') {
                listaFiltrada = window.solicitacoesGlobais.filter(s => s.status.toLowerCase().includes('auditoria') || s.status.toLowerCase().includes('pendente'));
            } else if (filtro === 'aprovados') {
                listaFiltrada = window.solicitacoesGlobais.filter(s => s.status.toLowerCase() === 'aprovado');
            }
            renderizarTabela(listaFiltrada);
        });
    });
}

function configurarEnvioSolicitacao() {
    const btnEnviar = document.getElementById("btn-enviar");
    if (!btnEnviar) return;

    btnEnviar.addEventListener("click", async () => {
        const nomesMateriais = document.querySelectorAll('[name="nome_material[]"]');
        const qtdsMateriais = document.querySelectorAll('input[name="quantidade_material[]"]');

        let temMaterialValido = false;
        nomesMateriais.forEach(campo => {
            if (campo.value.trim() !== '') temMaterialValido = true;
        });

        if (!temMaterialValido) {
            alert('Atenção: É necessário solicitar pelo menos um material OPME.');
            return;
        }

        const formData = new FormData();
        formData.append("nome_paciente", document.getElementById("nome_paciente")?.value || "");
        formData.append("registro_paciente", document.getElementById("registro_paciente")?.value || "");
        formData.append("convenio", document.getElementById("convenio")?.value || "");
        formData.append("medico_solicitante", document.getElementById("medico_solicitante")?.value || "");
        formData.append("crm", document.getElementById("crm")?.value || "");
        formData.append("procedimento", document.getElementById("procedimento")?.value || "");
        formData.append("data_agendada", document.getElementById("data_agendada")?.value || "");
        formData.append("justificativa", document.getElementById("justificativa")?.value || "");

        nomesMateriais.forEach((input, index) => {
            if (input.value.trim() !== '') {
                formData.append('nome_material[]', input.value.trim());
                formData.append('quantidade_material[]', qtdsMateriais[index].value);
            }
        });

        const inputArquivo = document.getElementById("input-arquivo-exame");
        if (inputArquivo && inputArquivo.files[0]) {
            formData.append("exame", inputArquivo.files[0]);
        }

        try {
            const response = await fetch(API_URL_SOLICITACOES, { method: "POST", body: formData });
            const resultado = await response.json();

            if (response.ok) {
                alert(resultado.mensagem + "\nID Gerado no Banco: " + resultado.id_solicitacao);
                window.location.href = "index.html";
            } else {
                alert("Atenção: " + resultado.erro);
            }
        } catch (erro) {
            console.error("Erro:", erro);
            alert("Erro ao conectar com o servidor.");
        }
    });
}

async function carregarSolicitacoes() {
    try {
        const response = await fetch(API_URL_SOLICITACOES);
        window.solicitacoesGlobais = await response.json();
        renderizarTabela(window.solicitacoesGlobais);
    } catch (erro) {
        console.error("Erro ao carregar solicitações:", erro);
    }
}

function renderizarTabela(lista) {
    const tabelaBody = document.getElementById("tabela-solicitacoes");
    if (!tabelaBody) return;
    tabelaBody.innerHTML = "";

    if (lista.length === 0) {
        tabelaBody.innerHTML = `
            <tr>
                <td colspan="7" class="table-empty-state">
                    <i class="fa-solid fa-box-open"></i><br>
                    <strong>Nenhuma solicitação encontrada</strong>
                    <p>Mude o filtro ou cadastre uma nova solicitação.</p>
                </td>
            </tr>
        `;
        return;
    }

    lista.forEach(solic => {
        let badgeClass = "pendente";
        if (solic.status === "Aprovado") badgeClass = "aprovado";
        if (solic.status === "Negado" || solic.status === "Reprovado") badgeClass = "negado";

        let botoesAcao = '';
        if (solic.status === "Aprovado" || solic.status === "Negado" || solic.status === "Reprovado") {
            botoesAcao = `
                <button onclick="abrirModalParecer(${solic.id_real})" class="btn-action" style="color: #3b82f6; font-size: 1.1em;" title="Ver Parecer do Auditor">
                    <i class="fa-solid fa-eye"></i>
                </button>
                <button onclick="apagarRegistro(${solic.id_real})" class="btn-action delete" title="Excluir"><i class="fa-solid fa-trash"></i></button>
            `;
        } else {
            botoesAcao = `
                <button onclick="alterarStatus(${solic.id_real}, 'Aprovado')" class="btn-action approve" title="Aprovar"><i class="fa-solid fa-check-circle"></i></button>
                <button onclick="alterarStatus(${solic.id_real}, 'Negado')" class="btn-action deny" title="Negar"><i class="fa-solid fa-circle-xmark"></i></button>
                <button onclick="apagarRegistro(${solic.id_real})" class="btn-action delete" title="Excluir"><i class="fa-solid fa-trash"></i></button>
            `;
        }

        tabelaBody.innerHTML += `
            <tr>
                <td class="font-bold text-dark-blue">${solic.id}</td>
                <td>
                    <div class="doctor-info">
                        <div class="doc-initials blue-bg">DR</div>
                        <span>${solic.medico}</span>
                    </div>
                </td>
                <td><strong>${solic.procedimento}</strong></td>
                <td><span class="status-badge ${badgeClass}">${solic.status.toUpperCase()}</span></td>
                <td>${solic.data}</td>
                <td class="font-bold">${solic.valor}</td>
                <td>${botoesAcao}</td>
            </tr>
        `;
    });
}

async function alterarStatus(id, novoStatus) {
    if (!confirm(`Mudar o status para ${novoStatus.toUpperCase()}?`)) return;
    await fetch(`${API_URL_SOLICITACOES}/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: novoStatus })
    });
    carregarSolicitacoes();
}

async function apagarRegistro(id) {
    if (!confirm("Tem certeza que deseja apagar esta solicitação? Esta ação é irreversível.")) return;
    await fetch(`${API_URL_SOLICITACOES}/${id}`, { method: "DELETE" });
    carregarSolicitacoes();
}

// ==========================================
// FILA DE AUDITORIA E INTELIGÊNCIA ARTIFICIAL
// ==========================================
async function carregarFilaAuditoria() {
    const tabelaBody = document.getElementById("tabela-auditoria");
    if (!tabelaBody) return;

    try {
        const response = await fetch(API_URL_SOLICITACOES + "/pendentes");
        const pendentes = await response.json();
        window.solicitacoesGlobais = pendentes;
        tabelaBody.innerHTML = "";

        if (pendentes.length === 0) {
            tabelaBody.innerHTML = `
                <tr>
                    <td colspan="4" class="table-empty-state">
                        <i class="fa-solid fa-check-double"></i><br>
                        <strong>Nenhuma pendência no momento</strong>
                        <p>A fila de auditoria está limpa.</p>
                    </td>
                </tr>
            `;
            return;
        }

        pendentes.forEach(solic => {
            tabelaBody.innerHTML += `
                <tr>
                    <td class="font-bold text-dark-blue">${solic.id}</td>
                    <td>${solic.paciente || "Não informado"}</td>
                    <td><strong>${solic.procedimento}</strong></td>
                    <td>
                        <button class="btn-outline" style="padding: 4px 8px; font-size: 12px;" onclick="selecionarParaAuditoria(${solic.id_real})">
                            <i class="fa-solid fa-hand-pointer"></i> Analisar
                        </button>
                    </td>
                </tr>
            `;
        });
    } catch (erro) {
        console.error("Erro ao carregar fila de auditoria:", erro);
    }
}

function selecionarParaAuditoria(idReal) {
    const inputId = document.getElementById("audit-id");
    const btnIA = document.getElementById("btn-analisar-ia");
    const feedbackIA = document.getElementById("ai-feedback");
    const cardDetalhes = document.getElementById("card-detalhes-auditoria");

    if (inputId) inputId.value = idReal;
    if (btnIA) btnIA.disabled = false;
    if (feedbackIA) feedbackIA.textContent = `Caso #${idReal} pronto para análise da IA. Clique em "Analisar Risco".`;

    const solic = window.solicitacoesGlobais.find(s => s.id_real === idReal);
    if (solic && cardDetalhes) {
        document.getElementById("detalhe-id").textContent = solic.id;
        document.getElementById("detalhe-paciente").textContent = solic.paciente || "Não informado";
        document.getElementById("detalhe-procedimento").textContent = solic.procedimento;
        document.getElementById("detalhe-justificativa").textContent = solic.justificativa || "Sem justificativa.";
        document.getElementById("detalhe-fornecedor").textContent = solic.fornecedor_vencedor || "Pendente";

        const valorFormatado = solic.valor_total ? parseFloat(solic.valor_total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : "R$ 0,00";
        document.getElementById("detalhe-valor").textContent = valorFormatado;

        let htmlMateriais = "Nenhum material registrado.";
        if (solic.materiais_solicitados && solic.materiais_solicitados !== 'None') {
            try {
                const listaMat = JSON.parse(solic.materiais_solicitados.replace(/'/g, '"'));
                htmlMateriais = "<ul style='padding-left: 20px; margin: 0;'>";
                listaMat.forEach(item => {
                    htmlMateriais += `<li><strong>${item.quantidade}x</strong> ${item.nome}</li>`;
                });
                htmlMateriais += "</ul>";
            } catch (e) {
                htmlMateriais = solic.materiais_solicitados;
            }
        }
        document.getElementById("detalhe-materiais").innerHTML = htmlMateriais;
        cardDetalhes.classList.remove("oculto");
    }
}

async function executarAnaliseIA() {
    const idReal = document.getElementById("audit-id")?.value;
    const feedbackIA = document.getElementById("ai-feedback");
    const btnIA = document.getElementById("btn-analisar-ia");

    if (!idReal) return alert("Selecione um caso na fila primeiro.");

    feedbackIA.textContent = "Processando análise clínica com IA...";
    btnIA.disabled = true;

    try {
        const response = await fetch(`${API_URL_SOLICITACOES}/${idReal}/analise-ia`);
        const dados = await response.json();

        if (response.ok) {
            feedbackIA.innerHTML = `<strong>[Status: ${dados.status} | Risco: ${dados.risco_fraude}]</strong><br><br>${dados.parecer_tecnico}`;
            const btnSalvar = document.createElement('button');
            btnSalvar.className = 'btn-fill mt-15';
            btnSalvar.style.width = '100%';
            btnSalvar.innerHTML = '<i class="fa-solid fa-check-double"></i> Aplicar Parecer no Sistema';
            btnSalvar.onclick = () => salvarParecerIA(idReal, dados.status, dados.parecer_tecnico);
            feedbackIA.appendChild(btnSalvar);
        } else {
            feedbackIA.textContent = "Não foi possível gerar a análise da IA.";
        }
    } catch (erro) {
        console.error("Erro na IA:", erro);
        feedbackIA.textContent = "Erro ao conectar com o serviço de IA.";
    } finally {
        btnIA.disabled = false;
    }
}

async function salvarParecerIA(idSolicitacao, statusIA, parecerIA) {
    const statusFormatado = statusIA === "APROVADO" ? "Aprovado" : "Negado";
    try {
        const response = await fetch(`http://127.0.0.1:5000/api/solicitacoes/${idSolicitacao}/parecer`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: statusFormatado, parecer: parecerIA })
        });

        if (response.ok) {
            alert(`Sucesso! A solicitação foi marcada como ${statusFormatado}.`);
            window.location.reload();
        } else {
            const erro = await response.json();
            alert(`Erro ao salvar: ${erro.erro || "Falha no servidor"}`);
        }
    } catch (erro) {
        console.error("Erro ao salvar parecer:", erro);
        alert("Erro de comunicação com o servidor.");
    }
}

async function enviarParecer(decisao) {
    const idReal = document.getElementById("audit-id")?.value || "";
    const parecer = document.getElementById("audit-parecer")?.value.trim() || "";

    if (!idReal) return alert("Selecione uma solicitação na fila.");
    if (!parecer) return alert("Digite uma justificativa técnica.");

    try {
        const response = await fetch(`${API_URL_SOLICITACOES}/${idReal}/parecer`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: decisao, parecer: parecer })
        });

        const resultado = await response.json();
        if (response.ok) {
            alert(resultado.mensagem);
            document.getElementById("audit-id").value = "";
            document.getElementById("audit-parecer").value = "";
            document.getElementById("btn-analisar-ia").disabled = true;
            document.getElementById("ai-feedback").textContent = "Selecione um caso na fila para análise inteligente.";
            carregarFilaAuditoria();
        } else {
            alert("Erro: " + resultado.erro);
        }
    } catch (erro) {
        console.error("Erro ao enviar parecer:", erro);
        alert("Erro de conexão ao enviar o parecer.");
    }
}

// ==========================================
// ESTATÍSTICAS E DASHBOARD (Chart.js)
// ==========================================
async function carregarEstatisticasDashboard() {
    try {
        const response = await fetch('http://127.0.0.1:5000/api/estatisticas');
        if (!response.ok) return;

        const dados = await response.json();

        const elPendentes = document.getElementById('kpi-pendentes');
        if (elPendentes) elPendentes.textContent = (dados.pendentes < 10 ? '0' : '') + dados.pendentes;

        const elConcluidas = document.getElementById('kpi-concluidas');
        if (elConcluidas) elConcluidas.textContent = ((dados.aprovadas || 0) + (dados.negadas || 0) < 10 ? '0' : '') + ((dados.aprovadas || 0) + (dados.negadas || 0));

        const elValor = document.getElementById('kpi-valor-aprovado');
        if (elValor && dados.valor_total) elValor.textContent = dados.valor_total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        const elUrgentes = document.getElementById('kpi-urgentes');
        if (elUrgentes) elUrgentes.textContent = (dados.urgentes < 10 ? '0' : '') + dados.urgentes;

        const elTempo = document.getElementById('kpi-tempo');
        if (elTempo) elTempo.innerHTML = `${dados.tempo_medio}<span>h</span>`;

        const ctx = document.getElementById('graficoGastos');
        if (ctx && dados.grafico) {
            let chartStatus = Chart.getChart("graficoGastos");
            if (chartStatus != undefined) chartStatus.destroy();

            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: dados.grafico.meses,
                    datasets: [
                        { label: 'Órteses', data: dados.grafico.orteses, backgroundColor: '#0ea5e9', borderRadius: { topLeft: 4, topRight: 4 } },
                        { label: 'Próteses', data: dados.grafico.proteses, backgroundColor: '#0369a1', borderRadius: { topLeft: 4, topRight: 4 } }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { stacked: true, grid: { display: false } },
                        y: { stacked: true, beginAtZero: true, border: { display: false }, grid: { color: '#e2e8f0', drawTicks: false } }
                    }
                }
            });
        }
    } catch (erro) {
        console.error("Erro ao carregar estatísticas do Dashboard:", erro);
    }
}

// ==========================================
// GESTÃO DE DOCUMENTOS
// ==========================================
function listarDocumentos() {
    fetch(API_URL_DOCUMENTOS)
        .then(resposta => resposta.json())
        .then(documentos => {
            window.documentosGlobais = documentos;
            const tabela = document.querySelector("#tabela-documentos");
            if (!tabela) return;

            tabela.innerHTML = "";
            documentos.forEach(doc => {
                tabela.innerHTML += `
                    <tr>
                        <td>${doc.id}</td>
                        <td>${doc.nome}</td>
                        <td>${doc.categoria}</td>
                        <td>${doc.status || "Ativo"}</td>
                        <td>
                            <button class="btn-action approve" onclick="prepararEdicao(${doc.id})" title="Editar"><i class="fa-solid fa-pen"></i></button>
                            <button class="btn-action delete" onclick="excluirDocumento(${doc.id})" title="Excluir"><i class="fa-solid fa-trash"></i></button>
                        </td>
                    </tr>
                `;
            });
        });
}

function prepararEdicao(id) {
    const doc = window.documentosGlobais.find(d => d.id === id);
    if (!doc) return;

    document.querySelector("#nome").value = doc.nome;
    document.querySelector("#categoria").value = doc.categoria;
    document.querySelector("#descricao").value = doc.descricao || "";
    document.querySelector("#validade").value = doc.validade || "";
    document.querySelector("#status").value = doc.status || "Ativo";

    window.documentoEditandoId = id;
    const btn = document.querySelector("#botao-salvar");
    btn.innerHTML = '<i class="fa-solid fa-pen"></i> ATUALIZAR DOCUMENTO';
    btn.style.backgroundColor = "#f59e0b";
}

function salvarDocumento() {
    const documento = {
        nome: document.querySelector("#nome").value,
        categoria: document.querySelector("#categoria").value,
        descricao: document.querySelector("#descricao").value,
        validade: document.querySelector("#validade").value,
        status: document.querySelector("#status").value
    };

    const metodo = window.documentoEditandoId ? "PUT" : "POST";
    const url = window.documentoEditandoId ? `${API_URL_DOCUMENTOS}/${window.documentoEditandoId}` : API_URL_DOCUMENTOS;

    fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(documento)
    })
        .then(resposta => resposta.json())
        .then(() => {
            alert(window.documentoEditandoId ? "Documento atualizado!" : "Documento cadastrado!");
            listarDocumentos();

            document.querySelector("#nome").value = "";
            document.querySelector("#descricao").value = "";
            window.documentoEditandoId = null;
            const btn = document.querySelector("#botao-salvar");
            btn.innerHTML = '<i class="fa-solid fa-cloud-arrow-up"></i> SALVAR DOCUMENTO';
            btn.style.backgroundColor = "";
        });
}

function excluirDocumento(id) {
    if (confirm("Excluir este documento?")) {
        fetch(`${API_URL_DOCUMENTOS}/${id}`, { method: "DELETE" }).then(() => {
            alert("Documento excluído!");
            listarDocumentos();
        });
    }
}

// ==========================================
// CATÁLOGO DE MATERIAIS OPME
// ==========================================
function abrirModalMaterial() {
    document.getElementById('modal-material')?.classList.remove('oculto');
}

function fecharModalMaterial() {
    document.getElementById('modal-material')?.classList.add('oculto');
    document.getElementById('form-material')?.reset();
}

async function carregarMateriais() {
    const tabela = document.getElementById('tabela-materiais');
    if (!tabela) return;

    try {
        const response = await fetch("http://127.0.0.1:5000/api/materiais");
        const materiais = await response.json();

        let html = '';
        materiais.forEach(m => {
            const precoFormatado = m.preco_base.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            html += `
                <tr>
                    <td><strong>${m.codigo_anvisa}</strong></td>
                    <td>${m.nome}</td>
                    <td><span class="badge-categoria">${m.categoria}</span></td>
                    <td>${m.fabricante}</td>
                    <td>${precoFormatado}</td>
                    <td class="acoes-tabela">
                        <button class="btn-action delete" onclick="excluirMaterial(${m.id})" title="Excluir"><i class="fa-solid fa-trash"></i></button>
                    </td>
                </tr>
            `;
        });

        tabela.innerHTML = html || '<tr><td colspan="6" class="table-empty-state">Nenhum material cadastrado.</td></tr>';
    } catch (erro) {
        console.error("Erro ao carregar materiais:", erro);
    }
}

async function salvarMaterial(event) {
    event.preventDefault();
    const dados = {
        nome: document.getElementById('mat-nome').value,
        codigo_anvisa: document.getElementById('mat-anvisa').value,
        categoria: document.getElementById('mat-categoria').value,
        fabricante: document.getElementById('mat-fabricante').value,
        preco_base: parseFloat(document.getElementById('mat-preco').value)
    };

    try {
        const response = await fetch("http://127.0.0.1:5000/api/materiais", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        });

        if (response.ok) {
            fecharModalMaterial();
            carregarMateriais();
        } else {
            alert("Erro! O código ANVISA já existe ou ocorreu uma falha.");
        }
    } catch (erro) {
        console.error("Erro ao salvar material:", erro);
    }
}

async function buscarDadosMercado(event) {
    const nomeInput = document.getElementById('mat-nome').value;
    if (!nomeInput || nomeInput.length < 3) return alert("Digite o nome (mínimo 3 letras).");

    const btn = event.currentTarget;
    const textoOriginal = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Consultando...';
    btn.disabled = true;

    try {
        const response = await fetch("http://127.0.0.1:5000/api/materiais/cotacao-automatica", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome: nomeInput })
        });
        const dados = await response.json();

        if (response.ok) {
            document.getElementById('mat-anvisa').value = dados.codigo_anvisa;
            document.getElementById('mat-categoria').value = dados.categoria;
            document.getElementById('mat-fabricante').value = dados.fabricante_vencedor;
            document.getElementById('mat-preco').value = dados.menor_preco;
        } else {
            alert("Erro ao consultar o mercado.");
        }
    } catch (erro) {
        console.error("Erro:", erro);
        alert("Falha de conexão com os servidores de cotação.");
    } finally {
        btn.innerHTML = textoOriginal;
        btn.disabled = false;
    }
}

async function excluirMaterial(id) {
    if (!confirm("Remover este material do catálogo?")) return;
    try {
        const response = await fetch(`http://127.0.0.1:5000/api/materiais/${id}`, { method: 'DELETE' });
        if (response.ok) carregarMateriais();
    } catch (erro) {
        console.error("Erro na exclusão:", erro);
    }
}

async function carregarDropdownMateriais() {
    const selectMaterial = document.getElementById('sol-materiais');
    if (!selectMaterial) return;

    try {
        const response = await fetch("http://127.0.0.1:5000/api/materiais");
        const materiais = await response.json();

        selectMaterial.innerHTML = '<option value="">Selecione um material aprovado...</option>';
        materiais.forEach(m => {
            const precoTeto = m.preco_base.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            const option = document.createElement('option');
            option.value = `${m.nome} (Ref: ${m.codigo_anvisa})`;
            option.text = `[${m.categoria}] ${m.nome} - Teto: ${precoTeto}`;
            selectMaterial.appendChild(option);
        });
    } catch (erro) {
        console.error("Erro ao carregar o catálogo:", erro);
        selectMaterial.innerHTML = '<option value="">Erro de comunicação</option>';
    }
}

function adicionarMaterial() {
    const lista = document.getElementById('lista-materiais');
    const primeiraLinha = lista.querySelector('.linha-material');
    const novaLinha = primeiraLinha.cloneNode(true);

    const select = novaLinha.querySelector('select');
    if (select) select.value = '';

    const quantidade = novaLinha.querySelector('input[type="number"]');
    if (quantidade) quantidade.value = '1';

    lista.appendChild(novaLinha);
}

function removerMaterial(botao) {
    const lista = document.getElementById('lista-materiais');
    const linhas = lista.querySelectorAll('.linha-material');
    if (linhas.length > 1) {
        botao.closest('.linha-material').remove();
    } else {
        alert("A solicitação precisa de pelo menos um material OPME listado.");
    }
}

// ==========================================
// UTILITÁRIOS E MODAIS GERAIS
// ==========================================
function abrirModalParecer(idReal) {
    const solic = window.solicitacoesGlobais.find(s => s.id_real === idReal);
    if (!solic) return;

    document.getElementById('modal-paciente').textContent = solic.paciente || "Não informado";
    document.getElementById('modal-procedimento').textContent = solic.procedimento;
    document.getElementById('modal-status').textContent = solic.status;
    document.getElementById('modal-justificativa').textContent = solic.justificativa && solic.justificativa !== "null" ? solic.justificativa : "Nenhum comentário técnico registrado.";
    document.getElementById('modal-detalhes').style.display = 'flex';
}

function fecharModalParecer() {
    const modal = document.getElementById('modal-detalhes');
    if (modal) modal.style.display = 'none';
}

window.addEventListener('click', function (event) {
    const modal = document.getElementById('modal-detalhes');
    if (event.target === modal) modal.style.display = 'none';
});

function mostrarNomeArquivo(input) {
    const container = document.getElementById('container-arquivo-selecionado');
    const pNome = document.getElementById('nome-arquivo-selecionado');

    if (input.files && input.files[0]) {
        pNome.textContent = input.files[0].name;
        container.style.display = 'flex';
    } else {
        removerArquivoAnexado();
    }
}

function removerArquivoAnexado(event) {
    if (event) event.stopPropagation();
    const inputArquivo = document.getElementById('input-arquivo-exame');
    const container = document.getElementById('container-arquivo-selecionado');
    if (inputArquivo) inputArquivo.value = "";
    if (container) container.style.display = 'none';
}

// ==========================================
// EXPORTAÇÃO PDF
// ==========================================
function gerarLaudoPDF() {
    const paciente = document.getElementById('modal-paciente') ? document.getElementById('modal-paciente').textContent : 'Paciente não informado';
    const medico = document.getElementById('modal-medico') ? document.getElementById('modal-medico').textContent : 'Médico não informado';
    const procedimento = document.getElementById('modal-procedimento') ? document.getElementById('modal-procedimento').textContent : 'Procedimento não informado';
    const status = document.getElementById('modal-status') ? document.getElementById('modal-status').textContent : 'EM ANÁLISE';
    const justificativa = document.getElementById('modal-justificativa') ? document.getElementById('modal-justificativa').textContent : 'Nenhuma justificativa registada.';

    document.getElementById('pdf-data-emissao').textContent = new Date().toLocaleDateString('pt-PT') + ' às ' + new Date().toLocaleTimeString('pt-PT');
    document.getElementById('pdf-auditor-nome').textContent = sessionStorage.getItem('usuarioNome') || "Auditor Chefe";
    document.getElementById('pdf-paciente').textContent = paciente;
    document.getElementById('pdf-medico').textContent = medico;
    document.getElementById('pdf-procedimento').textContent = procedimento;
    document.getElementById('pdf-status').textContent = status;
    document.getElementById('pdf-justificativa').textContent = justificativa;

    const molde = document.getElementById('template-laudo-pdf');
    molde.style.display = 'block';

    const btnPdf = document.querySelector('button[onclick="gerarLaudoPDF()"]');
    const textoOriginal = btnPdf.innerHTML;
    btnPdf.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Gerando...';

    const nomeFicheiro = `Laudo_Auditoria_${paciente.replace(/\s+/g, '_')}.pdf`;
    const opcoes = {
        margin: 15,
        filename: nomeFicheiro,
        image: { type: 'jpeg', quality: 1.0 },
        html2canvas: { scale: 2, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opcoes).from(molde).save().then(() => {
        molde.style.display = 'none';
        btnPdf.innerHTML = textoOriginal;
    });
}