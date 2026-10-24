from models.fornecedor import Fornecedor

class ExcluirFornecedorService:
    def executar(self, fornecedor_id):
        fornecedor = Fornecedor.buscar_por_id(fornecedor_id)
        if not fornecedor:
            raise ValueError("Fornecedor não encontrado.")
        
        fornecedor.deletar()
        return True