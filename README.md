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

O projeto MedConform atende aos requisitos propostos entregando fluxos de operações completos, divididos em *Services* e *Controllers*. 

### Autenticação e Regras de Negócio (Avançado)
*   **🤖 Auditoria Automatizada (IA):** Integração com a API do Google Gemini para analisar justificativas médicas e gerar pareceres técnicos de conformidade clínica.
*   **🔐 Autenticação de Utilizadores:** Sistema de Login gerido via sessões no backend (Flask `server-side`), garantindo a proteção das rotas.
*   **🛡️ Controlo de Acesso (RBAC):** Renderização dinâmica da interface, ocultando menus e botões de acordo com o perfil logado (Médico Cirurgião vs. Auditor Chefe).
*   **👁️ Segregação de Dados:** Filtro de privacidade na base de dados que garante que o médico solicitante apenas visualize os dados dos seus próprios pacientes.
*   **📄 Geração de Laudos Oficiais em PDF:** Exportação de pareceres técnicos em papel timbrado renderizado através de um "molde fantasma" (HTML/CSS dinâmico) para o `html2pdf.js`.
*   **🌐 Segurança de Tráfego (CORS):** Configuração avançada de cabeçalhos e credenciais para a comunicação segura entre diferentes origens (Frontend 5500 ↔ Backend 5000).

### Gestão de Solicitações OPME (CRUD)
*   **Criar (POST):** Cadastro de novas solicitações contendo dados do paciente, médico solicitante e detalhes dos procedimentos cirúrgicos.
*   **Listar (GET):** Busca na base de dados e exibição dinâmica dos registos na tabela principal do sistema.
*   **Atualizar Status (PUT):** Aprovação ou negação rápida de solicitações ativas diretamente pelos botões de ação na interface.
*   **Excluir (DELETE):** Remoção permanente e segura de registos de solicitações da base de dados.

### Gestão de Documentos Clínicos
*   **Anexar Documento (POST):** Cadastro de laudos, exames de imagem e guias de convénio.
*   **Listar Documentos (GET):** Visualização em tabela de todos os ficheiros anexados, categorizados por tipo e status.
*   **Editar Documento (PUT):** Reaproveitamento do formulário para carregar e atualizar os dados de um documento existente.
*   **Excluir Documento (DELETE):** Remoção de documentos indesejados ou expirados.

### Estatísticas e Usabilidade
*   **📊 Dashboard em Tempo Real (GET):** Endpoint dedicado no backend para calcular e exibir dinamicamente os Indicadores Chave (KPIs) nos cards superiores (pendências, aprovadas/negadas, tempo médio).
*   **🔍 Filtros Dinâmicos de Tabela:** Algoritmo em JavaScript que permite alternar as abas ("Todos os Casos", "Pendentes", "Aprovados") filtrando os dados instantaneamente sem recarregar a página.

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
