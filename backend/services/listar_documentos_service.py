from models.documento import Documento

class ListarDocumentosService:
    def executar(self):
        return Documento.listar_todos()