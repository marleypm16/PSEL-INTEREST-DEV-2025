import UsersPage from "../support/pageObjects/UserPage";
describe("Módulo de Usuários", () => {

  beforeEach(() => {
    cy.fixture('users.json').as('usuarios')
    UsersPage.visit();

  });

  it("deve criar um usuário com sucesso", () => {
    cy.get('@usuarios').then((usuarios) => {
      UsersPage.createUser(usuarios.validUser.name, usuarios.validUser.email);

      UsersPage.shouldShowSuccess("Usuário criado com sucesso");
      UsersPage.shouldUserExist(usuarios.validUser.email);
    });
  });

  it("deve impedir criação de usuário com email inválido", () => {
    cy.get('@usuarios').then((usuarios) => {
      UsersPage.createUser(usuarios.invalidUser.name, usuarios.invalidUser.email);

      UsersPage.shouldShowError(/email inválido/i);
    });
  });

  it("deve listar usuários cadastrados", () => {
    cy.get("table").should("be.visible");
    cy.get("tbody tr").should("have.length.greaterThan", 0);
  });
  it("deve exibir mensagem quando não houver usuários", () => {
    cy.get('@usuarios').then((usuarios) => {
      // Remover todos os usuários existentes
      usuarios.allUsers.forEach((user: { email: string }) => {
        UsersPage.removeUser(user.email);
      });
    });
    UsersPage.getEmptyListMessage().should("be.visible");
  })

  it("deve remover um usuário com sucesso", () => {
    const email = `delete_${Date.now()}@test.com`;

    UsersPage.createUser("Usuário Remoção", email);
    UsersPage.removeUser(email);

    UsersPage.shouldShowSuccess("Usuário removido com sucesso");
    UsersPage.shouldUserNotExist(email);
  });
});
