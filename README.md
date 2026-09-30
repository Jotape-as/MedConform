# MedConform

Sistema acadêmico desenvolvido em equipe com foco na validação de OPMEs (Órteses, Próteses e Materiais Especiais).

O projeto está sendo desenvolvido como parte da formação técnica no COTEMIG, aplicando na prática conceitos de desenvolvimento web, APIs, arquitetura de software e persistência de dados.

## Sobre o projeto

O MedConform tem como objetivo auxiliar no processo de validação de informações relacionadas a OPMEs, utilizando uma aplicação web com separação entre front-end e back-end.

O sistema possui uma API REST desenvolvida em Python com Flask, responsável pelas regras e operações da aplicação, integrada a uma interface web desenvolvida com HTML, CSS e JavaScript.

## Tecnologias utilizadas

### Back-end

- Python
- Flask
- API REST
- SQLite

### Front-end

- HTML5
- CSS3
- JavaScript

## Arquitetura

O back-end do projeto foi organizado em diferentes camadas, separando responsabilidades e facilitando a manutenção e evolução da aplicação.

MedConform/
├── backend/
│   ├── controllers/
│   ├── database/
│   ├── models/
│   ├── repositories/
│   ├── services/
│   ├── app.py
│   ├── medconform.db
│   └── requirements.txt
│
└── frontend/
    ├── index.html
    ├── style.css
    └── script.js


## Funcionalidades

- API REST desenvolvida com Python e Flask
- Arquitetura back-end organizada em camadas
- Operações CRUD
- Persistência de dados
- Integração entre front-end e API
- Interface web desenvolvida com HTML, CSS e JavaScript
- Validação de informações relacionadas a OPMEs

## Status do projeto

🚧 **Em desenvolvimento**

O MedConform continua recebendo novas funcionalidades e melhorias ao longo do desenvolvimento acadêmico.

## Equipe

Projeto desenvolvido em equipe por alunos do Colégio COTEMIG.

- **Alexandre Luiz Silva**
- **Henrique Braga Soares**
- **João Pedro Santana**
- **Matheus Belthodo**

## Contexto acadêmico

Projeto desenvolvido no **Colégio COTEMIG** como parte da formação técnica em Redes e Arquitetura de Computadores.

## 🚀 Funcionalidades Implementadas

O projeto Medconform atende aos requisitos propostos entregando fluxos de operações completos com arquitetura dividida em Services e Controllers, além de uma interface assíncrona. As funcionalidades implementadas são:

**Autenticação e Regras de Negócio (Novas)**
1. **Auditoria Automatizada (IA):** Integração com a API do Google Gemini para analisar justificativas médicas e gerar pareceres técnicos de conformidade clínica.
2. **Autenticação de Usuários:** Sistema de Login gerenciado via sessões no backend (Flask `server-side`), garantindo proteção de rotas.
3. **Controle de Acesso (RBAC):** Renderização dinâmica da interface. Ocultação de menus e botões de acordo com o perfil logado (Médico Cirurgião vs. Auditor Chefe).
4. **Segregação de Dados:** Filtro de privacidade no banco de dados que garante que o médico solicitante visualize e interaja apenas com os dados dos seus próprios pacientes.
5. **Geração de Laudos Oficiais em PDF:** Exportação de pareceres técnicos em papel timbrado renderizado através de "molde fantasma" (HTML/CSS dinâmico) para o `html2pdf.js`.
6. **Segurança de Tráfego (CORS):** Configuração avançada de cabeçalhos e credenciais para comunicação segura entre origens distintas (Frontend 5500 ↔ Backend 5000).

**Gestão de Solicitações OPME**
7. **Criar Solicitação de OPME (POST):** Cadastro de novas solicitações contendo dados do paciente, médico solicitante e detalhes de procedimentos cirúrgicos.
8. **Listar Solicitações (GET):** Busca no banco de dados e exibição dinâmica dos registros na tabela principal do sistema.
9. **Atualizar Status da Solicitação (PUT):** Aprovação ou negação rápida de solicitações ativas diretamente pelos botões de ação na interface.
10. **Excluir Solicitação (DELETE):** Remoção permanente e segura de registros de solicitações do banco de dados.

**Gestão de Documentos Clínicos**
11. **Anexar Novo Documento (POST):** Cadastro de laudos, exames de imagem e guias de convênio na aba de Gestão de Documentos.
12. **Listar Documentos Clínicos (GET):** Visualização em tabela de todos os arquivos anexados, categorizados por tipo e status.
13. **Editar Documento (PUT):** Reaproveitamento do formulário para carregar e atualizar os dados de um documento já existente.
14. **Excluir Documento (DELETE):** Remoção de documentos indesejados, expirados ou cadastrados incorretamente.

**Estatísticas e Usabilidade**
15. **Dashboard de Estatísticas em Tempo Real (GET):** Endpoint dedicado no backend para calcular e exibir dinamicamente os Indicadores Chave (KPIs) nos cards superiores (Total de pendências, aprovadas/negadas).
16. **Filtros Dinâmicos de Tabela (Frontend):** Algoritmo em JavaScript que permite alternar as abas ("Todos os Casos", "Pendentes", "Aprovados") filtrando os dados na tela instantaneamente sem a necessidade de recarregar a página.
