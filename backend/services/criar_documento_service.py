from models.documento import Documento

class CriarDocumentoService:
    def executar(self, dados: dict):
        if not dados.get('nome') or not dados.get('categoria'):
            raise ValueError("Nome e Categoria são obrigatórios para anexar um documento.")

        novo_documento = Documento(
            nome=dados.get('nome'),
            categoria=dados.get('categoria'),
            descricao=dados.get('descricao', ''),
            validade=dados.get('validade', ''),
            status=dados.get('status', 'Ativo')
        )

        novo_documento.salvar()
        return novo_documento