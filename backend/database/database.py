import sqlite3

DATABASE = "database/medconform.db"

def get_connection():
    return sqlite3.connect(DATABASE)