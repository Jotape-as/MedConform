from flask import jsonify
from services.criar_fornecedor_service import CriarFornecedorService
from services.listar_fornecedores_service import ListarFornecedoresService
from services.excluir_fornecedor_service import ExcluirFornecedorService

class FornecedorController:
    
    def criar(self, request):
        try:
            dados = request.get_json()
            service = CriarFornecedorService()
            fornecedor = service.executar(dados)
            return jsonify({"mensagem": "Fornecedor cadastrado!", "id": fornecedor.id}), 201
        except Exception as e:
            return jsonify({"erro": str(e)}), 400

    def listar(self):
        try:
            service = ListarFornecedoresService()
            fornecedores = service.executar()
            return jsonify([f.to_dict() for f in fornecedores]), 200
        except Exception as e:
            return jsonify({"erro": str(e)}), 500

    def excluir(self, id):
        try:
            service = ExcluirFornecedorService()
            service.executar(id)
            return jsonify({"mensagem": "Fornecedor excluído!"}), 200
        except Exception as e:
            return jsonify({"erro": str(e)}), 400