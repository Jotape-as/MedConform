CREATE TABLE documento (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    categoria TEXT NOT NULL,
    descricao TEXT,
    validade TEXT,
    status TEXT
)