from app import app, db
from models.usuario import Usuario

# Usamos o contexto da aplicação para o SQLAlchemy saber onde está o banco de dados
with app.app_context():
    # Garante que a tabela 'usuarios' é criada na base de dados
    db.create_all()
    
    # Verifica se já existem utilizadores para não criarmos duplicados sem querer
    if not Usuario.query.first():
        print("A injetar utilizadores de teste...")
        
        # Criamos o perfil do Médico
        medico = Usuario(
            nome="Dr. Julian Vance", 
            email="medico@medconform.com", 
            senha="123", # Senha simples para testes
            perfil="medico"
        )
        
        # Criamos o perfil do Auditor
        auditor = Usuario(
            nome="Dra. Sarah Jenkins", 
            email="auditor@medconform.com", 
            senha="123", 
            perfil="auditor"
        )
        
        db.session.add(medico)
        db.session.add(auditor)
        db.session.commit()
        
        print("✅ Usuários criados com sucesso!")
        print("👤 Médico: medico@medconform.com | Senha: 123")
        print("🕵️ Auditor: auditor@medconform.com | Senha: 123")
    else:
        print("⚠️ Os usuários já existem no banco de dados. Não é necessário criar de novo.")