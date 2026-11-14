"""Servidor WSGI simples para Reassocia. Não usa Flask nem Jinja2."""
import json
import mimetypes
from pathlib import Path
from urllib.parse import parse_qs, unquote
from wsgiref.simple_server import make_server
import config
import db

ROOT = Path(__file__).resolve().parent
STATIC = ROOT / 'static'
CORES = ['roxo', 'verde', 'laranja', 'azul', 'rosa']
CAMPOS = ['nome', 'resumo', 'descricao', 'objetivos', 'publico_atendido', 'acoes_realizadas', 'cor']

def response(start_response, payload, status='200 OK', content_type='application/json; charset=utf-8'):
    body = payload if isinstance(payload, bytes) else payload.encode('utf-8')
    start_response(status, [('Content-Type', content_type), ('Content-Length', str(len(body))), ('Cache-Control', 'no-store')])
    return [body]

def json_response(start_response, data, status='200 OK'):
    return response(start_response, json.dumps(data, ensure_ascii=False, default=str), status)

def read_json(environ):
    try:
        length = int(environ.get('CONTENT_LENGTH') or 0)
        return json.loads(environ['wsgi.input'].read(length) or b'{}')
    except (ValueError, TypeError, json.JSONDecodeError):
        return {}

def static_file(path, start_response, status='200 OK'):
    target = (STATIC / path).resolve()
    if not str(target).startswith(str(STATIC.resolve())) or not target.is_file():
        return response(start_response, 'Arquivo não encontrado.', '404 Not Found', 'text/plain; charset=utf-8')
    data = target.read_bytes()
    mime = mimetypes.guess_type(str(target))[0] or 'application/octet-stream'
    if mime.startswith('text/') or mime in ('application/javascript',): mime += '; charset=utf-8'
    return response(start_response, data, status, mime)

def app(environ, start_response):
    method = environ.get('REQUEST_METHOD', 'GET').upper()
    path = unquote(environ.get('PATH_INFO', '/'))
    query = parse_qs(environ.get('QUERY_STRING', ''), keep_blank_values=True)
    if path.startswith('/static/') and method == 'GET':
        return static_file(path[len('/static/'):], start_response)
    if method == 'GET' and (path == '/api/config'):
        return json_response(start_response, {'whatsapp':config.WHATSAPP,'instagram':config.INSTAGRAM,'facebook':config.FACEBOOK,'endereco':config.ENDERECO,'cores':CORES})
    if path == '/api/projetos' and method == 'GET':
        q = (query.get('q') or [''])[0].strip()
        consulta = (query.get('consulta') or ['0'])[0] == '1'
        if q:
            like = f'%{q}%'
            rows = db.consultar('SELECT * FROM projetos WHERE nome LIKE %s OR resumo LIKE %s OR descricao LIKE %s ORDER BY id', (like,like,like))
        elif consulta:
            rows = db.consultar('SELECT * FROM projetos WHERE na_consulta = 1 ORDER BY id')
        else:
            rows = db.consultar('SELECT * FROM projetos WHERE destaque = 1 ORDER BY id')
        return json_response(start_response, rows)
    if path.startswith('/api/projetos/') and method == 'GET':
        try: project_id = int(path.rsplit('/',1)[1])
        except ValueError: return json_response(start_response, {'erro':'Registro não encontrado.'}, '404 Not Found')
        p = db.consultar('SELECT * FROM projetos WHERE id = %s', (project_id,), um=True)
        return json_response(start_response, p or {'erro':'Registro não encontrado.'}, '200 OK' if p else '404 Not Found')
    if path == '/api/admin/projetos' and method == 'GET':
        return json_response(start_response, db.consultar('SELECT * FROM projetos ORDER BY id'))
    if path in ('/api/admin/projetos',) and method == 'POST' or path.startswith('/api/admin/projetos/') and method == 'PUT':
        data = read_json(environ)
        d = {c:str(data.get(c) or '').strip() for c in CAMPOS}
        if d['cor'] not in CORES: d['cor'] = 'roxo'
        d['destaque'] = 1 if data.get('destaque') else 0
        d['na_consulta'] = 1 if data.get('na_consulta') else 0
        if not d['nome'] or not d['descricao']:
            return json_response(start_response, {'erro':'Preencha o nome e a descrição do projeto.'}, '400 Bad Request')
        if method == 'POST':
            cols = ', '.join(d); marks = ', '.join(['%s']*len(d))
            new_id = db.executar(f'INSERT INTO projetos ({cols}) VALUES ({marks})', tuple(d.values()))
            return json_response(start_response, {'ok':True,'id':new_id}, '201 Created')
        try: project_id = int(path.rsplit('/',1)[1])
        except ValueError: return json_response(start_response, {'erro':'Registro não encontrado.'}, '404 Not Found')
        exists = db.consultar('SELECT id FROM projetos WHERE id = %s', (project_id,), um=True)
        if not exists: return json_response(start_response, {'erro':'Registro não encontrado.'}, '404 Not Found')
        sets = ', '.join(f'{c} = %s' for c in d)
        db.executar(f'UPDATE projetos SET {sets} WHERE id = %s', (*d.values(),project_id))
        return json_response(start_response, {'ok':True})
    if method == 'GET' and (path == '/' or path in ('/consulta','/contato','/sobre','/admin/projetos','/admin/projetos/novo') or path.startswith('/projetos/') or path.startswith('/admin/projetos/')):
        return static_file('index.html', start_response)
    return response(start_response, 'Página não encontrada.', '404 Not Found', 'text/plain; charset=utf-8')

if __name__ == '__main__':
    print('Reassocia disponível em http://127.0.0.1:5000')
    with make_server('127.0.0.1', 5000, app) as server:
        server.serve_forever()
