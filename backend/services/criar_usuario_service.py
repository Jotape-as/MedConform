from models.usuario import Usuario

class CriarUsuarioService:
    def executar(self, dados):
        nome = dados.get('nome')
        email = dados.get('email')
        senha = dados.get('senha')
        perfil = dados.get('perfil')

        # Validação de campos obrigatórios
        if not all([nome, email, senha, perfil]):
            raise ValueError("Todos os campos (nome, email, senha, perfil) são obrigatórios.")
        
        # Regra de negócio: evitar emails duplicados
        if Usuario.query.filter_by(email=email).first():
            raise ValueError("Este email já está cadastrado no sistema.")

        novo_usuario = Usuario(
            nome=nome,
            email=email,
            senha=senha,
            perfil=perfil
        )
        
        # Chama o método da Model conforme exigido na Regra 4
        novo_usuario.salvar()
        return novo_usuario