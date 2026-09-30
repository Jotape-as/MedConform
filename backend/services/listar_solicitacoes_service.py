from flask import session
from models.solicitacao import Solicitacao

class ListarSolicitacoesService:
    def executar(self):
        # 1. Resgatamos as informações de quem fez a requisição
        perfil = session.get('perfil')
        nome_usuario = session.get('nome')

        # 2. Aplicamos a segregação de dados (RBAC)
        if perfil == 'medico':
            # O banco devolve APENAS as guias criadas por este médico específico
            return Solicitacao.query.filter_by(medico_solicitante=nome_usuario).all()
        
        # 3. Se for 'auditor' (ou se for o sistema a listar para estatísticas globais), retorna tudo
        return Solicitacao.query.all()