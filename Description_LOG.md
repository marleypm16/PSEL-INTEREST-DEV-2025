

## Visão Geral

O desenvolvimento do módulo de Gestão de Equipes foi conduzido de forma incremental, priorizando integridade de dados, aderência à arquitetura proposta pelo desafio e uma experiência de usuário clara para as regras de negócio. A seguir descrevo, em ordem cronológica, como o módulo foi projetado e implementado, bem como as principais decisões técnicas ao longo do processo.

---

## Modelagem do banco de dados

Iniciei o desenvolvimento pela modelagem relacional, definindo as tabelas `users` e `teams`.

Optei por não criar uma tabela de associação, adotando uma relação **1:N**, onde:

- um usuário pertence a no máximo uma equipe;
- uma equipe possui vários usuários;
- uma equipe possui obrigatoriamente um líder.

Essa decisão simplificou as consultas e permitiu garantir a regra de unicidade de participação diretamente através da coluna `team_id` na tabela `users`, além da unicidade do líder através de constraint na tabela `teams`.

Para acelerar essa etapa, solicitei à IA a geração dos SQLModels e Schemas. Entretanto, a implementação inicial apresentou **imports circulares entre os models** (`User` e `Team`), além de problemas na definição das dependências para criação das tabelas.

Identifiquei o problema ao integrar os models ao projeto base e executar a aplicação. Corrigi manualmente utilizando **forward references** (tipagem por string) e reorganizando os imports, garantindo que o ORM pudesse inicializar corretamente os relacionamentos.

A migration foi implementada em **um único arquivo Alembic**, organizando a criação das colunas, FKs e constraints na ordem lógica correta para manter a integridade referencial.

---

## Backend e arquitetura

Com o schema definido, avancei para o backend utilizando a arquitetura sugerida no desafio, baseada em **Repository Pattern**.

Organizei o projeto nos seguintes módulos:

- `models`
- `schemas`
- `repositories`
- `api/routes`

Essa separação permitiu desacoplar completamente:

- camada HTTP (rotas),
- regras de negócio,
- e acesso a dados,

facilitando testes e manutenção futura.

Implementei inicialmente os repositórios e rotas manualmente. Após concluir uma primeira versão funcional, solicitei à IA um **code review** dessas camadas. Analisei cada sugestão e apliquei apenas as alterações que:

- mantinham compatibilidade com o padrão do projeto base;
- melhoravam legibilidade;
- e não introduziam comportamento inesperado.

---

## Testes de integração

Com o backend finalizado, utilizei a IA para gerar testes Pytest cobrindo:

- CRUD de usuários;
- criação de equipes;
- associação e remoção de membros;
- cenários de violação de regras de negócio.

Todos os testes foram revisados manualmente para:

- ajustar asserts;
- validar status codes corretos;
- garantir previsibilidade;
- e manter isolamento entre execuções.

Essa etapa foi importante para validar que as constraints do banco e a lógica da API realmente impediam estados inválidos.

---

## Frontend: decisões iniciais

Após estabilizar o backend, iniciei o frontend.

Para acelerar o desenvolvimento visual e manter consistência, decidi utilizar:

- **TailwindCSS** – para estilização rápida e padronizada;
- **ShadCN UI** – para componentes reutilizáveis e acessíveis;
- **Lucide-react** – para ícones e melhor clareza visual.

O objetivo foi reduzir tempo gasto com layout e focar na implementação correta das regras de negócio.

Também utilizei o **Figma AI** para gerar um layout base das telas:

- Usuários  
- Listagem de Equipes  
- Detalhe da Equipe  

Esse layout serviu como referência visual durante a implementação.

---

## Organização dos componentes

Adotei uma abordagem incremental:

1. inicialmente criei componentes maiores;
2. em seguida fui quebrando em componentes menores e reutilizáveis.

Organizei o diretório `components` por domínio de página, por exemplo:

components/userpage/usertable.tsx

---

## Integração com a API

Na etapa seguinte implementei a comunicação com o backend:

- configurei o Axios em um módulo central;
- criei a pasta `services` para concentrar todas as chamadas HTTP;
- implementei os hooks `useUsers` e `useTeams` para encapsular:

  - loading
  - mutações
  - atualização de estado

Essa abordagem manteve os componentes visuais limpos e seguiu o padrão SPA, evitando recarregamentos completos da aplicação.

---

## Feedback ao usuário e tratamento de erros

Implementei feedback visual utilizando **Sonner (toast notifications)** para:

- sucesso de operações;
- erros de validação;
- conflitos de regra de negócio.

Utilizei a IA para auxiliar na criação de uma função de tratamento de erros do Axios, mapeando corretamente as mensagens vindas do backend para mensagens claras no frontend.

Isso garantiu que situações como tentativa de adicionar um usuário já pertencente a outra equipe fossem comunicadas de forma objetiva.

---

## Testes E2E (Cypress)

Como etapa adicional, implementei testes CRUD para a tela de usuários utilizando Cypress.

A base dos testes foi gerada com auxílio da IA, porém:

- revisei todo o código;
- adicionei atributos `data-cy` nos elementos do frontend para garantir seletores estáveis;
- removi dependências frágeis de classes ou estrutura do DOM.

---

## Considerações finais e melhorias futuras

O módulo foi concluído atendendo aos requisitos funcionais e arquiteturais propostos no desafio.

Como melhorias futuras, destaco:

- paginação na listagem de usuários;
- filtros e busca;
- histórico/auditoria de movimentações de membros;
- expansão dos testes E2E para equipes.

---

## Conclusão

O desenvolvimento seguiu uma abordagem incremental, validando cada camada antes de avançar para a próxima. A IA foi utilizada como ferramenta de aceleração e revisão, porém todas as decisões finais, correções arquiteturais e validações foram realizadas manualmente para garantir robustez, integridade dos dados e qualidade do código.
