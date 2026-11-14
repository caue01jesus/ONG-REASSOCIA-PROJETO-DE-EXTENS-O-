# Reassocia ONG — Python WSGI + MySQL, sem Flask e sem Jinja2

O projeto foi reorganizado para não usar Jinja2: as páginas são HTML estático em `static/index.html`, e `static/js/main.js` busca os dados pela API JSON do Flask. O backend usa apenas a biblioteca padrão WSGI do Python e o conector MySQL. Não usa Flask, Jinja2 nem mecanismo de templates.

## Como executar no Windows

```powershell
py -m venv venv
.\venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

No MySQL, execute `schema.sql` se ainda não criou o banco/tabela. Configure a senha no PowerShell:

```powershell
$env:DB_PASSWORD="SUA_SENHA_DO_MYSQL"
python app.py
```

Acesse http://127.0.0.1:5000.

## Páginas
- `/` início e busca de projetos
- `/consulta`, `/contato`, `/sobre`
- `/projetos/ID` detalhe do projeto
- `/admin/projetos` lista e administração
- `/admin/projetos/novo` cadastro
- `/admin/projetos/ID/editar` edição

## API
- `GET /api/config`
- `GET /api/projetos`, `GET /api/projetos/ID`
- `GET /api/admin/projetos`
- `POST /api/admin/projetos`
- `PUT /api/admin/projetos/ID`

Não há pasta `templates`, `render_template`, macros, blocos, variáveis ou condicionais Jinja2. Também não há dependência Flask: o servidor usa `wsgiref` da biblioteca padrão. Os dados são inseridos no HTML pelo JavaScript após chamadas à API.

Em `config.py`, configure `WHATSAPP`, `INSTAGRAM`, `FACEBOOK` e a conexão do banco conforme os dados reais.
