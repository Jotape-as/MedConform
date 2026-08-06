<<<<<<< HEAD
from flask import Flask
from controllers.documento_controller import documento_bp
from services.documento_service import DocumentoService

app = Flask(__name__)

service = DocumentoService()
service.criar_tabela()

app.register_blueprint(documento_bp)
=======
from flask import Flask, request
from repositories.documento_repository import DocumentoRepository

app = Flask(__name__)

repo = DocumentoRepository()
>>>>>>> e673010ab566b5d6ecc72b5afa257c15d8e3dc1c

@app.route("/")
def inicio():
    return "MedConform funcionando!"

<<<<<<< HEAD
=======
@app.route("/documento", methods=["POST"])
def criar_documento():
    nome = request.args.get("nome")
    categoria = request.args.get("categoria")
    descricao = request.args.get("descricao")

    repo.adicionar(nome, categoria, descricao)

    return "Documento cadastrado!"

>>>>>>> e673010ab566b5d6ecc72b5afa257c15d8e3dc1c
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)