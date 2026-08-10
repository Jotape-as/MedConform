from flask import Blueprint, request, jsonify
from services.documento_service import DocumentoService

documento_bp = Blueprint("documento", __name__)

service = DocumentoService()


@documento_bp.route("/", methods=["GET"])
def inicio():
    return "MedConform funcionando!"


@documento_bp.route("/documentos", methods=["POST"])
def criar_documento():
    dados = request.get_json() or {}

    nome = dados.get("nome")
    categoria = dados.get("categoria")
    descricao = dados.get("descricao")
    validade = dados.get("validade")
    status = dados.get("status")

    if not nome or not categoria or not status:
        return jsonify({
            "erro": "Nome, categoria e status são obrigatórios"
        }), 400

    id_documento = service.adicionar(
        nome,
        categoria,
        descricao,
        validade,
        status
    )

    return jsonify({
        "mensagem": "Documento cadastrado com sucesso!",
        "id": id_documento
    }), 201

@documento_bp.route("/documentos", methods=["GET"])
def listar_documentos():
    documentos = service.listar()
    return jsonify([documento.to_dict() for documento in documentos])


@documento_bp.route("/documentos/<int:id>", methods=["GET"])
def buscar_documento(id):
    documento = service.buscar_por_id(id)

    if documento:
        return jsonify(documento.to_dict())

    return jsonify({"erro": "Documento não encontrado"}), 404


@documento_bp.route("/documentos/<int:id>", methods=["PUT"])
def atualizar_documento(id):

    dados = request.get_json() or {}

    nome = dados.get("nome")
    categoria = dados.get("categoria")
    descricao = dados.get("descricao")
    validade = dados.get("validade")
    status = dados.get("status")

    if not nome or not categoria or not status:
        return jsonify({
            "erro": "Nome, categoria e status são obrigatórios"
        }), 400

    documento = service.buscar_por_id(id)

    if not documento:
        return jsonify({
            "erro": "Documento não encontrado"
        }), 404

    service.atualizar(id, nome, categoria, descricao, validade, status)

    return jsonify({
        "mensagem": "Documento atualizado com sucesso!"
    }), 200


@documento_bp.route("/documentos/<int:id>", methods=["DELETE"])
def excluir_documento(id):
    documento = service.buscar_por_id(id)

    if not documento:
        return jsonify({
            "erro": "Documento não encontrado"
        }), 404

    service.excluir(id)

    return jsonify({
        "mensagem": "Documento excluído com sucesso!"
    }), 200