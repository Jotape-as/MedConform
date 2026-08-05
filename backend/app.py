from flask import Flask, request
from repositories.documento_repository import DocumentoRepository

app = Flask(__name__)

repo = DocumentoRepository()

@app.route("/")
def inicio():
    return "MedConform funcionando!"

@app.route("/documento", methods=["POST"])
def criar_documento():
    nome = request.args.get("nome")
    categoria = request.args.get("categoria")
    descricao = request.args.get("descricao")

    repo.adicionar(nome, categoria, descricao)

    return "Documento cadastrado!"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)