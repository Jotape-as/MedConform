from flask import jsonify
from services.criar_solicitacao_service import CriarSolicitacaoService
from services.listar_solicitacoes_service import ListarSolicitacoesService
from services.atualizar_status_service import AtualizarStatusService
from services.excluir_solicitacao_service import ExcluirSolicitacaoService
from services.estatisticas_service import EstatisticasService
from services.listar_pendentes_service import ListarPendentesService
from services.emitir_parecer_service import EmitirParecerService
from models.solicitacao import Solicitacao
from dotenv import load_dotenv
from services.analisar_ia_service import AnalisarIAService
import os
from google import genai
import json

load_dotenv()

class SolicitacaoController:

    def listar(self):
        try:
            service = ListarSolicitacoesService()
            solicitacoes = service.executar()
            
            lista = []
            for s in solicitacoes:
                valor_db = getattr(s, 'valor_total', None)
                if valor_db:
                    valor_formatado = f"R$ {valor_db:,.2f}".replace(',', 'X').replace('.', ',').replace('X', '.')
                else:
                    valor_formatado = "R$ 0,00"

                lista.append({
                    "id_real": s.id,
                    "id": f"#RQ-{s.id:04d}",
                    "medico": s.medico_solicitante,
                    "procedimento": s.procedimento,
                    "status": s.status,
                    "data": s.data_agendada or "A definir",
                    "valor": valor_formatado,
                    "justificativa": s.justificativa,
                    "materiais_solicitados": getattr(s, 'materiais_solicitados', None),
                    "valor_total": valor_db,
                    "fornecedor_vencedor": getattr(s, 'fornecedor_vencedor', None)
                })
            return jsonify(lista), 200
        except Exception as e:
            return jsonify({"erro": str(e)}), 500

    def listar_pendentes(self):
        try:
            service = ListarPendentesService()
            solicitacoes = service.executar()
            
            lista = []
            for s in solicitacoes:
                lista.append({
                    "id_real": s.id,
                    "id": f"#RQ-{s.id:04d}",
                    "paciente": getattr(s, 'nome_paciente', 'Não informado'),
                    "procedimento": s.procedimento,
                    "status": s.status,
                    "justificativa": s.justificativa,
                    "materiais_solicitados": getattr(s, 'materiais_solicitados', None),
                    "valor_total": getattr(s, 'valor_total', None),
                    "fornecedor_vencedor": getattr(s, 'fornecedor_vencedor', None)
                })
                
            return jsonify(lista), 200
        except Exception as e:
            return jsonify({"erro": str(e)}), 500

    def criar(self, request):
        try:
            dados_texto = request.form.to_dict()
            nomes_materiais = request.form.getlist('nome_material[]')
            quantidades = request.form.getlist('quantidade_material[]')
            
            lista_opme = []
            for nome, qtd in zip(nomes_materiais, quantidades):
                if nome.strip():
                    lista_opme.append({"nome": nome.strip(), "quantidade": int(qtd)})
            
            dados_texto['materiais_opme'] = lista_opme
            arquivo = request.files.get('exame')
            
            service = CriarSolicitacaoService()
            nova_solicitacao = service.executar(dados_texto, arquivo)
            
            return jsonify({"mensagem": "Solicitação criada com sucesso!", "id_solicitacao": nova_solicitacao.id}), 201
        except Exception as e:
            return jsonify({"erro": str(e)}), 400

    def atualizar_status(self, solicitacao_id, request):
        try:
            dados = request.get_json()
            service = AtualizarStatusService()
            service.executar(solicitacao_id, dados.get("status"))
            return jsonify({"mensagem": "Status atualizado com sucesso!"}), 200
        except Exception as e:
            return jsonify({"erro": str(e)}), 400

    def excluir(self, solicitacao_id):
        try:
            service = ExcluirSolicitacaoService()
            service.executar(solicitacao_id)
            return jsonify({"mensagem": "Solicitação excluída permanentemente!"}), 200
        except Exception as e:
            return jsonify({"erro": str(e)}), 400

    def estatisticas(self):
        try:
            service = EstatisticasService()
            dados = service.executar()
            return jsonify(dados), 200
        except Exception as e:
            return jsonify({"erro": str(e)}), 500

    def emitir_parecer(self, solicitacao_id, request):
        try:
            dados = request.get_json() or {}
            novo_status = dados.get("status")
            parecer = dados.get("parecer", "")

            if not novo_status:
                return jsonify({"erro": "Status é obrigatório."}), 400

            service = EmitirParecerService()
            service.executar(solicitacao_id, novo_status, parecer)
            return jsonify({"mensagem": f"Solicitação {novo_status.lower()} com sucesso!"}), 200
        except Exception as e:
            return jsonify({"erro": str(e)}), 400

    def analisar_com_ia(self, id):
        try:
            service = AnalisarIAService()
            dados_ia = service.executar(id)
            return jsonify(dados_ia), 200

        except ValueError as ve:
            return jsonify({"erro": str(ve)}), 404
        except Exception as e:
            erro_str = str(e)
            print(f"Erro na IA: {erro_str}")
            
            if "503" in erro_str or "UNAVAILABLE" in erro_str:
                return jsonify({
                    "status": "AGUARDANDO",
                    "risco_fraude": "INDEFINIDO",
                    "parecer_tecnico": "⚠️ **Aviso de Sistema:** Os servidores de Inteligência Artificial estão com pico de acessos. Aguarde alguns instantes e tente novamente."
                }), 200
                
            return jsonify({"erro": "Falha ao processar com IA."}), 500