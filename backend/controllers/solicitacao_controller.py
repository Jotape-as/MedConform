from flask import jsonify
from services.criar_solicitacao_service import CriarSolicitacaoService
from services.listar_solicitacoes_service import ListarSolicitacoesService
from services.atualizar_status_service import AtualizarStatusService
from services.excluir_solicitacao_service import ExcluirSolicitacaoService
from services.estatisticas_service import EstatisticasService


class SolicitacaoController:
    def criar(self, request):
        try:
            dados = request.get_json()
            service = CriarSolicitacaoService()
            nova_solicitacao = service.executar(dados)
            return jsonify({"mensagem": "Solicitação criada!", "id_solicitacao": nova_solicitacao.id}), 201
        except Exception as e:
            return jsonify({"erro": str(e)}), 400

    def listar(self):
        try:
            service = ListarSolicitacoesService()
            solicitacoes = service.executar()
            
            lista = []
            for s in solicitacoes:
                lista.append({
                    "id_real": s.id,
                    "id": f"#RQ-{s.id:04d}",
                    "medico": s.medico_solicitante,
                    "procedimento": s.procedimento,
                    "status": s.status,
                    "data": s.data_agendada or "A definir",
                    "valor": "$ 0,00"
                })
            return jsonify(lista), 200
        except Exception as e:
            return jsonify({"erro": str(e)}), 500

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

