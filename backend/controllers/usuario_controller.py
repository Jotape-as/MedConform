from flask import jsonify
from services.criar_usuario_service import CriarUsuarioService

class UsuarioController:
    def criar(self, request):
        try:
            dados = request.get_json()
            service = CriarUsuarioService()
            novo_usuario = service.executar(dados)
            
            return jsonify({
                "mensagem": f"Usuário {novo_usuario.nome} criado com sucesso!", 
                "id": novo_usuario.id
            }), 201
            
        except ValueError as ve:
            return jsonify({"erro": str(ve)}), 400
        except Exception as e:
            return jsonify({"erro": "Falha interna no servidor.", "detalhes": str(e)}), 500