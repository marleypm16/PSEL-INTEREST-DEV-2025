# Frontend - Seletiva Interest Dev 2025

Este é o frontend do projeto, construído com **Vite**, **React** e **TypeScript**. O projeto utiliza **React Router** para navegação e **Context API** para gerenciamento de estado global.

## 🚀 Tecnologias Utilizadas

- **[Vite](https://vitejs.dev/)**: Build tool e servidor de desenvolvimento rápido.
- **[React](https://reactjs.org/)**: Biblioteca para construção de interfaces.
- **[TypeScript](https://www.typescriptlang.org/)**: Superset tipado de JavaScript.
- **[React Router DOM](https://reactrouter.com/)**: Gerenciamento de rotas.
- **Axios**: Cliente HTTP (configurado para comunicação com o backend).
- **TailwindCSS** – Estilização customizada com variáveis CSS e animações.
- **ShadCN UI** – Componentes reutilizáveis
- **Lucide-react** – Ícones
- **Sonner** – Feedback visual (toasts)
- **Cypress**  – Testes E2E do módulo de usuários

## 🛠️ Configuração e Execução

Certifique-se de ter o **Node.js** instalado.

1. **Acesse o diretório do frontend:**
   ```bash
   cd frontend
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure o endpoint da API no arquivo .env (com base no .env.example)**
   - VITE_API_URL=http://localhost:8000/api/v1



3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Acesse no navegador:**
   O projeto estará rodando em `http://localhost:5173`.

## 📂 Estrutura do Projeto

A estrutura de pastas foi organizada para facilitar a escalabilidade e manutenção:

- **`src/components`**: Componentes de UI reutilizáveis e Componentes organizados por página
- **`src/hooks`**: Encapsulam estado, loading e erros.
- **`src/layouts`**: Estruturas de layout que envolvem as páginas 
- **`src/pages`**: Componentes que representam páginas completas 
- **`src/services`**: Centralização das chamadas HTTP

 ## 🧩 Funcionalidades Implementadas

- CRUD completo de usuários

- CRUD completo de equipes

- Associação e remoção de membros

- Visualização do líder e membros por equipe

## Feedback visual para:

- Carregamento

- Sucesso

- Erro

- conflitos de regra de negócio (ex: usuário já pertence a outra equipe)

 ## Interface responsiva:

- Tabela no desktop

- Cards no mobile

## 🔗 Integração com Backend

O frontend está configurado para se comunicar com a API backend. Certifique-se de que o backend esteja rodando (geralmente na porta `8000`) para que as funcionalidades que dependem de dados dinâmicos funcionem corretamente verifique no .env.example e coloque o caminho da.
## 🧪 Testes

- Implementados testes E2E com Cypress para o CRUD de usuários

- Utilização de seletores estáveis com data-cy para maior robustez
---
*Desenvolvido para o Desafio Técnico Full-Stack.*
