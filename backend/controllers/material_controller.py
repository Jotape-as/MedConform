import random
from flask import jsonify, request
from database.database import db
from models.material import Material

class MaterialController:
    def listar(self):
        materiais = Material.listar_todos()
        return jsonify([m.to_dict() for m in materiais]), 200

    def criar(self, request):
        dados = request.get_json()
        try:
            novo_material = Material(
                nome=dados.get('nome'),
                codigo_anvisa=dados.get('codigo_anvisa'),
                categoria=dados.get('categoria'),
                fabricante=dados.get('fabricante'),
                preco_base=float(dados.get('preco_base', 0))
            )
            db.session.add(novo_material)
            db.session.commit()
            return jsonify({"mensagem": "Material adicionado com sucesso!", "id": novo_material.id}), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({"erro": str(e)}), 400
        
    def excluir(self, material_id):
        try:
            material = Material.query.get(material_id)
            if not material:
                return jsonify({"erro": "Material não encontrado"}), 404
                
            db.session.delete(material)
            db.session.commit()
            return jsonify({"mensagem": "Material excluído com sucesso!"}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"erro": str(e)}), 400
        
    def cotacao_automatica(self, request):
        dados = request.get_json()
        nome_material = dados.get('nome', '').lower()

        if not nome_material:
            return jsonify({"erro": "Nome do material é obrigatório"}), 400

        # Simulação de Busca de Mercado em Fornecedores Reais
        fabricantes_mercado = ["Synthes Brasil", "Medtronic", "Stryker", "Zimmer Biomet", "Johnson & Johnson"]
        
        # Lógica inteligente para definir categoria baseada no nome
        categoria = "Material Especial"
        if any(palavra in nome_material for palavra in ["haste", "placa", "parafuso", "pino"]):
            categoria = "Órtese"
        elif any(palavra in nome_material for palavra in ["prótese", "valva", "implante"]):
            categoria = "Prótese"

        # Simula o código da ANVISA e encontra um preço base competitivo de forma automática
        codigo_anvisa = f"800{random.randint(1000000, 9999999)}"
        preco_mercado = round(random.uniform(1200.50, 9500.00), 2)

        return jsonify({
            "codigo_anvisa": codigo_anvisa,
            "categoria": categoria,
            "fabricante_vencedor": random.choice(fabricantes_mercado),
            "menor_preco": preco_mercado
        }), 200