from models.solicitacao import Solicitacao

class ListarSolicitacoesService:
    def executar(self):
        # Chama a responsabilidade da Model para listar 
        return Solicitacao.listar_todos()