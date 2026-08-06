from repositories.documento_repository import DocumentoRepository


class DocumentoService:

    def __init__(self):
        self.repo = DocumentoRepository()

    def listar(self):
        return self.repo.listar()

    def buscar_por_id(self, id):
        return self.repo.buscar_por_id(id)

    def adicionar(self, nome, categoria, descricao, validade, status):
        return self.repo.adicionar(nome, categoria, descricao, validade, status)

    def atualizar(self, id, nome, categoria, descricao, validade, status):
        return self.repo.atualizar(id, nome, categoria, descricao, validade, status)

    def excluir(self, id):
        return self.repo.excluir(id)

    def criar_tabela(self):
        self.repo.criar_tabela()