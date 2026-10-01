from flask import Flask, request, jsonify, session
from flask_cors import CORS
from database.database import db

from models.documento import Documento
from models.solicitacao import Solicitacao
from models.usuario import Usuario

from controllers.solicitacao_controller import SolicitacaoController
from controllers.documento_controller import DocumentoController
from controllers.material_controller import MaterialController 

# ==========================================
# CONFIGURAÇÕES DO SERVIDOR
# ==========================================
app = Flask(__name__)
CORS(app)
app.secret_key = 'chave_super_secreta_medconform'

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///medconform.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    db.create_all()

# Instanciação Global dos Controladores
solicitacao_controller = SolicitacaoController()
documento_controller = DocumentoController()
material_controller = MaterialController()

# ==========================================
# ROTAS DE AUTENTICAÇÃO E SESSÃO
# ==========================================
@app.route('/api/login', methods=['POST'])
def login():
    dados = request.get_json()
    email = dados.get('email')
    senha = dados.get('senha')

    user = Usuario.query.filter_by(email=email, senha=senha).first()

    if user:
        session['user_id'] = user.id
        session['perfil'] = user.perfil
        session['nome'] = user.nome
        return jsonify({"mensagem": "Login efetuado com sucesso!", "usuario": user.to_dict()}), 200
    
    return jsonify({"erro": "Email ou senha incorretos."}), 401

@app.route('/api/usuario/atual', methods=['GET'])
def usuario_atual():
    if 'user_id' in session:
        return jsonify({
            "id": session['user_id'],
            "nome": session['nome'],
            "perfil": session['perfil']
        }), 200
    return jsonify({"erro": "Não autenticado"}), 401

@app.route('/api/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({"mensagem": "Logout efetuado"}), 200

# ==========================================
# SISTEMA GERAL E DASHBOARD
# ==========================================
@app.route('/api/status', methods=['GET'])
def status():
    return {"status": "API Medconform operando com sucesso!"}, 200

@app.route('/api/estatisticas', methods=['GET'])
def obter_estatisticas():
    return solicitacao_controller.estatisticas()

# ==========================================
# ROTAS DE SOLICITAÇÕES E AUDITORIA
# ==========================================
@app.route('/api/solicitacoes', methods=['GET', 'POST'])
def gerenciar_solicitacoes():
    if request.method == 'POST':
        return solicitacao_controller.criar(request)
    return solicitacao_controller.listar()

@app.route('/api/solicitacoes/pendentes', methods=['GET'])
def listar_pendentes():
    return solicitacao_controller.listar_pendentes()

@app.route('/api/solicitacoes/<int:id>/status', methods=['PUT'])
def atualizar_status(id):
    return solicitacao_controller.atualizar_status(id, request)

@app.route('/api/solicitacoes/<int:id>', methods=['DELETE'])
def deletar_solicitacao(id):
    return solicitacao_controller.excluir(id)

@app.route('/api/solicitacoes/<int:id>/parecer', methods=['POST'])
def emitir_parecer(id):
    return solicitacao_controller.emitir_parecer(id, request)

@app.route('/api/solicitacoes/<int:id>/analise-ia', methods=['GET'])
def analisar_com_ia(id):
    return solicitacao_controller.analisar_com_ia(id)

# ==========================================
# ROTAS DE MATERIAIS (CATÁLOGO OPME)
# ==========================================
@app.route('/api/materiais', methods=['GET', 'POST'])
def gerenciar_materiais():
    if request.method == 'POST':
        return material_controller.criar(request)
    return material_controller.listar()

@app.route('/api/materiais/cotacao-automatica', methods=['POST'])
def cotacao_automatica():
    return material_controller.cotacao_automatica(request)

@app.route('/api/materiais/<int:material_id>', methods=['DELETE'])
def excluir_material(material_id):
    return material_controller.excluir(material_id)

# ==========================================
# ROTAS DE DOCUMENTOS CLÍNICOS
# ==========================================
@app.route('/api/documentos', methods=['GET', 'POST'])
def gerenciar_documentos():
    if request.method == 'POST':
        return documento_controller.criar(request)
    return documento_controller.listar()

@app.route('/api/documentos/<int:id>', methods=['PUT'])
def atualizar_documento(id):
    return documento_controller.atualizar(id, request)

@app.route('/api/documentos/<int:id>', methods=['DELETE'])
def deletar_documento(id):
    return documento_controller.excluir(id)

if __name__ == '__main__':
    app.run(debug=True, port=5000)