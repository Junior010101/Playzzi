-- Segure (Alt + X) para realizar o cadastro de um novo quiz no sistema

-- 0. Marca quizzes anteriores como não recentes (se existirem)
UPDATE Quiz
SET e_recente = 0
WHERE e_recente = 1;

-- 1. Cria o Quiz
INSERT INTO Quiz (titulo, descricao, dificuldade, area, imagem_url, mais_jogado, e_recente)
VALUES (
	'Algoritmos',
	'Os algoritmos movem o mundo digital, mas será que você consegue prever como eles funcionam? Teste seus conhecimentos sobre estruturas de dados, eficiência, ordenação e lógica computacional neste quiz rápido e desafiador.',
	3,
	'Programação',
	'raw.githubusercontent.com/junior010101/playzzi-media/main/repo/algoritmos.webp',
	0,
	1
);

-- Questão 1
INSERT INTO Questao (quiz_id, enunciado, explicacao)
SELECT id, 'Enunciado da questão 1', 'Explicação da questão 1'
FROM Quiz
WHERE rowid = (SELECT MAX(rowid) FROM Quiz);

INSERT INTO Alternativa (n_alternativa, questao_id, texto, e_correta)
SELECT 1, (SELECT id FROM Questao WHERE rowid = (SELECT MAX(rowid) FROM Questao)), 'Alternativa A', 0
UNION ALL
SELECT 2, (SELECT id FROM Questao WHERE rowid = (SELECT MAX(rowid) FROM Questao)), 'Alternativa B', 1
UNION ALL
SELECT 3, (SELECT id FROM Questao WHERE rowid = (SELECT MAX(rowid) FROM Questao)), 'Alternativa C', 0
UNION ALL
SELECT 4, (SELECT id FROM Questao WHERE rowid = (SELECT MAX(rowid) FROM Questao)), 'Alternativa D', 0;

-- Questão 2
INSERT INTO Questao (quiz_id, enunciado, explicacao)
SELECT id, 'Enunciado da questão 2', 'Explicação da questão 2'
FROM Quiz
WHERE rowid = (SELECT MAX(rowid) FROM Quiz);

INSERT INTO Alternativa (n_alternativa, questao_id, texto, e_correta)
SELECT 1, (SELECT id FROM Questao WHERE rowid = (SELECT MAX(rowid) FROM Questao)), 'Alternativa A', 0
UNION ALL
SELECT 2, (SELECT id FROM Questao WHERE rowid = (SELECT MAX(rowid) FROM Questao)), 'Alternativa B', 1
UNION ALL
SELECT 3, (SELECT id FROM Questao WHERE rowid = (SELECT MAX(rowid) FROM Questao)), 'Alternativa C', 0
UNION ALL
SELECT 4, (SELECT id FROM Questao WHERE rowid = (SELECT MAX(rowid) FROM Questao)), 'Alternativa D', 0;

-- Questão 3
INSERT INTO Questao (quiz_id, enunciado, explicacao)
SELECT id, 'Enunciado da questão 3', 'Explicação da questão 3'
FROM Quiz
WHERE rowid = (SELECT MAX(rowid) FROM Quiz);

INSERT INTO Alternativa (n_alternativa, questao_id, texto, e_correta)
SELECT 1, (SELECT id FROM Questao WHERE rowid = (SELECT MAX(rowid) FROM Questao)), 'Alternativa A', 0
UNION ALL
SELECT 2, (SELECT id FROM Questao WHERE rowid = (SELECT MAX(rowid) FROM Questao)), 'Alternativa B', 1
UNION ALL
SELECT 3, (SELECT id FROM Questao WHERE rowid = (SELECT MAX(rowid) FROM Questao)), 'Alternativa C', 0
UNION ALL
SELECT 4, (SELECT id FROM Questao WHERE rowid = (SELECT MAX(rowid) FROM Questao)), 'Alternativa D', 0;

-- Questão 4
INSERT INTO Questao (quiz_id, enunciado, explicacao)
SELECT id, 'Enunciado da questão 4', 'Explicação da questão 4'
FROM Quiz
WHERE rowid = (SELECT MAX(rowid) FROM Quiz);

INSERT INTO Alternativa (n_alternativa, questao_id, texto, e_correta)
SELECT 1, (SELECT id FROM Questao WHERE rowid = (SELECT MAX(rowid) FROM Questao)), 'Alternativa A', 0
UNION ALL
SELECT 2, (SELECT id FROM Questao WHERE rowid = (SELECT MAX(rowid) FROM Questao)), 'Alternativa B', 1
UNION ALL
SELECT 3, (SELECT id FROM Questao WHERE rowid = (SELECT MAX(rowid) FROM Questao)), 'Alternativa C', 0
UNION ALL
SELECT 4, (SELECT id FROM Questao WHERE rowid = (SELECT MAX(rowid) FROM Questao)), 'Alternativa D', 0;

-- Questão 5
INSERT INTO Questao (quiz_id, enunciado, explicacao)
SELECT id, 'Enunciado da questão 5', 'Explicação da questão 5'
FROM Quiz
WHERE rowid = (SELECT MAX(rowid) FROM Quiz);

