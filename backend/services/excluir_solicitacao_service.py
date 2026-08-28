from models.solicitacao import Solicitacao

class ExcluirSolicitacaoService:
    def executar(self, solicitacao_id):
        solicitacao = Solicitacao.buscar_por_id(solicitacao_id)
        if not solicitacao:
            raise ValueError("Solicitação não encontrada.")
        
        solicitacao.deletar()
        return True