import UsersPage from "../support/pageObjects/UserPage";
describe("Teste Crud Usuários", () => {
  const uniqueEmail = () => `teste_${Date.now()}@mail.com`;

  beforeEach(() => {
    UsersPage.visit();
  });

  it("Criação e Listagem: Deve criar um novo usuário e validar na tabela", () => {
    const email = uniqueEmail();
    const nome = "Usuario Criacao";

    UsersPage.createUser(nome, email);

    // Valida (Read)
    UsersPage.validateUserInTable(nome, email);
  });

  it("Atualização: Deve editar o nome de um usuário existente", () => {
    // 1. Prepara o dado (Cria)
    const email = uniqueEmail();
    const nomeOriginal = "Nome Original";
    const nomeNovo = "Nome Editado";

    UsersPage.createUser(nomeOriginal, email);
    UsersPage.validateUserInTable(nomeOriginal, email);

    // 2. Ação (Edita)
    UsersPage.updateUser(email, nomeNovo);

    // 3. Validação (Verifica se o nome mudou na mesma linha do email)
    UsersPage.validateUserInTable(nomeNovo, email);
  });

  it("Deleção: Deve remover um usuário da lista", () => {
    // 1. Prepara o dado (Cria)
    const email = uniqueEmail();
    UsersPage.createUser("Usuario Para Deletar", email);
    UsersPage.validateUserInTable("Usuario Para Deletar", email);

    // 2. Ação (Deleta)
    UsersPage.deleteUser(email);

    // 3. Validação (Verifica se sumiu)
    UsersPage.validateUserNotExist(email);
  });
});