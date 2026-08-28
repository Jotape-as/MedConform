from models.solicitacao import Solicitacao

class EstatisticasService:
    def executar(self):
        todas_solicitacoes = Solicitacao.listar_todos()
        
        # Faz a contagem baseada no status de cada solicitação
        pendentes = sum(1 for s in todas_solicitacoes if s.status.lower() in ['pendente', 'aguardando auditoria'])
        aprovadas = sum(1 for s in todas_solicitacoes if s.status.lower() == 'aprovado')
        negadas = sum(1 for s in todas_solicitacoes if s.status.lower() == 'negado')
        
        return {
            "pendentes": pendentes,
            "concluidas": aprovadas + negadas,
            "total": len(todas_solicitacoes)
        }