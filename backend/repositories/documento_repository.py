import sqlite3
<<<<<<< HEAD
from models.documento import Documento
class DocumentoRepository:

    def conectar(self):
       print("Banco usado:", __import__("os").path.abspath("medconform.db"))
       return sqlite3.connect("medconform.db")

    def criar_tabela(self):
       conexao = self.conectar()
       cursor = conexao.cursor()

       cursor.execute("""
       CREATE TABLE IF NOT EXISTS documento (
           id INTEGER PRIMARY KEY AUTOINCREMENT,
           nome TEXT NOT NULL,
           categoria TEXT NOT NULL,
           descricao TEXT,
           validade TEXT,
           status TEXT
       )
       """)

       conexao.commit()
       conexao.close()

    def adicionar(self, nome, categoria, descricao, validade, status):
=======

class DocumentoRepository:

    def conectar(self):
        return sqlite3.connect("medconform.db")

    def criar_tabela(self):
>>>>>>> e673010ab566b5d6ecc72b5afa257c15d8e3dc1c
        conexao = self.conectar()
        cursor = conexao.cursor()

        cursor.execute("""
<<<<<<< HEAD
        INSERT INTO documento 
        (nome, categoria, descricao, validade, status)
        VALUES (?, ?, ?, ?, ?)
        """, (nome, categoria, descricao, validade, status))
    
        id_documento = cursor.lastrowid
    
        conexao.commit()
        conexao.close()

        return id_documento

    def listar(self):
        conexao = self.conectar()
        cursor = conexao.cursor()

        cursor.execute("SELECT * FROM documento")
        dados = cursor.fetchall()

        conexao.close()

        return [Documento(*linha) for linha in dados]


    def buscar_por_id(self, id):
        conexao = self.conectar()
        cursor = conexao.cursor()

        cursor.execute("SELECT * FROM documento WHERE id = ?", (id,))

        dados = cursor.fetchone()

        conexao.close()

        if dados:
            return Documento(*dados)

        return None
    
    def atualizar(self, id, nome, categoria, descricao, validade, status):
      conexao = self.conectar()
      cursor = conexao.cursor()

      cursor.execute("""
      UPDATE documento
      SET nome = ?, categoria = ?, descricao = ?, validade = ?, status = ?
      WHERE id = ?
      """, (nome, categoria, descricao, validade, status, id))

      conexao.commit()
      conexao.close()

    def excluir(self, id):
=======
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
>>>>>>> e673010ab566b5d6ecc72b5afa257c15d8e3dc1c
        conexao = self.conectar()
        cursor = conexao.cursor()

        cursor.execute("""
<<<<<<< HEAD
        DELETE FROM documento
        WHERE id = ?
        """, (id,))
=======
        INSERT INTO documento (nome, categoria, descricao)
        VALUES (?, ?, ?)
        """, (nome, categoria, descricao))
>>>>>>> e673010ab566b5d6ecc72b5afa257c15d8e3dc1c

        conexao.commit()
        conexao.close()