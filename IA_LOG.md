# IA_LOG.md

## Visão Geral

Durante o desenvolvimento do módulo de Gestão de Equipes, utilizei ferramentas de IA como apoio em tarefas específicas: geração de boilerplate, revisão de código, testes automatizados e organização do frontend.  

A IA foi tratada como uma ferramenta auxiliar. Todas as sugestões passaram por validação manual, execução local e revisão crítica antes de serem incorporadas ao projeto.

Este documento descreve cronologicamente como a IA foi utilizada, quais decisões foram tomadas e um caso obrigatório onde a sugestão foi incorreta e precisou ser corrigida.

---

## Modelagem de dados (SQLModels e Schemas)

Após definir conceitualmente a modelagem (tabelas `users` e `teams` com relação 1:N e líder obrigatório), solicitei à IA a geração inicial dos SQLModels e dos schemas Pydantic.

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

- página de usuários;
- listagem de equipes;
- detalhes da equipe.

Esse layout serviu apenas como guia visual.

---

## Organização dos componentes React

Durante a implementação do frontend, pedi à IA sugestões de organização de componentes e estrutura de pastas.

A estrutura final adotada foi:

