from flask import Flask, request
from flask_cors import CORS
from database.database import db

from models.documento import Documento
from models.solicitacao import Solicitacao
from models.usuario import Usuario
from controllers.solicitacao_controller import SolicitacaoController
from controllers.documento_controller import DocumentoController
from controllers.material_controller import MaterialController 
from flask import Flask, request, jsonify, session

app = Flask(__name__)
CORS(app)
app.secret_key = 'chave_super_secreta_medconform' # Necessário para o session funcionar

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

@app.route('/api/solicitacoes/pendentes', methods=['GET'])
def listar_pendentes():
    controller = SolicitacaoController()
    return controller.listar_pendentes()

@app.route('/api/solicitacoes/<int:id>/parecer', methods=['POST'])
def emitir_parecer(id):
    controller = SolicitacaoController()
    return controller.emitir_parecer(id, request)

@app.route('/api/solicitacoes/<int:id>/analise-ia', methods=['GET'])
def analisar_com_ia(id):
    controller = SolicitacaoController()
    return controller.analisar_com_ia(id)

material_controller = MaterialController()

@app.route('/api/materiais', methods=['GET'])
def listar_materiais():
    return material_controller.listar()

# 2. Rota para Criar um novo material
@app.route('/api/materiais', methods=['POST'])
def criar_material():
    return material_controller.criar(request)

# 3. Rota para Cotação Inteligente de Mercado
@app.route('/api/materiais/cotacao-automatica', methods=['POST'])
def cotacao_automatica():
    return material_controller.cotacao_automatica(request)

# 4. Rota para Excluir um material
@app.route('/api/materiais/<int:material_id>', methods=['DELETE'])
def excluir_material(material_id):
    return material_controller.excluir(material_id)

@app.route('/api/login', methods=['POST'])
def login():
    dados = request.get_json()
    email = dados.get('email')
    senha = dados.get('senha')

    # Procura o utilizador na base de dados
    user = Usuario.query.filter_by(email=email, senha=senha).first()

    if user:
        # Guarda as informações na sessão do servidor!
        session['user_id'] = user.id
        session['perfil'] = user.perfil
        session['nome'] = user.nome

        return jsonify({"mensagem": "Login efetuado com sucesso!", "usuario": user.to_dict()}), 200
    else:
        return jsonify({"erro": "Email ou senha incorretos."}), 401

@app.route('/api/usuario/atual', methods=['GET'])
def usuario_atual():
    # Esta rota serve para o JavaScript perguntar: "Quem está logado agora?"
    if 'user_id' in session:
        return jsonify({
            "id": session['user_id'],
            "nome": session['nome'],
            "perfil": session['perfil']
        }), 200
    return jsonify({"erro": "Não autenticado"}), 401

@app.route('/api/logout', methods=['POST'])
def logout():
    session.clear() # Apaga a memória de quem estava logado
    return jsonify({"mensagem": "Logout efetuado"}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)


