from models.fornecedor import Fornecedor

class CriarFornecedorService:
    def executar(self, dados):
        if not dados.get('nome_empresa') or not dados.get('cnpj'):
            raise ValueError("Nome da empresa e CNPJ são obrigatórios.")
            
        novo_fornecedor = Fornecedor(
            nome_empresa=dados['nome_empresa'],
            cnpj=dados['cnpj']
        )
        novo_fornecedor.salvar()
        return novo_fornecedor