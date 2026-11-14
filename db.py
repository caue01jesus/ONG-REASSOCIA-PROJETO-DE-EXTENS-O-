import mysql.connector
import config


def conectar():
    return mysql.connector.connect(**config.DB)


def consultar(sql, params=None, um=False):
    con = conectar()
    cur = con.cursor(dictionary=True)
    try:
        cur.execute(sql, params or ())
        return cur.fetchone() if um else cur.fetchall()
    finally:
        cur.close()
        con.close()


def executar(sql, params=None):
    con = conectar()
    cur = con.cursor()
    try:
        cur.execute(sql, params or ())
        con.commit()
        return cur.lastrowid
    finally:
        cur.close()
        con.close()
