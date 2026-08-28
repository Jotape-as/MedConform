const API_URL_DOCUMENTOS = "http://127.0.0.1:5000/api/documentos";
const API_URL_SOLICITACOES = "http://127.0.0.1:5000/api/solicitacoes";

document.addEventListener("DOMContentLoaded", () => {
    // 1. Carrega as tabelas e estatísticas se estiver nas páginas correspondentes
    const tabelaBody = document.getElementById("tabela-solicitacoes");
    if (tabelaBody) {
        carregarSolicitacoes();
        carregarEstatisticas(); 
    }

    const tabelaDocs = document.getElementById("tabela-documentos");
    if (tabelaDocs) listarDocumentos();

    // ========================================================
    // NOVO: Lógica das Tabs da Tabela (Filtros)
    // ========================================================
    const tabs = document.querySelectorAll('.filter-tabs .tab');
    if (tabs.length > 0) { // Só executa se estiver na tela que tem as abas
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove a classe active de todas e põe na clicada
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Filtra a lista com base no botão clicado
                const filtro = tab.textContent.trim().toLowerCase();
                let listaFiltrada = window.solicitacoesGlobais || [];
                
                if (filtro === 'pendentes') {
                    listaFiltrada = window.solicitacoesGlobais.filter(s => s.status.toLowerCase().includes('auditoria') || s.status.toLowerCase().includes('pendente'));
                } else if (filtro === 'aprovados') {
                    listaFiltrada = window.solicitacoesGlobais.filter(s => s.status.toLowerCase() === 'aprovado');
                }
                
                renderizarTabela(listaFiltrada); // Redesenha a tabela
            });
        });
    }
    // ========================================================

    // 2. Lógica do Botão de Enviar Solicitação
    const btnEnviar = document.getElementById("btn-enviar");
    if (btnEnviar) {
        btnEnviar.addEventListener("click", async () => {
            const dados = {
                nome_paciente: document.getElementById("nome_paciente")?.value || "",
                registro_paciente: document.getElementById("registro_paciente")?.value || "",
                convenio: document.getElementById("convenio")?.value || "",
                medico_solicitante: document.getElementById("medico_solicitante")?.value || "",
                crm: document.getElementById("crm")?.value || "",
                procedimento: document.getElementById("procedimento")?.value || "",
                data_agendada: document.getElementById("data_agendada")?.value || "",
                justificativa: document.getElementById("justificativa")?.value || ""
            };

            try {
                const response = await fetch(API_URL_SOLICITACOES, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(dados)
                });

                const resultado = await response.json();

                if (response.ok) {
                    alert(resultado.mensagem + "\nID Gerado no Banco: " + resultado.id_solicitacao);
                    window.location.href = "index.html";
                } else {
                    alert("Atenção: " + resultado.erro);
                }
            } catch (erro) {
                console.error("Erro:", erro);
                alert("Erro ao conectar com o servidor. O Flask está rodando?");
            }
        });
    }
});
// ==========================================
// FUNÇÕES DE SOLICITAÇÕES
// ==========================================
async function carregarSolicitacoes() {
    try {
        const response = await fetch(API_URL_SOLICITACOES);
        const solicitacoes = await response.json();
        const tabelaBody = document.getElementById("tabela-solicitacoes");
        tabelaBody.innerHTML = "";

        if (solicitacoes.length === 0) {
            tabelaBody.innerHTML = `
                <tr>
                    <td colspan="7" class="table-empty-state">
                        <i class="fa-solid fa-box-open"></i>
                        <br>
                        <strong>Nenhuma solicitação encontrada</strong>
                        <p>As novas solicitações aparecerão aqui.</p>
                    </td>
                </tr>
            `;
            return;
        }

        solicitacoes.forEach(solic => {
            let badgeClass = "pendente";
            if (solic.status === "Aprovado") badgeClass = "aprovado";
            if (solic.status === "Negado") badgeClass = "negado";

            tabelaBody.innerHTML += `
                <tr>
                    <td class="font-bold text-dark-blue">${solic.id}</td>
                    <td>
                        <div class="doctor-info">
                            <div class="doc-initials blue-bg">DR</div>
                            <span>${solic.medico}</span>
                        </div>
                    </td>
                    <td>
                        <strong>${solic.procedimento}</strong>
                    </td>
                    <td><span class="status-badge ${badgeClass}">${solic.status.toUpperCase()}</span></td>
                    <td>${solic.data}</td>
                    <td class="font-bold">${solic.valor}</td>
                    <td>
                        <button onclick="alterarStatus(${solic.id_real}, 'Aprovado')" class="btn-action approve" title="Aprovar"><i class="fa-solid fa-check-circle"></i></button>
                        <button onclick="alterarStatus(${solic.id_real}, 'Negado')" class="btn-action deny" title="Negar"><i class="fa-solid fa-circle-xmark"></i></button>
                        <button onclick="apagarRegistro(${solic.id_real})" class="btn-action delete" title="Excluir"><i class="fa-solid fa-trash"></i></button>
                    </td>
                </tr>
            `;
        });
    } catch (erro) {
        console.error("Erro ao carregar solicitações:", erro);
    }
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

// Variável global para guardar as solicitações na memória
window.solicitacoesGlobais = [];

async function carregarSolicitacoes() {
    try {
        const response = await fetch(API_URL_SOLICITACOES);
        window.solicitacoesGlobais = await response.json();
        renderizarTabela(window.solicitacoesGlobais); // Chama a função que desenha a tabela
    } catch (erro) {
        console.error("Erro ao carregar solicitações:", erro);
    }
}

// Função separada apenas para desenhar as linhas (facilita o filtro)
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
        if(solic.status === "Aprovado") badgeClass = "aprovado"; 
        if(solic.status === "Negado") badgeClass = "negado"; 

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
                <td>
                    <button onclick="alterarStatus(${solic.id_real}, 'Aprovado')" class="btn-action approve" title="Aprovar"><i class="fa-solid fa-check-circle"></i></button>
                    <button onclick="alterarStatus(${solic.id_real}, 'Negado')" class="btn-action deny" title="Negar"><i class="fa-solid fa-circle-xmark"></i></button>
                    <button onclick="apagarRegistro(${solic.id_real})" class="btn-action delete" title="Excluir"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>
        `;
    });
}

// ==========================================
// FUNÇÕES DE DOCUMENTOS
// ==========================================
// Variável global para guardar os documentos na memória
window.documentosGlobais = [];
window.documentoEditandoId = null;

function listarDocumentos() {
    fetch(API_URL_DOCUMENTOS)
        .then(resposta => resposta.json())
        .then(documentos => {
            window.documentosGlobais = documentos; // Salva na memória
            const tabela = document.querySelector("#tabela-documentos");
            if (!tabela) return; 

            tabela.innerHTML = "";
            documentos.forEach(documento => {
                tabela.innerHTML += `
                    <tr>
                        <td>${documento.id}</td>
                        <td>${documento.nome}</td>
                        <td>${documento.categoria}</td>
                        <td>${documento.status || "Ativo"}</td>
                        <td>
                            <button class="btn-action approve" onclick="prepararEdicao(${documento.id})" title="Editar"><i class="fa-solid fa-pen"></i></button>
                            <button class="btn-action delete" onclick="excluirDocumento(${documento.id})" title="Excluir"><i class="fa-solid fa-trash"></i></button>
                        </td>
                    </tr>
                `;
            });
        });
}

function prepararEdicao(id) {
    // Acha o documento na memória
    const doc = window.documentosGlobais.find(d => d.id === id);
    if (!doc) return;

    // Preenche o formulário
    document.querySelector("#nome").value = doc.nome;
    document.querySelector("#categoria").value = doc.categoria;
    document.querySelector("#descricao").value = doc.descricao || "";
    document.querySelector("#validade").value = doc.validade || "";
    document.querySelector("#status").value = doc.status || "Ativo";

    // Muda o comportamento do botão
    window.documentoEditandoId = id;
    const btn = document.querySelector("#botao-salvar");
    btn.innerHTML = '<i class="fa-solid fa-pen"></i> ATUALIZAR DOCUMENTO';
    btn.style.backgroundColor = "#f59e0b"; // Fica laranja para chamar atenção
}

function salvarDocumento() {
    const documento = {
        nome: document.querySelector("#nome").value,
        categoria: document.querySelector("#categoria").value,
        descricao: document.querySelector("#descricao").value,
        validade: document.querySelector("#validade").value,
        status: document.querySelector("#status").value
    };

    // Decide se vai Criar (POST) ou Atualizar (PUT)
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
        
        // Limpa e reseta o formulário
        document.querySelector("#nome").value = "";
        document.querySelector("#descricao").value = "";
        window.documentoEditandoId = null;
        const btn = document.querySelector("#botao-salvar");
        btn.innerHTML = '<i class="fa-solid fa-cloud-arrow-up"></i> SALVAR DOCUMENTO';
        btn.style.backgroundColor = ""; // Volta a cor original
    });
}

function excluirDocumento(id) {
    if (confirm("Excluir este documento?")) {
        fetch(`${API_URL_DOCUMENTOS}/${id}`, { method: "DELETE" })
            .then(() => {
                alert("Documento excluído!");
                listarDocumentos();
            });
    }
}

// ==========================================
// FUNÇÕES DO DASHBOARD (Estatísticas)
// ==========================================
async function carregarEstatisticas() {
    try {
        const response = await fetch("http://127.0.0.1:5000/api/estatisticas");
        const stats = await response.json();

        const kpiPendentes = document.getElementById("kpi-pendentes");
        const kpiConcluidas = document.getElementById("kpi-concluidas");

        // Se estiver na tela do Dashboard, injeta os números reais!
        if (kpiPendentes && kpiConcluidas) {
            kpiPendentes.textContent = stats.pendentes < 10 ? "0" + stats.pendentes : stats.pendentes;
            kpiConcluidas.textContent = stats.concluidas < 10 ? "0" + stats.concluidas : stats.concluidas;
        }
    } catch (erro) {
        console.error("Erro ao carregar estatísticas:", erro);
    }
}