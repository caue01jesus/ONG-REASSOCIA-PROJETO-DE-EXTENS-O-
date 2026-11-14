CREATE DATABASE IF NOT EXISTS reassocia CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE reassocia;

CREATE TABLE IF NOT EXISTS projetos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    resumo VARCHAR(120),
    descricao TEXT NOT NULL,
    objetivos TEXT,
    publico_atendido VARCHAR(255),
    acoes_realizadas TEXT,
    cor VARCHAR(10) NOT NULL DEFAULT 'roxo',
    destaque TINYINT(1) NOT NULL DEFAULT 1,
    na_consulta TINYINT(1) NOT NULL DEFAULT 0,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO projetos (nome, resumo, descricao, objetivos, publico_atendido, acoes_realizadas, cor, destaque, na_consulta) VALUES
('Beleza e Estética', 'Cuide de você e do seu futuro', 'Curso de capacitação profissional em beleza e estética.', 'Formar profissionais para o mercado de beleza.', 'Jovens e adultos da comunidade', 'Aulas práticas e oficinas.', 'roxo', 1, 0),
('Confeitaria', 'Do básico ao profissional', 'Curso de confeitaria, do básico ao profissional.', 'Gerar renda por meio da confeitaria.', 'Jovens e adultos da comunidade', 'Aulas práticas e oficinas.', 'verde', 1, 0),
('Gastronomia', 'Sabores que transformam', 'Curso de gastronomia voltado à geração de renda.', 'Preparar alunos para atuar na área de alimentação.', 'Jovens e adultos da comunidade', 'Aulas práticas e oficinas.', 'laranja', 1, 0),
('Pediatria', 'Cuidado e atenção infantil', 'Ação de cuidado e atenção à saúde infantil.', 'Orientar famílias sobre a saúde das crianças.', 'Crianças e famílias', 'Atendimentos e orientações.', 'verde', 1, 0),
('Nutrição', 'Saúde e alimentação', 'Ação de orientação sobre saúde e alimentação.', 'Promover hábitos alimentares saudáveis.', 'Comunidade em geral', 'Atendimentos e palestras.', 'azul', 1, 0),
('Cardiologia', 'Seu coração em boas mãos', 'Ação de cuidado com a saúde do coração.', 'Prevenir e orientar sobre doenças cardiovasculares.', 'Comunidade em geral', 'Consultas e orientações.', 'rosa', 1, 1),
('Fisioterapia', 'Cuidado que move você', 'Ação de fisioterapia para a comunidade.', 'Melhorar a mobilidade e a qualidade de vida.', 'Comunidade em geral', 'Atendimentos e orientações.', 'laranja', 0, 1);
