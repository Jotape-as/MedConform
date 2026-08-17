# laravel-api/ — Atividade: API REST em Laravel (entidade Documento)

Esta pasta foi adicionada ao projeto **MedConform** para a atividade individual de
"API REST em Laravel", **sem alterar** nada do que já existia em `frontend/` e
`backend/` (a API Flask original continua intacta e funcionando normalmente).

Entidade escolhida: **Documento**, a mesma já modelada no back-end Flask do projeto
(`backend/models/documento.py` e `backend/controllers/documento_controller.py`),
agora reimplementada como API REST em Laravel, conforme pedido da atividade.

Campos mantidos exatamente como no projeto original:
`nome`, `categoria`, `descricao`, `validade`, `status` (+ `id`, `created_at`, `updated_at`).

## Estrutura desta pasta

```text
laravel-api/
├── database/migrations/2026_08_17_000000_create_documentos_table.php
├── app/Models/Documento.php
├── app/Http/Controllers/Api/DocumentoController.php
└── routes/api.php
```

## Como rodar (gera um projeto Laravel funcional a partir destes arquivos)

1. Crie um projeto Laravel novo (fora desta pasta, ou em qualquer diretório):
   ```bash
   composer create-project laravel/laravel medconform-laravel
   cd medconform-laravel
   ```

2. Copie os arquivos desta pasta (`laravel-api/`) para os caminhos correspondentes
   no projeto Laravel recém-criado (mesma estrutura de subpastas):
   - `database/migrations/...`
   - `app/Models/Documento.php`
   - `app/Http/Controllers/Api/DocumentoController.php`
   - `routes/api.php` (mescle com o arquivo padrão do Laravel)

3. Configure o `.env` com o banco de dados e rode:
   ```bash
   php artisan migrate
   php artisan serve
   ```

## Endpoints

| Método | Rota                    | Ação                              |
|--------|-------------------------|------------------------------------|
| GET    | /api/documentos         | Lista todos os documentos          |
| GET    | /api/documentos/{id}    | Busca um documento por ID          |
| POST   | /api/documentos         | Cria um novo documento             |
| PUT    | /api/documentos/{id}    | Atualiza um documento por ID       |
| DELETE | /api/documentos/{id}    | Remove um documento por ID         |

## Testes rápidos (curl)

```bash
# Criar
curl -X POST http://localhost:8000/api/documentos \
  -H "Content-Type: application/json" \
  -d '{"nome":"Manual de Segurança","categoria":"Normas","descricao":"Documento de teste","validade":"2027-01-01","status":"ativo"}'

# Listar
curl http://localhost:8000/api/documentos

# Buscar por ID
curl http://localhost:8000/api/documentos/1

# Atualizar
curl -X PUT http://localhost:8000/api/documentos/1 \
  -H "Content-Type: application/json" \
  -d '{"nome":"Manual de Segurança v2","categoria":"Normas","status":"revisado"}'

# Excluir
curl -X DELETE http://localhost:8000/api/documentos/1
```

## Observação sobre o schema original

O arquivo `backend/database/create_database.sql` (do back-end Flask) tem um
**conflito de merge não resolvido** (`<<<<<<< HEAD` / `=======`), divergindo se
`validade` e `status` deveriam ser `NOT NULL`. A migration em Laravel aqui seguiu
a regra real de validação do controller Flask (`backend/controllers/documento_controller.py`),
que só exige `nome`, `categoria` e `status` — por isso `validade` e `descricao`
ficaram como `nullable`. Vale resolver esse conflito no `.sql` original também.

⚠️ Antes de compactar o projeto Laravel completo (depois de colar estes arquivos
nele) para a entrega, lembre-se de remover a pasta `vendor/`.
