require('dotenv').config();
const express = require('express');
const sequelize = require('./src/config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS - Permitir requisições do Angular
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importar rotas
const routes = require('./src/routes');
app.use('/api', routes);

// Rota de teste
app.get('/', (req, res) => {
  res.json({ 
    message: 'API do Sistema EPIS - Eventos e Turmas',
    version: '1.0.0'
  });
});

// Testar conexão com o banco
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com MySQL estabelecida com sucesso!');
    
    await sequelize.sync({ alter: true });
    console.log('✅ Banco de dados sincronizado com sucesso!');
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📝 Acesse: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Erro ao conectar com o banco de dados:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;