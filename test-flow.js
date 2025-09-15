// Script para testar o fluxo completo de criação de processo e documento
const fetch = require('node-fetch');

const API_BASE = 'http://localhost:3000/api';

async function testCompleteFlow() {
    console.log('🚀 Iniciando teste do fluxo completo...\n');

    try {
        // 1. Testar criação de processo
        console.log('1️⃣ Testando criação de processo...');
        const processoData = {
            numero_processo: `TESTE-${Date.now()}`,
            tipo_processo: 'ferias',
            especificacao: 'Processo de teste automatizado',
            interessado: 'Usuário Teste',
            observacoes: 'Processo criado para teste',
            nivel_acesso: 'publico',
            tipo: 'gerado',
            protocolo_tipo: 'automatico'
        };

        const processoResponse = await fetch(`${API_BASE}/processos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(processoData)
        });

        if (!processoResponse.ok) {
            throw new Error(`Erro ao criar processo: ${processoResponse.status}`);
        }

        const processo = await processoResponse.json();
        console.log(`✅ Processo criado com ID: ${processo.id}`);

        // 2. Testar criação de documento
        console.log('\n2️⃣ Testando criação de documento...');
        const documentoData = {
            processo_id: processo.id,
            titulo: 'Memorando de Teste',
            tipo_documento: 'Memorando',
            conteudo: 'MEMORANDO DE TESTE\n\nEste é um documento de teste criado automaticamente.',
            nivel_acesso: 'publico'
        };

        const documentoResponse = await fetch(`${API_BASE}/documentos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(documentoData)
        });

        if (!documentoResponse.ok) {
            throw new Error(`Erro ao criar documento: ${documentoResponse.status}`);
        }

        const documento = await documentoResponse.json();
        console.log(`✅ Documento criado com ID: ${documento.id}`);

        // 3. Testar busca de processo com documentos
        console.log('\n3️⃣ Testando busca de processo com documentos...');
        const processoCompletoResponse = await fetch(`${API_BASE}/processos/${processo.id}`);
        const processoCompleto = await processoCompletoResponse.json();
        console.log(`✅ Processo encontrado: ${processoCompleto.numero_processo}`);

        const documentosResponse = await fetch(`${API_BASE}/documentos?processo_id=${processo.id}`);
        const documentos = await documentosResponse.json();
        console.log(`✅ Documentos encontrados: ${documentos.length}`);

        // 4. Testar atualização de processo
        console.log('\n4️⃣ Testando atualização de processo...');
        const updateData = {
            ...processoCompleto,
            observacoes: 'Processo atualizado com sucesso'
        };

        const updateResponse = await fetch(`${API_BASE}/processos/${processo.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData)
        });

        if (!updateResponse.ok) {
            throw new Error(`Erro ao atualizar processo: ${updateResponse.status}`);
        }

        console.log('✅ Processo atualizado com sucesso');

        // 5. Testar exclusão de documento
        console.log('\n5️⃣ Testando exclusão de documento...');
        const deleteDocResponse = await fetch(`${API_BASE}/documentos/${documento.id}`, {
            method: 'DELETE'
        });

        if (!deleteDocResponse.ok) {
            throw new Error(`Erro ao excluir documento: ${deleteDocResponse.status}`);
        }

        console.log('✅ Documento excluído com sucesso');

        // 6. Testar exclusão de processo
        console.log('\n6️⃣ Testando exclusão de processo...');
        const deleteProcessoResponse = await fetch(`${API_BASE}/processos/${processo.id}`, {
            method: 'DELETE'
        });

        if (!deleteProcessoResponse.ok) {
            throw new Error(`Erro ao excluir processo: ${deleteProcessoResponse.status}`);
        }

        console.log('✅ Processo excluído com sucesso');

        console.log('\n🎉 FLUXO COMPLETO TESTADO COM SUCESSO!');
        console.log('\n📋 Resumo do teste:');
        console.log('   ✅ Criação de processo');
        console.log('   ✅ Criação de documento');
        console.log('   ✅ Busca de dados');
        console.log('   ✅ Atualização de processo');
        console.log('   ✅ Exclusão de documento');
        console.log('   ✅ Exclusão de processo');

    } catch (error) {
        console.error('❌ Erro no teste:', error.message);
        console.log('\n🔧 Verifique se:');
        console.log('   1. O servidor está rodando (npm start no diretório backend)');
        console.log('   2. O banco de dados está configurado');
        console.log('   3. As tabelas foram criadas (execute database.sql)');
    }
}

// Executar teste
testCompleteFlow();
