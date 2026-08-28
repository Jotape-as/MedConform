from flask import jsonify
from services.criar_documento_service import CriarDocumentoService
from services.listar_documentos_service import ListarDocumentosService
from services.excluir_documento_service import ExcluirDocumentoService
from services.atualizar_documento_service import AtualizarDocumentoService

class DocumentoController:
    def criar(self, request):
        try:
            dados = request.get_json()
            service = CriarDocumentoService()
            novo_doc = service.executar(dados)
            
            return jsonify({
                "mensagem": "Documento anexado com sucesso!",
                "id_documento": novo_doc.id
            }), 201
            
        except ValueError as ve:
            return jsonify({"erro": str(ve)}), 400
        except Exception as e:
            return jsonify({"erro": f"Erro interno: {str(e)}"}), 500

    def listar(self):
        try:
            service = ListarDocumentosService()
            documentos = service.executar()
            
            lista = [doc.to_dict() for doc in documentos]
            
            return jsonify(lista), 200
        except Exception as e:
            return jsonify({"erro": str(e)}), 500

    def excluir(self, documento_id):
        try:
            service = ExcluirDocumentoService()
            service.executar(documento_id)
            return jsonify({"mensagem": "Documento excluído permanentemente!"}), 200
        except Exception as e:
            return jsonify({"erro": str(e)}), 400

    def atualizar(self, documento_id, request):
        try:
            dados = request.get_json()
            service = AtualizarDocumentoService()
            service.executar(documento_id, dados)
            return jsonify({"mensagem": "Documento atualizado com sucesso!"}), 200
        except Exception as e:
            return jsonify({"erro": str(e)}), 400