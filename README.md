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

```text
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
```

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

O projeto Medconform atende aos requisitos propostos entregando um fluxo de operações completo (CRUD) com arquitetura dividida em Services e Controllers, além de uma interface assíncrona. As 10 funcionalidades implementadas são:

1. **Criar Solicitação de OPME (POST):** Cadastro de novas solicitações contendo dados do paciente, médico solicitante e detalhes de procedimentos cirúrgicos.
2. **Listar Solicitações (GET):** Busca no banco de dados e exibição dinâmica dos registros na tabela principal do sistema.
3. **Atualizar Status da Solicitação (PUT):** Aprovação ou negação rápida de solicitações ativas diretamente pelos botões de ação na interface.
4. **Excluir Solicitação (DELETE):** Remoção permanente e segura de registros de solicitações do banco de dados.
5. **Anexar Novo Documento (POST):** Cadastro de laudos, exames de imagem e guias de convênio na aba de Gestão de Documentos.
6. **Listar Documentos Clínicos (GET):** Visualização em tabela de todos os arquivos anexados, categorizados por tipo e status.
7. **Excluir Documento (DELETE):** Remoção de documentos indesejados, expirados ou cadastrados incorretamente.
8. **Editar Documento (PUT):** Reaproveitamento do formulário para carregar e atualizar os dados de um documento já existente.
9. **Dashboard de Estatísticas em Tempo Real (GET):** Endpoint dedicado no backend para calcular e exibir dinamicamente os Indicadores Chave (KPIs) nos cards superiores (Total de pendências, aprovadas/negadas).
10. **Filtros Dinâmicos de Tabela (Frontend):** Algoritmo em JavaScript que permite alternar as abas ("Todos os Casos", "Pendentes", "Aprovados") filtrando os dados na tela instantaneamente sem a necessidade de recarregar a página.
