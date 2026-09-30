from models.solicitacao import Solicitacao

class ListarPendentesService:
    def executar(self):
        todas = Solicitacao.listar_todos()
        pendentes = [s for s in todas if s.status.lower() not in ['aprovado', 'negado']]
        return pendentes