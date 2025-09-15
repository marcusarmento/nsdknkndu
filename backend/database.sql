-- Script de criação do banco de dados SDI
-- Execute este script no PostgreSQL para criar as tabelas necessárias

-- Criar banco de dados (execute como superusuário)
-- CREATE DATABASE sdi_db;
-- \c sdi_db;

-- ==================== TABELA DE PROCESSOS ====================
CREATE TABLE IF NOT EXISTS processos (
    id SERIAL PRIMARY KEY,
    numero_processo VARCHAR(50) NOT NULL UNIQUE,
    tipo_processo VARCHAR(100),
    especificacao TEXT,
    interessado VARCHAR(255),
    observacoes TEXT,
    nivel_acesso VARCHAR(20) CHECK (nivel_acesso IN ('publico', 'restrito', 'sigiloso')),
    tipo VARCHAR(20) CHECK (tipo IN ('recebido', 'gerado')),
    protocolo_tipo VARCHAR(20) CHECK (protocolo_tipo IN ('automatico', 'informado')),
    protocolo_numero_manual VARCHAR(50),
    protocolo_data DATE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP
);

-- ==================== TABELA DE CONTATOS ====================
CREATE TABLE IF NOT EXISTS contatos (
    id SERIAL PRIMARY KEY,
    natureza_contato VARCHAR(2) CHECK (natureza_contato IN ('pf', 'pj')),
    nome VARCHAR(255) NOT NULL,
    sigla VARCHAR(100),
    cpf VARCHAR(18),
    rg VARCHAR(20),
    data_nascimento DATE,
    email VARCHAR(255),
    telefone_fixo VARCHAR(20),
    telefone_celular VARCHAR(20),
    cep VARCHAR(10),
    endereco VARCHAR(255),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    uf VARCHAR(2),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP
);

-- ==================== TABELA DE BLOCOS ====================
CREATE TABLE IF NOT EXISTS blocos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP
);

-- ==================== TABELA DE PROCESSOS EM BLOCOS ====================
CREATE TABLE IF NOT EXISTS blocos_processos (
    id SERIAL PRIMARY KEY,
    bloco_id INTEGER REFERENCES blocos(id) ON DELETE CASCADE,
    processo_id INTEGER REFERENCES processos(id) ON DELETE CASCADE,
    sequencia INTEGER,
    anotacoes TEXT,
    adicionado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(bloco_id, processo_id)
);

-- ==================== TABELA DE DOCUMENTOS ====================
CREATE TABLE IF NOT EXISTS documentos (
    id SERIAL PRIMARY KEY,
    processo_id INTEGER REFERENCES processos(id) ON DELETE CASCADE,
    titulo VARCHAR(255) NOT NULL,
    tipo_documento VARCHAR(50),
    conteudo TEXT,
    arquivo_path VARCHAR(500),
    nivel_acesso VARCHAR(20) CHECK (nivel_acesso IN ('publico', 'restrito', 'sigiloso')),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP
);

-- ==================== TABELA DE USUÁRIOS (para autenticação futura) ====================
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    senha_hash VARCHAR(255),
    perfil VARCHAR(50) DEFAULT 'usuario',
    ativo BOOLEAN DEFAULT true,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP
);

-- ==================== ÍNDICES PARA PERFORMANCE ====================
CREATE INDEX IF NOT EXISTS idx_processos_tipo ON processos(tipo);
CREATE INDEX IF NOT EXISTS idx_processos_criado_em ON processos(criado_em);
CREATE INDEX IF NOT EXISTS idx_processos_numero ON processos(numero_processo);
CREATE INDEX IF NOT EXISTS idx_contatos_nome ON contatos(nome);
CREATE INDEX IF NOT EXISTS idx_contatos_cpf ON contatos(cpf);
CREATE INDEX IF NOT EXISTS idx_documentos_processo_id ON documentos(processo_id);

-- ==================== DADOS DE EXEMPLO ====================

-- Inserir alguns processos de exemplo
INSERT INTO processos (numero_processo, tipo_processo, especificacao, interessado, observacoes, nivel_acesso, tipo, protocolo_tipo) VALUES
('12500.101381/2022-87', 'ferias', 'Solicitação de férias', 'João Silva', 'Processo de férias do servidor', 'publico', 'recebido', 'automatico'),
('12500.101382/2022-88', 'abono', 'Solicitação de abono', 'Maria Santos', 'Abono por horas extras', 'restrito', 'gerado', 'automatico'),
('12500.101383/2022-89', 'adicional', 'Adicional noturno', 'Pedro Costa', 'Pagamento de adicional noturno', 'publico', 'recebido', 'automatico'),
('12500.101384/2022-90', 'outro', 'Solicitação de licença', 'Ana Oliveira', 'Licença para tratamento de saúde', 'sigiloso', 'gerado', 'informado');

-- Inserir alguns contatos de exemplo
INSERT INTO contatos (natureza_contato, nome, sigla, cpf, email, telefone_celular, cidade, uf) VALUES
('pf', 'João Silva', 'JS', '12345678900', 'joao.silva@email.com', '11999999999', 'São Paulo', 'SP'),
('pf', 'Maria Santos', 'MS', '98765432100', 'maria.santos@email.com', '11888888888', 'São Paulo', 'SP'),
('pf', 'Pedro Costa', 'PC', '45678912300', 'pedro.costa@email.com', '11777777777', 'Rio de Janeiro', 'RJ'),
('pj', 'Empresa ABC Ltda', 'ABC', '12345678000190', 'contato@empresaabc.com', '1133333333', 'São Paulo', 'SP');

-- Inserir alguns blocos de exemplo
INSERT INTO blocos (nome, descricao) VALUES
('Bloco de Assinatura 1', 'Bloco para processos de pessoal'),
('Bloco de Assinatura 2', 'Bloco para processos administrativos'),
('Bloco de Assinatura 3', 'Bloco para processos financeiros');

-- Inserir alguns documentos de exemplo
INSERT INTO documentos (processo_id, titulo, tipo_documento, conteudo, nivel_acesso) VALUES
(1, 'Solicitação de Férias', 'oficio', 'Conteúdo do ofício de solicitação de férias...', 'publico'),
(2, 'Solicitação de Abono', 'oficio', 'Conteúdo do ofício de solicitação de abono...', 'restrito'),
(3, 'Solicitação de Adicional', 'oficio', 'Conteúdo do ofício de solicitação de adicional...', 'publico');

-- ==================== COMENTÁRIOS DAS TABELAS ====================
COMMENT ON TABLE processos IS 'Tabela principal de processos do sistema SDI';
COMMENT ON TABLE contatos IS 'Tabela de contatos (pessoas físicas e jurídicas)';
COMMENT ON TABLE blocos IS 'Tabela de blocos de assinatura';
COMMENT ON TABLE blocos_processos IS 'Tabela de relacionamento entre blocos e processos';
COMMENT ON TABLE documentos IS 'Tabela de documentos anexados aos processos';
COMMENT ON TABLE usuarios IS 'Tabela de usuários do sistema (para autenticação futura)';

-- ==================== GRANTS (opcional) ====================
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;
