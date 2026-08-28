from models.solicitacao import Solicitacao

class ListarSolicitacoesService:
    def executar(self):
        # Chama a responsabilidade da Model para listar (Regra 4 do projeto)
        return Solicitacao.listar_todos()