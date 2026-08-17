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
