from models.solicitacao import Solicitacao

class EstatisticasService:
    def executar(self):
        todas = Solicitacao.listar_todos()
        
        # Contagens exatas para o Dashboard
        pendentes = sum(1 for s in todas if s.status.lower() not in ['aprovado', 'negado', 'reprovado'])
        aprovadas = sum(1 for s in todas if s.status.lower() == 'aprovado')
        negadas = sum(1 for s in todas if s.status.lower() in ['negado', 'reprovado'])
        
        # Valor financeiro da economia/aprovação
        valor_total = sum(s.valor_total for s in todas if s.status.lower() == 'aprovado' and s.valor_total)

        # Dados MVP para a banca (como não tens isto no banco ainda, enviamos valores fixos para o layout não quebrar)
        urgentes = 5
        tempo_medio = 3.2

        # Retorna exatamente os nomes que o JavaScript está à espera
        return {
            "pendentes": pendentes,
            "aprovadas": aprovadas,
            "negadas": negadas,
            "valor_total": valor_total,
            "urgentes": urgentes,
            "tempo_medio": tempo_medio,
            "grafico": {
                "meses": ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun (Atual)"],
                "orteses": [15000, 22000, 18000, 21000, 19500, valor_total * 0.4], 
                "proteses": [25000, 31000, 28000, 35000, 32000, valor_total * 0.6]
            }
        }