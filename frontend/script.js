const API_URL_DOCUMENTOS = "http://127.0.0.1:5000/api/documentos";
const API_URL_SOLICITACOES = "http://127.0.0.1:5000/api/solicitacoes";

// Variáveis globais
window.solicitacoesGlobais = [];
window.documentosGlobais = [];
window.documentoEditandoId = null;

document.addEventListener("DOMContentLoaded", () => {
    // 1. Carrega Solicitações e Dashboard
    const tabelaBody = document.getElementById("tabela-solicitacoes");
    if (tabelaBody) {
        carregarSolicitacoes();
        carregarEstatisticas();
    }

    // 2. Carrega Documentos
    const tabelaDocs = document.getElementById("tabela-documentos");
    if (tabelaDocs) listarDocumentos();

    // 3. Carrega Fila de Auditoria
    const tabelaAuditoria = document.getElementById("tabela-auditoria");
    if (tabelaAuditoria) {
        carregarFilaAuditoria();
    }

    // ========================================================
    // Lógica das Tabs da Tabela (Filtros)
    // ========================================================
    const tabs = document.querySelectorAll('.filter-tabs .tab');
    if (tabs.length > 0) {
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

    // ========================================================
    // Lógica do Botão de Enviar Solicitação (Com FormData)
    // ========================================================
    // ========================================================
    // Lógica do Botão de Enviar Solicitação (Com FormData)
    // ========================================================
const btnEnviar = document.getElementById("btn-enviar");
    if (btnEnviar) {
        btnEnviar.addEventListener("click", async () => {
            // 1. Captura todas as linhas de materiais inseridas
            // ATUALIZADO: Removemos a palavra 'input' para o JavaScript aceitar o teu <select>
            const nomesMateriais = document.querySelectorAll('[name="nome_material[]"]');
            const qtdsMateriais = document.querySelectorAll('input[name="quantidade_material[]"]');

            // 2. Valida se pelo menos um material foi preenchido
            let temMaterialValido = false;
            nomesMateriais.forEach(campo => {
                // Como a primeira opção do select é vazia (value=""), ele só valida se o utilizador escolher um material real
                if (campo.value.trim() !== '') {
                    temMaterialValido = true;
                }
            });

            if (!temMaterialValido) {
                alert('Atenção: É necessário solicitar pelo menos um material OPME.');
                return; // Interrompe o envio se estiver vazio
            }

            // 3. Monta o FormData manualmente
            const formData = new FormData();
            formData.append("nome_paciente", document.getElementById("nome_paciente")?.value || "");
            formData.append("registro_paciente", document.getElementById("registro_paciente")?.value || "");
            formData.append("convenio", document.getElementById("convenio")?.value || "");
            formData.append("medico_solicitante", document.getElementById("medico_solicitante")?.value || "");
            formData.append("crm", document.getElementById("crm")?.value || "");
            formData.append("procedimento", document.getElementById("procedimento")?.value || "");
            formData.append("data_agendada", document.getElementById("data_agendada")?.value || "");
            formData.append("justificativa", document.getElementById("justificativa")?.value || "");

            // 4. Adiciona a lista de materiais ao FormData iterando sobre os campos
            nomesMateriais.forEach((input, index) => {
                if (input.value.trim() !== '') {
                    formData.append('nome_material[]', input.value.trim());
                    formData.append('quantidade_material[]', qtdsMateriais[index].value);
                }
            });

            // 5. Adiciona o arquivo de exame (se houver)
            const inputArquivo = document.getElementById("input-arquivo-exame");
            if (inputArquivo && inputArquivo.files[0]) {
                formData.append("exame", inputArquivo.files[0]);
            }

            // 6. Envia para o Backend
            try {
                const response = await fetch(API_URL_SOLICITACOES, {
                    method: "POST",
                    body: formData
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
// FUNÇÕES DA AUDITORIA
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

    // NOVO: Busca os detalhes da solicitação na variável global e preenche a tela
    const solic = window.solicitacoesGlobais.find(s => s.id_real === idReal);

    if (solic && cardDetalhes) {
        document.getElementById("detalhe-id").textContent = solic.id;
        document.getElementById("detalhe-paciente").textContent = solic.paciente || "Não informado";
        document.getElementById("detalhe-procedimento").textContent = solic.procedimento;
        document.getElementById("detalhe-justificativa").textContent = solic.justificativa || "Sem justificativa.";

        // Exibe os dados do fornecedor e materiais (se existirem)
        document.getElementById("detalhe-fornecedor").textContent = solic.fornecedor_vencedor || "Pendente";

        // Formata o valor para Reais
        const valorFormatado = solic.valor_total ?
            parseFloat(solic.valor_total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) :
            "R$ 0,00";
        document.getElementById("detalhe-valor").textContent = valorFormatado;

        // Exibe a lista de materiais de forma elegante
        let htmlMateriais = "Nenhum material registrado.";
        if (solic.materiais_solicitados && solic.materiais_solicitados !== 'None') {
            try {
                // Transforma o texto do Python num Array do JavaScript
                const listaMat = JSON.parse(solic.materiais_solicitados.replace(/'/g, '"'));

                // Monta os marcadores HTML da lista
                htmlMateriais = "<ul style='padding-left: 20px; margin: 0;'>";
                listaMat.forEach(item => {
                    htmlMateriais += `<li><strong>${item.quantidade}x</strong> ${item.nome}</li>`;
                });
                htmlMateriais += "</ul>";
            } catch (e) {
                // Prevenção de erro caso o texto não seja convertido
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

    if (!idReal) {
        alert("Selecione um caso na fila primeiro.");
        return;
    }

    feedbackIA.textContent = "Processando análise clínica com IA...";
    btnIA.disabled = true;

    try {
        const response = await fetch(`${API_URL_SOLICITACOES}/${idReal}/analise-ia`);
        const dados = await response.json();

        if (response.ok) {
            // Mostra o texto da IA
            feedbackIA.innerHTML = `<strong>[Status: ${dados.status} | Risco: ${dados.risco_fraude}]</strong><br><br>${dados.parecer_tecnico}`;
            
            // Cria um botão "Salvar Decisão" logo abaixo do texto
            const btnSalvar = document.createElement('button');
            btnSalvar.className = 'btn-fill mt-15'; // Usa a tua classe CSS de botão azul
            btnSalvar.style.width = '100%';
            btnSalvar.style.marginTop = '15px';
            btnSalvar.innerHTML = '<i class="fa-solid fa-check-double"></i> Aplicar Parecer no Sistema';
            
            // Quando clicado, chama a função que acabámos de criar
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

async function enviarParecer(decisao) {
    const inputId = document.getElementById("audit-id");
    const inputParecer = document.getElementById("audit-parecer");

    const idReal = inputId ? inputId.value : "";
    const parecer = inputParecer ? inputParecer.value.trim() : "";

    if (!idReal) {
        alert("Por favor, selecione uma solicitação na fila antes de emitir o parecer.");
        return;
    }

    if (!parecer) {
        alert("Digite uma justificativa técnica para o parecer.");
        return;
    }

    try {
        const response = await fetch(`${API_URL_SOLICITACOES}/${idReal}/parecer`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: decisao, parecer: parecer })
        });

        const resultado = await response.json();

        if (response.ok) {
            alert(resultado.mensagem);

            inputId.value = "";
            inputParecer.value = "";
            document.getElementById("btn-analisar-ia").disabled = true;
            document.getElementById("ai-feedback").textContent = "Selecione um caso na fila para acionar a análise inteligente de coerência do pedido.";

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
// FUNÇÕES DE SOLICITAÇÕES E DASHBOARD
// ==========================================
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
// FUNÇÕES DE DOCUMENTOS
// ==========================================
function listarDocumentos() {
    fetch(API_URL_DOCUMENTOS)
        .then(resposta => resposta.json())
        .then(documentos => {
            window.documentosGlobais = documentos;
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
        const kpiValor = document.getElementById("kpi-valor-aprovado"); // Caso tenhas um card para valores
        if (kpiValor) {
            kpiValor.textContent = stats.valor_aprovado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        }

        renderizarGrafico(stats.grafico);

        if (kpiPendentes) {
            kpiPendentes.textContent = stats.pendentes < 10 ? "0" + stats.pendentes : stats.pendentes;
        }

        if (kpiConcluidas) {
            kpiConcluidas.textContent = stats.concluidas < 10 ? "0" + stats.concluidas : stats.concluidas;
        }


    } catch (erro) {
        console.error("Erro ao carregar estatísticas:", erro);
    }
}

let graficoInstancia = null;

function renderizarGrafico(dadosGrafico) {
    const ctx = document.getElementById('graficoGastos');
    if (!ctx) return;

    // Se o gráfico já existir, destrói-o antes de desenhar um novo (evita bugar ao recarregar)
    if (graficoInstancia) {
        graficoInstancia.destroy();
    }

    graficoInstancia = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dadosGrafico.meses,
            datasets: [
                {
                    label: 'Órteses',
                    data: dadosGrafico.orteses,
                    backgroundColor: '#0ea5e9', // Azul claro
                    borderRadius: 4
                },
                {
                    label: 'Próteses',
                    data: dadosGrafico.proteses,
                    backgroundColor: '#0369a1', // Azul escuro
                    borderRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    stacked: true // Coloca as barras umas sobre as outras (opcional)
                },
                x: {
                    stacked: true // Coloca as barras umas sobre as outras (opcional)
                }
            },
            plugins: {
                legend: { position: 'top' }
            }
        }
    });
}

// ==========================================
// FUNÇÕES DO MODAL E UPLOAD DE ARQUIVOS
// ==========================================
function abrirModalParecer(idReal) {
    const solic = window.solicitacoesGlobais.find(s => s.id_real === idReal);
    if (!solic) return;

    document.getElementById('modal-paciente').textContent = solic.paciente || "Não informado";
    document.getElementById('modal-procedimento').textContent = solic.procedimento;
    document.getElementById('modal-status').textContent = solic.status;

    const justificativa = solic.justificativa;
    document.getElementById('modal-justificativa').textContent = justificativa && justificativa !== "null" ? justificativa : "Nenhum comentário técnico registrado para esta solicitação.";

    document.getElementById('modal-detalhes').style.display = 'flex';
}

function fecharModalParecer() {
    const modal = document.getElementById('modal-detalhes');
    if (modal) {
        modal.style.display = 'none';
    }
}

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
    // Impede que o clique na lixeira dispare o clique da caixa de upload de trás
    if (event) event.stopPropagation();

    const inputArquivo = document.getElementById('input-arquivo-exame');
    const container = document.getElementById('container-arquivo-selecionado');

    if (inputArquivo) {
        inputArquivo.value = "";
    }
    if (container) {
        container.style.display = 'none';
    }
}

window.addEventListener('click', function (event) {
    const modal = document.getElementById('modal-detalhes');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

function adicionarMaterial() {
    const lista = document.getElementById('lista-materiais');
    
    // 1. Encontra a primeira linha de material na página
    const primeiraLinha = lista.querySelector('.linha-material');
    
    // 2. Clona a linha inteira (incluindo todas as opções do select que vieram da base de dados!)
    const novaLinha = primeiraLinha.cloneNode(true);
    
    // 3. Limpa os valores para a nova linha aparecer em branco
    const select = novaLinha.querySelector('select');
    if (select) select.value = '';
    
    const quantidade = novaLinha.querySelector('input[type="number"]');
    if (quantidade) quantidade.value = '1';
    
    // 4. Adiciona a nova linha clonada ao final da lista
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
// MÓDULO: CATÁLOGO DE MATERIAIS (OPME)
// ==========================================

// ==========================================
// MÓDULO: CATÁLOGO DE MATERIAIS (OPME)
// ==========================================

function abrirModalMaterial() {
    // Remove a classe 'oculto' para mostrar o modal
    document.getElementById('modal-material').classList.remove('oculto');
}

function fecharModalMaterial() {
    // Adiciona a classe 'oculto' para esconder o modal
    document.getElementById('modal-material').classList.add('oculto');
    
    // Aproveitamos e limpamos o formulário para a próxima vez
    const form = document.getElementById('form-material');
    if (form) form.reset(); 
}

async function carregarMateriais() {
    const tabela = document.getElementById('tabela-materiais');
    if (!tabela) return; // Segurança: só corre se estivermos na página de materiais

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
                    <td><span class="badge" style="background: #e0f2fe; color: #0369a1; padding: 4px 8px; border-radius: 4px;">${m.categoria}</span></td>
                    <td>${m.fabricante}</td>
                    <td>${precoFormatado}</td>
                    <td class="acoes-tabela">
                        <button class="btn-icone icone-vermelho" onclick="excluirMaterial(${m.id})" title="Excluir"><i class="fa-solid fa-trash"></i></button>
                    </td>
                </tr>
            `;
        });
        
        tabela.innerHTML = html || '<tr><td colspan="6" style="text-align: center; padding: 20px;">Nenhum material cadastrado no catálogo.</td></tr>';
    } catch (erro) {
        console.error("Erro ao carregar materiais:", erro);
    }
}

async function salvarMaterial(event) {
    event.preventDefault(); // Impede o "piscar" da página
    
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
            carregarMateriais(); // Atualiza a tabela na hora
        } else {
            alert("Erro! O código ANVISA já existe ou ocorreu uma falha.");
        }
    } catch (erro) {
        console.error("Erro ao salvar material:", erro);
    }
}

// Quando a página carregar, carrega a tabela automaticamente
document.addEventListener('DOMContentLoaded', () => {
    carregarMateriais();
    carregarDropdownMateriais();
});

// Função Antifraude: Busca os valores no mercado e bloqueia a edição manual
async function buscarDadosMercado(event) {
    const nomeInput = document.getElementById('mat-nome').value;
    
    if (!nomeInput || nomeInput.length < 3) {
        alert("Por favor, digite o nome do material (mínimo 3 letras) antes de buscar a cotação.");
        return;
    }

    const btn = event.currentTarget;
    const textoOriginal = btn.innerHTML;
    // Efeito visual de carregamento para a apresentação
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Consultando Mercado...';
    btn.disabled = true;

    try {
        const response = await fetch("http://127.0.0.1:5000/api/materiais/cotacao-automatica", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome: nomeInput })
        });

        const dados = await response.json();

        if (response.ok) {
            // Preenche os campos automaticamente
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
    if (!confirm("Tem a certeza que deseja remover este material do catálogo? Esta ação não afeta as solicitações antigas.")) {
        return;
    }

    try {
        const response = await fetch(`http://127.0.0.1:5000/api/materiais/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            carregarMateriais(); // Recarrega a tabela automaticamente sem piscar a página
        } else {
            alert("Erro ao excluir o material.");
        }
    } catch (erro) {
        console.error("Erro na exclusão:", erro);
    }
}

async function carregarDropdownMateriais() {
    // Procura o select que acabámos de criar no solicitacoes.html
    const selectMaterial = document.getElementById('sol-materiais');
    if (!selectMaterial) return; // Se não estivermos na página de solicitações, ele ignora silenciosamente

    try {
        const response = await fetch("http://127.0.0.1:5000/api/materiais");
        const materiais = await response.json();
        
        selectMaterial.innerHTML = '<option value="">Selecione um material aprovado...</option>';
        
        materiais.forEach(m => {
            const precoTeto = m.preco_base.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            const option = document.createElement('option');
            
            // O value é o que vai ser salvo no banco de dados da Solicitação
            option.value = `${m.nome} (Ref: ${m.codigo_anvisa})`; 
            
            // O texto é o que o médico vê na tela
            option.text = `[${m.categoria}] ${m.nome} - Teto: ${precoTeto}`;
            
            selectMaterial.appendChild(option);
        });
    } catch (erro) {
        console.error("Erro ao carregar o catálogo de materiais:", erro);
        selectMaterial.innerHTML = '<option value="">Erro ao comunicar com o catálogo</option>';
    }
}

async function salvarParecerIA(idSolicitacao, statusIA, parecerIA) {
    // Como a IA pode retornar "APROVADO" tudo em maiúsculo, ajustamos para o formato da tua base de dados
    const statusFormatado = statusIA === "APROVADO" ? "Aprovado" : "Negado";

    try {
        // Envia os dados para a rota do teu backend que atualiza o parecer
        const response = await fetch(`http://127.0.0.1:5000/api/solicitacoes/${idSolicitacao}/parecer`, {
            method: 'POST', // Se a tua rota no app.py usar POST, muda isto para 'POST'
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                status: statusFormatado,
                parecer: parecerIA
            })
        });

        if (response.ok) {
            alert(`Sucesso! A solicitação foi marcada como ${statusFormatado}.`);
            // Recarrega a página para a solicitação sumir da fila de pendentes
            window.location.reload();
        } else {
            const erro = await response.json();
            alert(`Erro ao salvar: ${erro.erro || "Falha no servidor"}`);
        }
    } catch (erro) {
        console.error("Erro ao salvar parecer:", erro);
        alert("Erro de comunicação com o servidor ao tentar salvar.");
    }
}

async function carregarEstatisticasDashboard() {
    try {
        // Faz o pedido à tua rota de estatísticas no Flask
        const response = await fetch('http://127.0.0.1:5000/api/estatisticas');
        const dados = await response.json();

        if (response.ok) {
            // 1. Atualiza as Solicitações Pendentes (Card 1)
            const elPendentes = document.getElementById('kpi-pendentes');
            // O truque (dados.pendentes < 10 ? '0' : '') adiciona um zero à esquerda (ex: "03" em vez de "3") para manter o teu design
            if (elPendentes) elPendentes.textContent = (dados.pendentes < 10 ? '0' : '') + dados.pendentes;

            // 2. Atualiza as Aprovadas/Negadas (Card 2) - Somamos as duas
            const elConcluidas = document.getElementById('kpi-concluidas');
            const totalConcluidas = (dados.aprovadas || 0) + (dados.negadas || 0);
            if (elConcluidas) elConcluidas.textContent = (totalConcluidas < 10 ? '0' : '') + totalConcluidas;

            // 3. Atualiza o Valor Total Projetado (Rodapé do Gráfico)
            const elValor = document.getElementById('kpi-valor-aprovado');
            if (elValor && dados.valor_total) {
                // Formata o número para o padrão de moeda do Brasil
                elValor.textContent = dados.valor_total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            }

            // 4. Atualiza Cirurgias Urgentes (Card 3)
            const elUrgentes = document.getElementById('kpi-urgentes');
            if (elUrgentes) elUrgentes.textContent = (dados.urgentes < 10 ? '0' : '') + dados.urgentes;

            // 5. Atualiza Tempo Médio (Card 4)
            const elTempo = document.getElementById('kpi-tempo');
            if (elTempo) elTempo.innerHTML = `${dados.tempo_medio}<span>h</span>`;

            // 6. Renderizar o Gráfico de Barras com Chart.js
            const ctx = document.getElementById('graficoGastos');
            if (ctx && dados.grafico) {
                // Se já existir um gráfico renderizado, destrói-o antes de desenhar um novo para evitar sobreposição
                let chartStatus = Chart.getChart("graficoGastos");
                if (chartStatus != undefined) {
                    chartStatus.destroy();
                }

                new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: dados.grafico.meses,
                        datasets: [
                            {
                                label: 'Órteses',
                                data: dados.grafico.orteses,
                                backgroundColor: '#0ea5e9', // Azul claro
                                borderRadius: { topLeft: 4, topRight: 4, bottomLeft: 0, bottomRight: 0 }
                            },
                            {
                                label: 'Próteses',
                                data: dados.grafico.proteses,
                                backgroundColor: '#0369a1', // Azul escuro
                                borderRadius: { topLeft: 4, topRight: 4, bottomLeft: 0, bottomRight: 0 }
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { display: false } // Escondemos a legenda padrão pois tu já fizeste uma customizada no HTML
                        },
                        scales: {
                            x: {
                                stacked: true, // Empilha as barras de órteses e próteses
                                grid: { display: false } // Remove as linhas verticais do fundo
                            },
                            y: {
                                stacked: true,
                                beginAtZero: true,
                                border: { display: false },
                                grid: { color: '#e2e8f0', drawTicks: false }
                            }
                        }
                    }
                });
            }
        }
    } catch (erro) {
        console.error("Erro ao carregar estatísticas do Dashboard:", erro);
    }
}

// Garante que a função roda automaticamente assim que o HTML termina de carregar
document.addEventListener("DOMContentLoaded", () => {
    carregarEstatisticasDashboard();
});

// Função para verificar quem está logado e montar a tela
function aplicarControleDeAcesso() {
    const nome = sessionStorage.getItem('usuarioNome');
    const perfil = sessionStorage.getItem('usuarioPerfil');

    // 1. Barreira de Segurança: Se não tem nome na sessão, manda pro login!
    if (!nome || !perfil) {
        window.location.href = 'login.html';
        return;
    }

    // 2. Atualiza os dados no Cabeçalho
    const nameDisplay = document.getElementById('user-name-display');
    const roleDisplay = document.getElementById('user-role-display');

    if (nameDisplay) nameDisplay.textContent = nome;
    if (roleDisplay) {
        // Formata o cargo para ficar bonito na tela
        roleDisplay.textContent = perfil === 'medico' ? 'Médico Cirurgião' : 'Auditor Chefe';
    }

    // 3. Controle de Menus (Oculta o que não devem ver)
    const menuAuditoria = document.getElementById('menu-auditoria');
    const btnNovaSolicitacao = document.getElementById('btn-nova-solicitacao');

    if (perfil === 'medico') {
        // Médico pede material, mas NÃO audita
        if (menuAuditoria) menuAuditoria.style.display = 'none';
    } else if (perfil === 'auditor') {
        // Auditor audita, mas NÃO cria pedidos
        if (btnNovaSolicitacao) btnNovaSolicitacao.style.display = 'none';
    }

    // 4. Configurar o botão de Logout
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', async (e) => {
            e.preventDefault();
            // Limpa a memória do navegador
            sessionStorage.clear();
            // (Opcional) Avisa o Python que saiu
            try { await fetch('http://127.0.0.1:5000/api/logout', { method: 'POST' }); } catch(err){}
            // Redireciona para o login
            window.location.href = 'login.html';
        });
    }
}

// Executa a verificação assim que a página carrega
document.addEventListener("DOMContentLoaded", () => {
    aplicarControleDeAcesso();
    // (Mantém as tuas outras funções aqui, como o carregarEstatisticasDashboard)
});

function gerarLaudoPDF() {
    // 1. Capturar os dados dinâmicos do Modal aberto
    // O operador '?' garante que, se o ID não existir, o sistema não quebra e exibe "Não informado"
    const paciente = document.getElementById('modal-paciente') ? document.getElementById('modal-paciente').textContent : 'Paciente não informado';
    const medico = document.getElementById('modal-medico') ? document.getElementById('modal-medico').textContent : 'Médico não informado';
    const procedimento = document.getElementById('modal-procedimento') ? document.getElementById('modal-procedimento').textContent : 'Procedimento não informado';
    const status = document.getElementById('modal-status') ? document.getElementById('modal-status').textContent : 'EM ANÁLISE';
    const justificativa = document.getElementById('modal-justificativa') ? document.getElementById('modal-justificativa').textContent : 'Nenhuma justificativa registada.';

    // 2. Injetar esses dados no Molde Oculto do PDF
    document.getElementById('pdf-data-emissao').textContent = new Date().toLocaleDateString('pt-PT') + ' às ' + new Date().toLocaleTimeString('pt-PT');
    document.getElementById('pdf-auditor-nome').textContent = sessionStorage.getItem('usuarioNome') || "Auditor Chefe";

    document.getElementById('pdf-paciente').textContent = paciente;
    document.getElementById('pdf-medico').textContent = medico;
    document.getElementById('pdf-procedimento').textContent = procedimento;
    document.getElementById('pdf-status').textContent = status;
    document.getElementById('pdf-justificativa').textContent = justificativa;

    // 3. Preparar a Biblioteca e o Botão
    const molde = document.getElementById('template-laudo-pdf');
    molde.style.display = 'block'; // Revela o molde temporariamente para a "fotografia"

    const btnPdf = document.querySelector('button[onclick="gerarLaudoPDF()"]');
    const textoOriginal = btnPdf.innerHTML;
    btnPdf.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Gerando...';

    // Formata o nome do ficheiro substituindo espaços por underlines (ex: Laudo_Auditoria_Sarah_Connor.pdf)
    const nomeFicheiro = `Laudo_Auditoria_${paciente.replace(/\s+/g, '_')}.pdf`;

    const opcoes = {
        margin:       15,
        filename:     nomeFicheiro,
        image:        { type: 'jpeg', quality: 1.0 },
        html2canvas:  { scale: 2, logging: false },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // 4. Gera o PDF e volta a esconder o molde
    html2pdf().set(opcoes).from(molde).save().then(() => {
        molde.style.display = 'none';
        btnPdf.innerHTML = textoOriginal;
    });
}