class Documento:
    """
    Representa um documento do sistema MedConform.
    """

    def __init__(self, id, nome, categoria, descricao, validade, status):
        self.id = id
        self.nome = nome
        self.categoria = categoria
        self.descricao = descricao
        self.validade = validade
        self.status = status

    def to_dict(self):
        return {
            "id": self.id,
            "nome": self.nome,
            "categoria": self.categoria,
            "descricao": self.descricao,
            "validade": self.validade,
            "status": self.status
        }