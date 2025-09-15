// Script para testar se o servidor está funcionando
const fetch = require('node-fetch');

async function testServer() {
    try {
        console.log('Testando conexão com o servidor...');
        
        // Teste 1: Verificar se o servidor está rodando
        const response = await fetch('http://localhost:3000/api/processos');
        
        console.log('Status da resposta:', response.status);
        console.log('Headers:', response.headers.get('content-type'));
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Servidor funcionando! Dados recebidos:', data.length, 'processos');
        } else {
            const text = await response.text();
            console.log('❌ Erro no servidor:');
            console.log('Status:', response.status);
            console.log('Resposta:', text.substring(0, 200) + '...');
        }
        
    } catch (error) {
        console.log('❌ Erro de conexão:', error.message);
        console.log('Verifique se:');
        console.log('1. O servidor está rodando (npm start no diretório backend)');
        console.log('2. O PostgreSQL está rodando');
        console.log('3. O banco sdi_db foi criado');
    }
}

testServer();
