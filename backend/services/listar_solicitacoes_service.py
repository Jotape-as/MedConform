from flask import session
from models.solicitacao import Solicitacao

class ListarSolicitacoesService:
    def executar(self):
        perfil = session.get('perfil')
        nome_usuario = session.get('nome')

        if perfil == 'medico':
            return Solicitacao.query.filter_by(medico_solicitante=nome_usuario).all()
        
        return Solicitacao.query.all()