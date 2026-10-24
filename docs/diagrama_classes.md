classDiagram
    class Usuario {
        +Integer id
        +String nome
        +String email
        +String senha
        +String perfil
        +salvar() void
        +deletar() void
        +listar_todos() List~Usuario~
        +buscar_por_id(id: Integer) Usuario
        +to_dict() dict
    }

    class Solicitacao {
        +Integer id
        +String nome_paciente
        +String registro_paciente
        +String convenio
        +String medico_solicitante
        +String crm
        +String procedimento
        +String data_agendada
        +Text justificativa
        +String status
        +DateTime data_criacao
        +Text materiais_solicitados
        +Float valor_total
        +String fornecedor_vencedor
        +salvar() void
        +atualizar() void
        +deletar() void
        +listar_todos() List~Solicitacao~
        +buscar_por_id(id: Integer) Solicitacao
    }

    class Fornecedor {
        +Integer id
        +String nome_empresa
        +String cnpj
        +String status
        +salvar() void
        +deletar() void
        +listar_todos() List~Fornecedor~
        +buscar_por_id(id: Integer) Fornecedor
        +to_dict() dict
    }

    class Documento {
        +Integer id
        +String nome_arquivo
        +String tipo
        +String caminho_ficheiro
        +Integer solicitacao_id
        +salvar() void
        +deletar() void
        +buscar_por_solicitacao(id: Integer) List~Documento~
    }
    
    class Material {
        +Integer id
        +String nome
        +String codigo_anvisa
        +Float preco_base
        +Integer fornecedor_id
        +salvar() void
    }

    %% Relacionamentos
    Usuario "1" -- "*" Solicitacao : Cria / Audita
    Solicitacao "1" *-- "*" Documento : Possui (Composição)
    Fornecedor "1" o-- "*" Material : Fornece (Agregação)
    Solicitacao "*" -- "1" Fornecedor : Vencedor da Cotação