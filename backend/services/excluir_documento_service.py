from models.documento import Documento

class ExcluirDocumentoService:
    def executar(self, documento_id):
        documento = Documento.buscar_por_id(documento_id)
        if not documento:
            raise ValueError("Documento não encontrado.")
        
        documento.deletar()
        return True