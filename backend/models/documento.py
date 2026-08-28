from database.database import db

class Documento(db.Model):
    __tablename__ = 'documentos'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nome = db.Column(db.String(150), nullable=False)
    categoria = db.Column(db.String(50))
    descricao = db.Column(db.Text)
    validade = db.Column(db.String(20))
    status = db.Column(db.String(50))

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
    def buscar_por_id(cls, documento_id):
        return cls.query.get(documento_id)

    def to_dict(self):
        return {
            "id": self.id,
            "nome": self.nome,
            "categoria": self.categoria,
            "descricao": self.descricao,
            "validade": self.validade,
            "status": self.status
        }