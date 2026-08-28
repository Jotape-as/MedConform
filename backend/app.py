from flask import Flask, request
from flask_cors import CORS
from database.database import db

from models.documento import Documento
from models.solicitacao import Solicitacao
from controllers.solicitacao_controller import SolicitacaoController
from controllers.documento_controller import DocumentoController 

app = Flask(__name__)
CORS(app) 

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///medconform.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    db.create_all()

@app.route('/api/status', methods=['GET'])
def status():
    return {"status": "API Medconform operando com sucesso!"}, 200

# 2. Crie a rota que o Frontend vai chamar
@app.route('/api/solicitacoes', methods=['GET', 'POST'])
def gerenciar_solicitacoes():
    controller = SolicitacaoController()
    if request.method == 'POST':
        return controller.criar(request)
    elif request.method == 'GET':
        return controller.listar()

# Rota para Atualizar Status (PUT)
@app.route('/api/solicitacoes/<int:id>/status', methods=['PUT'])
def atualizar_status(id):
    controller = SolicitacaoController()
    return controller.atualizar_status(id, request)

# Rota para Deletar (DELETE)
@app.route('/api/solicitacoes/<int:id>', methods=['DELETE'])
def deletar_solicitacao(id):
    controller = SolicitacaoController()
    return controller.excluir(id)

# NOVA ROTA DE DOCUMENTOS
@app.route('/api/documentos', methods=['GET', 'POST'])
def gerenciar_documentos():
    controller = DocumentoController()
    if request.method == 'POST':
        return controller.criar(request)
    elif request.method == 'GET':
        return controller.listar()

# Rota para Deletar Documento (DELETE)
@app.route('/api/documentos/<int:id>', methods=['DELETE'])
def deletar_documento(id):
    controller = DocumentoController()
    return controller.excluir(id)

# Rota para Estatísticas do Dashboard (GET)
@app.route('/api/estatisticas', methods=['GET'])
def obter_estatisticas():
    controller = SolicitacaoController()
    return controller.estatisticas()

@app.route('/api/documentos/<int:id>', methods=['PUT'])
def atualizar_documento(id):
    controller = DocumentoController()
    return controller.atualizar(id, request)

if __name__ == '__main__':
    app.run(debug=True, port=5000)

