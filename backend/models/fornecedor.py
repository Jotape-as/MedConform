from database.database import db

class Fornecedor(db.Model):
    __tablename__ = 'fornecedores'

    id = db.Column(db.Integer, primary_key=True)
    nome_empresa = db.Column(db.String(150), nullable=False)
    cnpj = db.Column(db.String(20), unique=True, nullable=False)
    status = db.Column(db.String(50), default="Ativo")

    def to_dict(self):
        return {
            "id": self.id,
            "nome_empresa": self.nome_empresa,
            "cnpj": self.cnpj,
            "status": self.status
        }

    def salvar(self):
        db.session.add(self)
        db.session.commit()

    def deletar(self):
        db.session.delete(self)
        db.session.commit()

    @classmethod
    def listar_todos(cls):
        return cls.query.all()

    @classmethod
    def buscar_por_id(cls, fornecedor_id):
        return cls.query.get(fornecedor_id)