INSERT INTO Alternativa (n_alternativa, questao_id, texto, e_correta)
SELECT 1, (SELECT id FROM Questao WHERE rowid = (SELECT MAX(rowid) FROM Questao)), 'Alternativa A', 0
UNION ALL
SELECT 2, (SELECT id FROM Questao WHERE rowid = (SELECT MAX(rowid) FROM Questao)), 'Alternativa B', 1
UNION ALL
SELECT 3, (SELECT id FROM Questao WHERE rowid = (SELECT MAX(rowid) FROM Questao)), 'Alternativa C', 0
UNION ALL
SELECT 4, (SELECT id FROM Questao WHERE rowid = (SELECT MAX(rowid) FROM Questao)), 'Alternativa D', 0;

-- Questão 6
INSERT INTO Questao (quiz_id, enunciado, explicacao)
SELECT id, 'Enunciado da questão 6', 'Explicação da questão 6'
FROM Quiz
WHERE rowid = (SELECT MAX(rowid) FROM Quiz);

INSERT INTO Alternativa (n_alternativa, questao_id, texto, e_correta)
SELECT 1, (SELECT id FROM Questao WHERE rowid = (SELECT MAX(rowid) FROM Questao)), 'Alternativa A', 0
UNION ALL
SELECT 2, (SELECT id FROM Questao WHERE rowid = (SELECT MAX(rowid) FROM Questao)), 'Alternativa B', 1
UNION ALL
SELECT 3, (SELECT id FROM Questao WHERE rowid = (SELECT MAX(rowid) FROM Questao)), 'Alternativa C', 0
UNION ALL
SELECT 4, (SELECT id FROM Questao WHERE rowid = (SELECT MAX(rowid) FROM Questao)), 'Alternativa D', 0;

-- Questão 7
INSERT INTO Questao (quiz_id, enunciado, explicacao)
SELECT id, 'Enunciado da questão 7', 'Explicação da questão 7'
FROM Quiz
WHERE rowid = (SELECT MAX(rowid) FROM Quiz);

INSERT INTO Alternativa (n_alternativa, questao_id, texto, e_correta)
SELECT 1, (SELECT id FROM Questao WHERE rowid = (SELECT MAX(rowid) FROM Questao)), 'Alternativa A', 0
UNION ALL
SELECT 2, (SELECT id FROM Questao WHERE rowid = (SELECT MAX(rowid) FROM Questao)), 'Alternativa B', 1
UNION ALL
SELECT 3, (SELECT id FROM Questao WHERE rowid = (SELECT MAX(rowid) FROM Questao)), 'Alternativa C', 0
UNION ALL
SELECT 4, (SELECT id FROM Questao WHERE rowid = (SELECT MAX(rowid) FROM Questao)), 'Alternativa D', 0;

-- Questão 8
INSERT INTO Questao (quiz_id, enunciado, explicacao)
SELECT id, 'Enunciado da questão 8', 'Explicação da questão 8'
FROM Quiz
WHERE rowid = (SELECT MAX(rowid) FROM Quiz);

INSERT INTO Alternativa (n_alternativa, questao_id, texto, e_correta)
SELECT 1, (SELECT id FROM Questao WHERE rowid = (SELECT MAX(rowid) FROM Questao)), 'Alternativa A', 0
UNION ALL
SELECT 2, (SELECT id FROM Questao WHERE rowid = (SELECT MAX(rowid) FROM Questao)), 'Alternativa B', 1
UNION ALL
SELECT 3, (SELECT id FROM Questao WHERE rowid = (SELECT MAX(rowid) FROM Questao)), 'Alternativa C', 0
UNION ALL
SELECT 4, (SELECT id FROM Questao WHERE rowid = (SELECT MAX(rowid) FROM Questao)), 'Alternativa D', 0;

-- Questão 9
INSERT INTO Questao (quiz_id, enunciado, explicacao)
SELECT id, 'Enunciado da questão 9', 'Explicação da questão 9'
FROM Quiz
WHERE rowid = (SELECT MAX(rowid) FROM Quiz);

INSERT INTO Alternativa (n_alternativa, questao_id, texto, e_correta)
SELECT 1, (SELECT id FROM Questao WHERE rowid = (SELECT MAX(rowid) FROM Questao)), 'Alternativa A', 0
UNION ALL
SELECT 2, (SELECT id FROM Questao WHERE rowid = (SELECT MAX(rowid) FROM Questao)), 'Alternativa B', 1
UNION ALL
SELECT 3, (SELECT id FROM Questao WHERE rowid = (SELECT MAX(rowid) FROM Questao)), 'Alternativa C', 0
UNION ALL
SELECT 4, (SELECT id FROM Questao WHERE rowid = (SELECT MAX(rowid) FROM Questao)), 'Alternativa D', 0;

-- Questão 10
INSERT INTO Questao (quiz_id, enunciado, explicacao)
SELECT id, 'Enunciado da questão 10', 'Explicação da questão 10'
FROM Quiz
WHERE rowid = (SELECT MAX(rowid) FROM Quiz);

INSERT INTO Alternativa (n_alternativa, questao_id, texto, e_correta)
SELECT 1, (SELECT id FROM Questao WHERE rowid = (SELECT MAX(rowid) FROM Questao)), 'Alternativa A', 0
UNION ALL
SELECT 2, (SELECT id FROM Questao WHERE rowid = (SELECT MAX(rowid) FROM Questao)), 'Alternativa B', 1
UNION ALL
SELECT 3, (SELECT id FROM Questao WHERE rowid = (SELECT MAX(rowid) FROM Questao)), 'Alternativa C', 0
UNION ALL
SELECT 4, (SELECT id FROM Questao WHERE rowid = (SELECT MAX(rowid) FROM Questao)), 'Alternativa D', 0;
