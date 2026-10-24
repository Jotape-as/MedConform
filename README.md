# MedConform

Sistema académico desenvolvido em equipa com o foco na validação, auditoria e logística de OPMEs (Órteses, Próteses e Materiais Especiais).

O projeto está a ser desenvolvido como parte da formação técnica no **Colégio COTEMIG**, aplicando na prática conceitos de desenvolvimento web, APIs REST, arquitetura de software e Inteligência Artificial.

---

## 🎯 Sobre o Projeto

O MedConform tem como objetivo automatizar e dar segurança ao processo de validação de pedidos clínicos de OPMEs. A aplicação web possui uma arquitetura com separação clara entre front-end (assíncrono) e back-end.

O "motor" do sistema é uma API RESTful desenvolvida em Python com o framework Flask, que gere todas as regras de negócio, persistência de dados e segurança, perfeitamente integrada a uma interface web intuitiva desenvolvida com HTML, CSS e JavaScript Vanilla.

## 🛠️ Tecnologias Utilizadas

**Back-end:**
*   Python 3
*   Flask & Flask-CORS
*   API REST
*   SQLite (com SQLAlchemy)
*   Google GenAI SDK (Integração Gemini)

**Front-end:**
*   HTML5
*   CSS3
*   JavaScript (ES6+)
*   Chart.js (Dashboards)
*   html2pdf.js (Geração de Laudos)

---

## 🚀 Funcionalidades Implementadas

1. Realizar Login no sistema com verificação de perfil (Médico/Auditor)
2. Visualizar Dashboard com estatísticas globais de OPME (via Repository)
3. Cadastrar nova Solicitação clínica
4. Listar todas as Solicitações ativas
5. Visualizar detalhes completos de uma Solicitação
6. Atualizar o status de aprovação de uma Solicitação
7. Excluir uma Solicitação cancelada
8. **Analisar Risco com IA (Gemini):** Auditoria automatizada cruzando procedimento e materiais solicitados
9. Fazer Upload de Documentos e exames anexos
10. Listar Documentos vinculados a uma Solicitação
11. Excluir Documento específico
12. Cadastrar novo Material (catálogo OPME)
13. Listar Materiais cadastrados
14. Atualizar preço base de um Material
15. Excluir Material do catálogo
16. Buscar/Filtrar Solicitações e Materiais no sistema
17. Cadastrar novo Fornecedor homologado
18. Listar Fornecedores cadastrados
19. Excluir Fornecedor
20. Cadastrar novo Usuário (Médico ou Auditor) controlando e-mails duplicados

## 📊 Diagrama de Classes

O diagrama de classes (UML) refletindo o domínio da aplicação (relacionamentos de herança, composição e agregação) encontra-se no diretório `docs/`. 
* Pode ser visualizado no ficheiro: `docs/diagrama_classes.md` (ou `docs/diagrama.png`).

---

## 🏗️ Arquitetura do Sistema

O back-end do projeto foi estruturado em camadas distintas, isolando as responsabilidades para facilitar a manutenção e a escalabilidade da aplicação.

MedConform/
├── backend/
│   ├── controllers/      # Gestão de rotas e requisições HTTP
│   ├── database/         # Configurações do SQLAlchemy
│   ├── models/           # Entidades da base de dados
│   ├── repositories/     # Abstração de acesso aos dados (Design Pattern)
│   ├── services/         # Lógica central e regras de negócio
│   ├── app.py            # Ponto de entrada da aplicação Flask
│   ├── medconform.db     # Base de dados SQLite
│   └── requirements.txt  # Dependências do projeto
│
└── frontend/
    ├── index.html        # Estrutura das interfaces
    ├── style.css         # Estilização profissional
    └── script.js         # Lógica assíncrona de cliente

🚧 Status do Projeto
Em desenvolvimento

O MedConform continua a receber novas funcionalidades e otimizações de código ao longo do ciclo de desenvolvimento académico.

👥 Equipa e Contexto Académico
Projeto desenvolvido como parte da formação técnica em Redes e Arquitetura de Computadores no Colégio COTEMIG.

Membros da Equipa:

Alexandre Luiz Silva

Henrique Braga Soares

João Pedro Santana

Matheus Belthodo
