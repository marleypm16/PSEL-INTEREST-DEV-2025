# IA_LOG.md


## Modelagem de dados (SQLModels e Schemas)

Após definir conceitualmente a modelagem (tabelas `users` e `teams` com relação 1:N e líder obrigatório), solicitei à IA a geração inicial dos SQLModels e dos schemas Pydantic.

Prompt: "Gere sql models e schemas teams e users seguindo o seguintes critérios: Um time só pode ter um lider, um usuário só pode pertencer a uma equipe e um líder só pode ser líder de uma equipe"

A IA gerou rapidamente uma estrutura funcional, porém com dois problemas relevantes:

- uso de imports diretos entre `User` e `Team`, causando **imports circulares**;
- ausência de uma definição clara de como organizar as dependências entre FKs e constraints na migration.

Identifiquei o problema ao integrar os models ao projeto base e executar a aplicação, onde o ORM falhou ao inicializar corretamente os relacionamentos.

### Decisão e correção

Optei por:

- remover os imports diretos entre os models;
- utilizar **forward references** (tipagem por string, como `"User"` e `"Team"`);
- reorganizar os relacionamentos para que o SQLModel pudesse resolver as dependências em runtime;
- estruturar manualmente a migration única do Alembic, garantindo que colunas, FKs e constraints fossem criadas na ordem lógica correta.

A IA foi útil para acelerar a criação inicial, mas a correção arquitetural foi feita manualmente.

---

## Backend: repositórios e rotas

Implementei inicialmente todo o backend manualmente seguindo o padrão do projeto:

- repositories
- routes
- schemas
- models

Após concluir a primeira versão funcional, solicitei à IA um **code review** do código dos repositórios e das rotas FastAPI.

Prompt : "Faça um code review das minhas rotas e lógica do repository para atender os requisitos propostos pelos models"

A IA sugeriu:

- pequenas melhorias na organização dos métodos;
- padronização de nomes;
- ajustes em validações;
- tratamento mais explícito de erros.

### Decisão

Analisei cada sugestão individualmente e apliquei apenas aquelas que:

- mantinham compatibilidade com o padrão existente do projeto base;
- não alteravam regras de negócio já implementadas;
- melhoravam legibilidade ou manutenção.

Sugestões que modificavam o fluxo principal ou simplificavam excessivamente validações críticas foram descartadas.

---

## Testes de integração (Pytest)

Com o backend pronto, utilizei a IA para gerar testes Pytest cobrindo:

Prompt: "Gere testes para rotas de usuários e times cobrindo todos os cenários possíveis"

- CRUD de usuários;
- CRUD de equipes;
- associação de membros;
- cenários de erro (violação de unicidade, vínculos inválidos etc).

Os testes foram gerados corretamente, porém passei por todo o código para:

- ajustar asserts;
- revisar status codes;
- alinhar mensagens de erro;
- garantir isolamento entre execuções.

A IA acelerou significativamente a escrita dos testes, mas a validação semântica e técnica foi feita manualmente.

---

## Frontend: layout e estrutura inicial

Para acelerar a criação da interface, utilizei o **Figma AI** para gerar o layout base das telas:

Prompt: Crie o layout de um aplicativo web responsivo para gerenciamento de equipes e usuário

- página de usuários;
- listagem de equipes;
- detalhes da equipe.

Esse layout serviu apenas como guia visual.

---

## Organização dos componentes React

Durante a implementação do frontend, pedi à IA sugestões de organização de componentes e estrutura de pastas.

A estrutura final adotada foi: ex: components/userspage/usertable

Essa organização facilitou:

- separação por domínio de página;
- reutilização de componentes;
- manutenção futura.

A IA auxiliou com sugestões iniciais, mas a estrutura foi ajustada manualmente conforme a complexidade real do projeto aumentava.

---

## Integração com API, hooks e tratamento de erros

Utilizei a IA para:

- criar a configuração base do Axios;
- gerar os hooks `useUsers` e `useTeams`;
- sugerir um padrão de tratamento de erros vindos do backend.

A partir disso:

- centralizei todas as chamadas HTTP no diretório `services`;
- encapsulei estado, loading e erros nos hooks;
- padronizei o retorno de mensagens de erro para o frontend.

As sugestões foram adaptadas para manter o padrão SPA e evitar lógica de negócio dentro dos componentes visuais.

---

## Feedback visual e UX

Para melhorar a experiência do usuário, utilizei o Sonner (toast notifications).

Solicitei à IA exemplos de como mapear erros do Axios para mensagens amigáveis, especialmente para:

- conflitos de regra de negócio;
- validações inválidas;
- recursos inexistentes.

Esses exemplos foram ajustados manualmente para refletir exatamente o contrato da API implementada.

---

## Testes E2E com Cypress

Solicitei à IA a geração dos testes básicos de CRUD para usuários utilizando Cypress.

Os testes funcionaram corretamente, mas foi necessário:

- revisar toda a estrutura;
- adicionar atributos `data-cy` nos elementos do frontend;
- remover seletores frágeis baseados em classes ou hierarquia do DOM.

A IA foi usada como ponto de partida, mas a estabilização dos testes foi feita manualmente.

---

## Caso de sugestão incorreta da IA

### Contexto

Ao solicitar a geração dos SQLModels para `User` e `Team`, a IA produziu uma implementação com imports diretos entre os dois arquivos.

### Problema gerado

- `users_model.py` importava `Team`;
- `teams_model.py` importava `User`;
- o ORM falhava ao inicializar os relacionamentos;
- a aplicação quebrava na inicialização.

Além disso, a sugestão não tratava corretamente como estruturar as FKs e constraints dentro de uma única migration.

### Por que isso era incorreto

- imports circulares quebram o carregamento dos módulos;
- comprometem a criação correta do schema no banco.

### Como foi corrigido

- substituí os imports diretos por **forward references** (`"User"` e `"Team"`);
- reorganizei os relacionamentos no SQLModel;
- estruturei manualmente a migration única do Alembic garantindo integridade referencial;
- validei a correção executando a aplicação e todos os testes automatizados.

---

## Conclusão

A IA foi utilizada como ferramenta de apoio para acelerar tarefas repetitivas, revisar código e gerar estruturas iniciais.

Todas as decisões arquiteturais, correções críticas, validações de regra de negócio e ajustes finais foram realizadas manualmente, garantindo que o sistema atendesse integralmente aos critérios técnicos do desafio.

O uso da IA reduziu tempo operacional, mas não substituiu a análise técnica nem o processo de validação.

