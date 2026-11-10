<!-- markdownlint-disable MD033 -->
# 🏆 Playzzi

<picture>![Status](https://img.shields.io/badge/status-Em_Desenvolvimento-yellow)</picture>
<picture>![Status](https://img.shields.io/badge/HTML-5-red?logo=html5)</picture>
<picture>![Status](https://img.shields.io/badge/CSS-8A2BE2?logo=css)</picture>
<picture>![Status](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)</picture>

## 📌 Tema e Objetivo da Aplicação

O **Playzzi** é um site de quiz educacional voltado exclusivamente para a **área de TI** (programação, banco de dados e engenharia). Desenvolvido como projeto de avaliação da 2ª Unidade para a matéria de **Web Coding** ministrada pelo professor Vitor, o objetivo da plataforma é proporcionar desafios interativos de conhecimento técnico com contagem de tempo, sistema de pontuação automática, ranking de desempenho e uma página especial de vendas da proposta do projeto.

---

## 👥 Integrantes do Grupo

- **Alvaro Jose Gomes de Oliveira** — Matrícula: `01905147`
- **Victor Gabriel Fernandes da Silva** — Matrícula: `01901934`
- **Marcondes Paixão Silva de Albuquerque Junior** — Matrícula: `01901595`
- **Joao Pedro Machado Farias** — Matrícula: `01893626`

---

## ⚙️ Divisão de Responsabilidades

- **Design:** Álvaro Jose
- **HTML e CSS:** Victor Gabriel
- **JavaScript e Dados:** Marcondes Paixão
- **Documentação e Requisitos (RNs):** Joao Pedro

---

## 🚀 Principais Funcionalidades

- **Sistema de Quiz Completo:** Pelo menos 10 perguntas por quiz com 4 alternativas, cronômetro regressivo por questão e feedback visual automático [correto/incorreto].
- **Gestão de Usuários:** Sistema de cadastro e login de usuários, com exibição personalizada do nome do jogador.
- **Desempenho e Resultados:** Cálculo automático de percentual de desempenho, exibindo acertos, erros, pontuação final e opções para jogar novamente ou retornar à página inicial.
- **Categorias e Filtros:** Quizzes separados por categorias na área de TI com diferentes níveis de dificuldade.
- **Ranking Individual:** Página dedicada para listagem dos melhores resultados obtidos pelos jogadores.
- **CRUD e Persistência de Dados:** Criação, leitura, edição e exclusão de registros via formulários, com validação de dados nulos/inválidos e persistência conectada a banco relacional (SQLite online via Turso/libsql).
- **Página de Vendas:** Apresentação da proposta comercial da equipe acompanhada de uma prévia interativa de quiz.

---

## 🛠️ Tecnologias Utilizadas

- **HTML5 Semântico**
- **CSS3** [com reset customizado e layout responsivo para mobile e desktop]
- **JavaScript (Vanilla)** para toda a lógica interativa, manipulação de DOM e requisições HTTP
- **Banco de Dados:** SQLite Online (`libsql` via Turso)

---

## 🎨 Identidade Visual e Tipografia

- **Títulos:** Obrigatório uso da fonte **Comic Neue**.
- **Parágrafos e Textos:** Obrigatório uso da fonte **Inter**.
- **Paleta de Cores do Projeto:**
  1. `#5F7792`
  2. `#F26A1B`
  3. `#F2B138`
  4. `#F2C777`
  5. `#F2E5BD`
  6. **Preto**
  7. **Branco**

---

## 📱 Navegação e Páginas

O site possui pelo menos 4 páginas HTML principais:

1. **Página Inicial / Landing Page de Vendas** [com navegação via cabeçalho].
2. **Área de Quiz** [interface interativa de perguntas].
3. **Página de Resultados** [estatísticas de desempenho].
4. **Página de Ranking Individual**.

- *Navegação interna:* Utiliza uma *tabbar* lateral em telas grandes e fixa na parte inferior (estilo Instagram) em dispositivos móveis.

---

## 🕹️ Como Executar o Projeto

1. Clone este repositório ou baixe os arquivos em formato ZIP:

```bash
git clone https://github.com/seu-usuario/playzzi.git
```

### 2. Abra a pasta do projeto em seu editor de código (como o VS Code)

### 3. Abra o arquivo index.html diretamente no seu navegador ou utilize a extensão Live Server

---

## Licença do Projeto

Este projeto está licenciado sob a Licença **GNU General Public License v3.0 (GPLv3)**. Veja o arquivo [LICENSE](LICENSE.txt) para mais detalhes.

## Licenças de Terceiros (Third-Party Notices)

### Comic Neue Font

Copyright 2014 The Comic Neue Project Authors (<https://github.com/crozynski/comicneue>).
Licenciado under SIL Open Font License, Version 1.1.

### Inter Font

Copyright 2020 The Inter Project Authors (<https://github.com/rsms/inter>)
Licensed under the SIL Open Font License, Version 1.1.

### Josh's Custom CSS Reset

Copyright 2026 Josh W. Comeau (<https://www.joshwcomeau.com/css/custom-css-reset/>)
Licensed under the MIT License.
