from models.documento import Documento

class AtualizarDocumentoService:
    def executar(self, documento_id, dados):
        documento = Documento.buscar_por_id(documento_id)
        if not documento:
            raise ValueError("Documento não encontrado.")

        # Atualiza apenas os campos que foram enviados
        documento.nome = dados.get('nome', documento.nome)
        documento.categoria = dados.get('categoria', documento.categoria)
        documento.descricao = dados.get('descricao', documento.descricao)
        documento.validade = dados.get('validade', documento.validade)
        documento.status = dados.get('status', documento.status)

        documento.atualizar()
        return documento