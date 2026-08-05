import sqlite3

class DocumentoRepository:

    def conectar(self):
        return sqlite3.connect("medconform.db")

    def criar_tabela(self):
        conexao = self.conectar()
        cursor = conexao.cursor()

        cursor.execute("""
        CREATE TABLE IF NOT EXISTS documento (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            categoria TEXT NOT NULL,
            descricao TEXT
        )
        """)

        conexao.commit()
        conexao.close()

    def adicionar(self, nome, categoria, descricao):
        conexao = self.conectar()
        cursor = conexao.cursor()

        cursor.execute("""
        INSERT INTO documento (nome, categoria, descricao)
        VALUES (?, ?, ?)
        """, (nome, categoria, descricao))

        conexao.commit()
        conexao.close()