

const { Client } = require('pg');

const connectionString = 'postgresql://postgres:JDFVXUSacQelvjqLVwgLjvBUSNibSHFY@crossover.proxy.rlwy.net:40425/railway';

const client = new Client({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function limpar() {
  try {
    console.log('🔌 Conectando ao banco...');
    await client.connect();

    console.log('Apagando TODAS as voltas (Laps)...');

    await client.query('DELETE FROM lap'); 
    
    console.log('Tabela de voltas limpa com sucesso!');
  } catch (err) {
    console.error('Erro:', err.message);
  } finally {
    await client.end();
    console.log('Conexão fechada.');
  }
}

limpar();