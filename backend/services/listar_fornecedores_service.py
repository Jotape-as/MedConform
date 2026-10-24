from models.fornecedor import Fornecedor

class ListarFornecedoresService:
    def executar(self):
        return Fornecedor.listar_todos()