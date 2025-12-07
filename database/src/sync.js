require('dotenv').config();
const { sequelize } = require('./models');

const syncDatabase = async () => {
  try {
    console.log('🔄 Iniciando sincronização do banco de dados...');
    
    // force: true -> Apaga e recria todas as tabelas (USE COM CUIDADO!)
    // alter: true -> Altera tabelas para corresponder aos modelos
    await sequelize.sync({ alter: true });
    
    console.log('✅ Banco de dados sincronizado com sucesso!');
    console.log('📋 Tabelas criadas:');
    console.log('   - usuarios');
    console.log('   - turmas');
    console.log('   - turma_usuarios');
    console.log('   - eventos');
    console.log('   - evento_usuarios');
    console.log('   - marcadores');
    console.log('   - frequencias');
    console.log('   - configuracao_notificacoes');
    console.log('   - configuracao_acessibilidade');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao sincronizar banco de dados:', error);
    process.exit(1);
  }
};

syncDatabase();
