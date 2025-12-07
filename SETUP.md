# 📅 Calendário Backend - Guia de Setup

Instruções para configurar e rodar o projeto em outra máquina.

## ✅ Pré-requisitos

Antes de começar, certifique-se de que você tem instalado:

1. **Node.js** (v14.0 ou superior)
   - Baixe em: https://nodejs.org/
   - Verifique: `node --version`

2. **npm** (geralmente vem com Node.js)
   - Verifique: `npm --version`

3. **MySQL Server** (v5.7 ou superior)
   - Windows: https://dev.mysql.com/downloads/mysql/
   - macOS: `brew install mysql`
   - Linux: `sudo apt-get install mysql-server`

## 📥 Passo 1: Clonar o Repositório

```bash
git clone https://github.com/vitincmf/Calendario.git
cd Calendario
git checkout database
```

## 🗄️ Passo 2: Configurar MySQL

### 2.1 Iniciar o MySQL

**Windows:**
```powershell
# MySQL deve estar rodando como serviço
# Verifique em Serviços do Windows
```

**macOS/Linux:**
```bash
mysql.server start
# ou
sudo systemctl start mysql
```

### 2.2 Criar Usuário e Banco de Dados

Conecte ao MySQL como root:

```bash
mysql -u root -p
```

Execute os seguintes comandos SQL:

```sql
-- Criar usuário (se não existir)
CREATE USER IF NOT EXISTS 'root'@'localhost' IDENTIFIED BY 'epis';

-- Dar todas as permissões
GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost';

-- Recarregar permissões
FLUSH PRIVILEGES;

-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS epis_database;

-- Sair
EXIT;
```

## 📦 Passo 3: Instalar Dependências

```bash
npm install
```

## 🔧 Passo 4: Configurar Variáveis de Ambiente

Na raiz do projeto, crie um arquivo `.env` (ou copie o existente):

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=epis
DB_NAME=epis_database
DB_PORT=3306
PORT=3000
```

**⚠️ IMPORTANTE:** Ajuste as variáveis conforme sua configuração do MySQL:
- `DB_HOST`: Host do MySQL (padrão: localhost)
- `DB_USER`: Usuário do MySQL (padrão: root)
- `DB_PASSWORD`: Senha do MySQL (ajuste conforme configurado)
- `DB_NAME`: Nome do banco de dados (padrão: epis_database)
- `DB_PORT`: Porta do MySQL (padrão: 3306)
- `PORT`: Porta onde o servidor rodará (padrão: 3000)

## 🚀 Passo 5: Sincronizar Banco de Dados

Execute o script de sincronização para criar as tabelas:

```bash
npm run sync
```

Você deve ver mensagens como:
```
🔄 Iniciando sincronização do banco de dados...
✅ Banco de dados sincronizado com sucesso!
```

## ▶️ Passo 6: Rodar o Servidor

### Modo Produção:
```bash
npm start
```

### Modo Desenvolvimento (com auto-reload):
```bash
npm run dev
```

O servidor deve exibir:
```
✅ Conexão com MySQL estabelecida com sucesso!
✅ Banco de dados sincronizado com sucesso!
🚀 Servidor rodando na porta 3000
📝 Acesse: http://localhost:3000
```

## 🧪 Testar a API

Acesse em seu navegador:
```
http://localhost:3000
```

Deve retornar:
```json
{
  "message": "API do Sistema EPIS - Eventos e Turmas",
  "version": "1.0.0"
}
```

## 📋 Scripts Disponíveis

```bash
npm start      # Inicia o servidor em produção
npm run dev    # Inicia com nodemon (auto-reload)
npm run sync   # Sincroniza o banco de dados
```

## 🐛 Troubleshooting

### Erro: "Access denied for user 'root'@'localhost'"
- Verifique se o MySQL está rodando
- Verifique a senha no `.env` (deve ser `epis`)
- Verifique se o usuário `root` foi criado com a senha correta

### Erro: "ER_BAD_DB_ERROR: Unknown database"
- Execute `npm run sync` para criar as tabelas
- Verifique se o banco `epis_database` existe

### Erro: "connect ECONNREFUSED"
- MySQL não está rodando
- Inicie o MySQL e tente novamente

### Porta 3000 já em uso
- Mude a porta no `.env`: `PORT=3001`
- Ou feche o aplicativo que está usando a porta 3000

## 📂 Estrutura do Projeto

```
Calendario/
├── database/
│   └── src/
│       ├── app.js              # Aplicação Express
│       ├── sync.js             # Script de sincronização
│       ├── config/
│       │   └── database.js      # Configuração Sequelize
│       ├── models/             # Modelos do banco
│       ├── controllers/        # Controllers da API
│       └── routes/             # Rotas da API
├── server.js                   # Arquivo principal
├── package.json                # Dependências
├── .env                        # Variáveis de ambiente
└── SETUP.md                    # Este arquivo
```

## 📚 Tabelas do Banco de Dados

O projeto cria automaticamente as seguintes tabelas:

- `usuarios` - Usuários do sistema
- `turmas` - Turmas/classes
- `turmas_usuarios` - Relacionamento usuário-turma
- `eventos` - Eventos/atividades
- `eventos_usuarios` - Relacionamento evento-usuário
- `marcadores` - Marcadores de eventos
- `frequencias` - Controle de frequência
- `configuracoes_notificacao` - Configurações de notificação
- `configuracoes_acessibilidade` - Configurações de acessibilidade

## 🤝 Suporte

Se encontrar problemas:
1. Verifique se todos os pré-requisitos estão instalados
2. Confirme que MySQL está rodando
3. Revise o arquivo `.env`
4. Consulte os logs de erro no terminal

## 📝 Notas

- O arquivo `.env` contém dados sensíveis - não faça commit dessa arquivo em produção
- O banco está configurado com `alter: true`, que modifica tabelas existentes automaticamente
- Use `npm run dev` durante o desenvolvimento para auto-reload

---

**Versão:** 1.0.0  
**Última atualização:** Dezembro 2025
