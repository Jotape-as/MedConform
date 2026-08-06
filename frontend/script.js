const API_URL = "http://127.0.0.1:5000/documentos";


// Carregar documentos quando abrir a página
document.addEventListener("DOMContentLoaded", listarDocumentos);


// Buscar documentos (GET)
function listarDocumentos() {

    fetch(API_URL)
        .then(resposta => resposta.json())
        .then(documentos => {
            console.log(documentos);
            const tabela = document.querySelector("#tabela-documentos");

            console.log(tabela);

            if (!tabela) {
                alert("Tabela não encontrada!");
                return;
            }

            tabela.innerHTML = "";

            documentos.forEach(documento => {

                tabela.innerHTML += `
                    <tr>
                        <td>${documento.id}</td>
                        <td>${documento.nome}</td>
                        <td>${documento.categoria}</td>
                        <td>${documento.status || ""}</td>
                        <td>
                            <button onclick="editarDocumento(${documento.id})">
                                Editar
                            </button>

                            <button onclick="excluirDocumento(${documento.id})">
                                Excluir
                            </button>
                        </td>
                    </tr>
                `;

            });

        });

}


// Cadastrar documento (POST)
function cadastrarDocumento() {

    const documento = {

        nome: document.querySelector("#nome").value,

        categoria: document.querySelector("#categoria").value,

        descricao: document.querySelector("#descricao").value,

        validade: document.querySelector("#validade").value,

        status: document.querySelector("#status").value

    };


    fetch(API_URL, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(documento)

    })

    .then(resposta => resposta.json())

    .then(() => {

        alert("Documento cadastrado!");

        listarDocumentos();

        document.querySelector("#nome").value = "";
        document.querySelector("#categoria").value = "";
        document.querySelector("#descricao").value = "";
        document.querySelector("#validade").value = "";
        document.querySelector("#status").value = "";

    });

}


// Excluir documento (DELETE)
function excluirDocumento(id) {

    fetch(`${API_URL}/${id}`, {

        method: "DELETE"

    })

    .then(() => {

        alert("Documento excluído!");

        listarDocumentos();

    });

}

function editarDocumento(id) {

    fetch(`${API_URL}/${id}`)
        .then(resposta => resposta.json())
        .then(documento => {

            document.querySelector("#nome").value = documento.nome;

            document.querySelector("#categoria").value = documento.categoria;

            document.querySelector("#descricao").value = documento.descricao;

            document.querySelector("#validade").value = documento.validade;

            document.querySelector("#status").value = documento.status;


            window.documentoEditando = id;

            document.querySelector("#botao-salvar").innerHTML = "Atualizar";
        });

}

function salvarDocumento() {

    const documento = {

        nome: document.querySelector("#nome").value,
        categoria: document.querySelector("#categoria").value,
        descricao: document.querySelector("#descricao").value,
        validade: document.querySelector("#validade").value,
        status: document.querySelector("#status").value

    };


    if (window.documentoEditando) {

        fetch(`${API_URL}/${window.documentoEditando}`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(documento)

        })

        .then(resposta => resposta.json())

        .then(() => {

            alert("Documento atualizado!");

            window.documentoEditando = null;

            limparFormulario();

            document.querySelector("#botao-salvar").innerHTML = "Cadastrar";

            listarDocumentos();

        });


    } else {

        fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(documento)

        })

        .then(resposta => resposta.json())

        .then(() => {

            alert("Documento cadastrado!");

            limparFormulario();

            listarDocumentos();

        });

    }

}

function limparFormulario() {

    document.querySelector("#nome").value = "";

    document.querySelector("#categoria").value = "";

    document.querySelector("#descricao").value = "";

    document.querySelector("#validade").value = "";

    document.querySelector("#status").value = "Ativo";

}