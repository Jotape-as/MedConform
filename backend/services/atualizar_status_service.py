from models.solicitacao import Solicitacao

class AtualizarStatusService:
    def executar(self, solicitacao_id, novo_status):
        solicitacao = Solicitacao.buscar_por_id(solicitacao_id)
        if not solicitacao:
            raise ValueError("Solicitação não encontrada.")
        
        solicitacao.status = novo_status
        solicitacao.atualizar()
        return solicitacao