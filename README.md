# Reassocia ONG – Site do Projeto de Extensão

Site institucional da **Reassocia**, ONG localizada em Jardim Catarina, São Gonçalo (RJ), que atua com o lema **Acolher • Capacitar • Transformar**.

O site divulga os cursos de capacitação e as ações de saúde da ONG, permite agendar consultas e iniciar doações pelo WhatsApp e oferece uma área administrativa para cadastrar e editar projetos.

## Funcionalidades

**Para o visitante**
- Página inicial com os projetos em destaque
- Busca de projetos por nome, resumo ou descrição
- Página de detalhes de cada projeto (descrição, objetivos, público atendido e ações realizadas)
- Página de consulta, com os projetos de saúde e botão para agendar pelo WhatsApp
- Página de contato, com endereço, WhatsApp, Instagram e botão "Quero doar"
- Página "Sobre"

**Para o administrador**
- Listagem de todos os projetos
- Cadastro de novo projeto
- Edição de projeto, incluindo cor do card e onde ele aparece (início e/ou consulta)

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Front-end | HTML, CSS e JavaScript puro (aplicação de página única) |
| Back-end | Python 3 com servidor WSGI (`wsgiref`), sem framework |
| Banco de dados | MySQL, acessado com `mysql-connector-python` |

## Estrutura do projeto

```
.
├── app.py            # Servidor WSGI: arquivos estáticos e API REST
├── config.py         # Configurações (banco, contatos da ONG)
├── db.py             # Conexão e funções de consulta ao MySQL
├── schema.sql        # Criação do banco, da tabela e dos projetos iniciais
├── requirements.txt  # Dependências Python
└── static/
    ├── index.html    # Página única
    ├── css/style.css # Estilos
    └── js/main.js    # Rotas, telas e chamadas à API
```

## Como executar

### Pré-requisitos
- Python 3.10 ou superior
- MySQL em execução

### Passo a passo

1. Clone o repositório e entre na pasta do projeto.

2. (Opcional) Crie e ative um ambiente virtual:

   ```bash
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # Linux/macOS
   source venv/bin/activate
   ```

3. Instale as dependências:

   ```bash
   pip install -r requirements.txt
   ```

4. Crie o banco de dados e a tabela:

   ```bash
   mysql -u root -p < schema.sql
   ```

5. Configure as variáveis de ambiente (veja a seção abaixo). Se não configurar, valem os valores padrão de `config.py`.

6. Inicie o servidor:

   ```bash
   python app.py
   ```

7. Abra no navegador: **http://127.0.0.1:5000**

## Configuração

As configurações são lidas de variáveis de ambiente, com valores padrão em `config.py`.

| Variável | Descrição | Padrão |
|---|---|---|
| `DB_HOST` | Servidor do MySQL | `localhost` |
| `DB_USER` | Usuário do MySQL | `root` |
| `DB_PASSWORD` | Senha do MySQL | valor de desenvolvimento em `config.py` |
| `DB_NAME` | Nome do banco | `reassocia` |
| `WHATSAPP` | WhatsApp da ONG, só números, com DDI e DDD (ex.: `5521999999999`) | número de exemplo |
| `INSTAGRAM` | Link do Instagram da ONG | `https://www.instagram.com/` |
| `FACEBOOK` | Link do Facebook da ONG | `https://www.facebook.com/` |

## Páginas

| Rota | Descrição |
|---|---|
| `/` | Início, com projetos em destaque e busca (`/?q=termo`) |
| `/projetos/{id}` | Detalhes de um projeto |
| `/consulta` | Agendamento de consulta pelo WhatsApp |
| `/contato` | Localização, contatos e doação |
| `/sobre` | Apresentação da ONG |
| `/admin/projetos` | Lista de projetos (administração) |
| `/admin/projetos/novo` | Cadastro de projeto |
| `/admin/projetos/{id}/editar` | Edição de projeto |

## API

| Método | Rota | Função |
|---|---|---|
| GET | `/api/config` | Contatos da ONG e cores disponíveis |
| GET | `/api/projetos` | Projetos em destaque; aceita `?q=termo` (busca) e `?consulta=1` (projetos de consulta) |
| GET | `/api/projetos/{id}` | Detalhes de um projeto |
| GET | `/api/admin/projetos` | Todos os projetos |
| POST | `/api/admin/projetos` | Cadastra um projeto (`nome` e `descricao` obrigatórios) |
| PUT | `/api/admin/projetos/{id}` | Edita um projeto |

## Banco de dados

Tabela `projetos`:

| Campo | Tipo | Observação |
|---|---|---|
| `id` | INT | Chave primária, auto incremento |
| `nome` | VARCHAR(150) | Obrigatório |
| `resumo` | VARCHAR(120) | Texto curto do card |
| `descricao` | TEXT | Obrigatório |
| `objetivos` | TEXT | Opcional |
| `publico_atendido` | VARCHAR(255) | Opcional |
| `acoes_realizadas` | TEXT | Opcional |
| `cor` | VARCHAR(10) | `roxo`, `verde`, `laranja`, `azul` ou `rosa` |
| `destaque` | TINYINT(1) | 1 = aparece na página inicial |
| `na_consulta` | TINYINT(1) | 1 = aparece na página de consulta |
| `criado_em` / `atualizado_em` | TIMESTAMP | Preenchidos automaticamente |

O `schema.sql` já cadastra os projetos iniciais: Beleza e Estética, Confeitaria, Gastronomia, Pediatria, Nutrição, Cardiologia e Fisioterapia.

## Segurança

- Consultas ao banco parametrizadas, contra SQL Injection
- Texto escapado antes de ser exibido, contra XSS
- Bloqueio de acesso a arquivos fora da pasta `static`

**Limitação atual:** as rotas de administração (`/admin/...` e `/api/admin/...`) ainda **não exigem login**. Antes de colocar o site no ar, é recomendável implementar autenticação do administrador ou restringir o acesso a essas rotas.

## Contato da ONG

Reassocia ONG  
Lote 02, Quadra 35, R. Américo Miranda, S/N – Jardim Catarina, São Gonçalo – RJ, 24716-455

## Licença

Distribuído sob a licença do arquivo [LICENSE](LICENSE).
