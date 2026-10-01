from database.database import db

class Material(db.Model):
    __tablename__ = 'materiais'
    
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(150), nullable=False)
    codigo_anvisa = db.Column(db.String(50), unique=True, nullable=False)
    categoria = db.Column(db.String(50), nullable=False) 
    fabricante = db.Column(db.String(100), nullable=False)
    preco_base = db.Column(db.Float, nullable=False, default=0.0)

    def to_dict(self):
        return {
            "id": self.id,
            "nome": self.nome,
            "codigo_anvisa": self.codigo_anvisa,
            "categoria": self.categoria,
            "fabricante": self.fabricante,
            "preco_base": self.preco_base
        }
        
    @staticmethod
    def listar_todos():
        return Material.query.all()