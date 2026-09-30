from database.database import db
from models.solicitacao import Solicitacao

class EmitirParecerService:
    def executar(self, solicitacao_id, novo_status, parecer_texto):
        solicitacao = Solicitacao.query.get(solicitacao_id)
        if not solicitacao:
            raise Exception("Solicitação não encontrada.")

        solicitacao.status = novo_status
        # Guarda o parecer na justificativa ou cria um campo se existir
        if hasattr(solicitacao, 'justificativa'):
            solicitacao.justificativa = f"{solicitacao.justificativa or ''} | Parecer Auditor: {parecer_texto}"

        db.session.commit()
        return solicitacao