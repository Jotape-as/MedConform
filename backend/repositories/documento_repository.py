import sqlite3
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
        conexao = self.conectar()
        cursor = conexao.cursor()

        cursor.execute("""
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

      linhas_afetadas = cursor.rowcount

      conexao.close()

      return linhas_afetadas

    def excluir(self, id):
        conexao = self.conectar()
        cursor = conexao.cursor()
    
        cursor.execute("""
        DELETE FROM documento
        WHERE id = ?
        """, (id,))
    
        conexao.commit()
    
        linhas_afetadas = cursor.rowcount
    
        conexao.close()
    
        return linhas_afetadas