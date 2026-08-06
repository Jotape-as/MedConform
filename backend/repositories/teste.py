from documento_repository import DocumentoRepository

repo = DocumentoRepository()

repo.criar_tabela()

repo.adicionar(
    "Manual de Segurança",
    "Normas",
    "Documento de teste"
)

print("Funcionou!")