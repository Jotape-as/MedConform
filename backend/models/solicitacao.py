from database.database import db
from datetime import datetime

class Solicitacao(db.Model):
    __tablename__ = 'solicitacoes'

    id = db.Column(db.Integer, primary_key=True)
    nome_paciente = db.Column(db.String(100), nullable=False)
    registro_paciente = db.Column(db.String(20))
    convenio = db.Column(db.String(50))
    medico_solicitante = db.Column(db.String(100))
    crm = db.Column(db.String(20))
    procedimento = db.Column(db.String(150), nullable=False)
    data_agendada = db.Column(db.String(20))
    justificativa = db.Column(db.Text)
    status = db.Column(db.String(50), default="Aguardando Auditoria")
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)

    # --- Métodos de Persistência Obrigatórios ---
    def salvar(self):
        db.session.add(self)
        db.session.commit()

    def atualizar(self):
        db.session.commit()

    def deletar(self):
        db.session.delete(self)
        db.session.commit()

    @classmethod
    def listar_todos(cls):
        return cls.query.all()

    @classmethod
    def buscar_por_id(cls, solicitacao_id):
        return cls.query.get(solicitacao_id)