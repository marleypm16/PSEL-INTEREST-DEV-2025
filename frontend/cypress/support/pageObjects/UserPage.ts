class UsersPage {
  visit() {
    cy.visit("/users");
  }


  createUser(name: string, email: string) {
    cy.get("[data-cy='add-user-button']").click();
    this.fillForm(name, email);
    cy.get("[data-cy='save']").click();
  }

  updateUser(currentEmail: string, newName: string) {
    this.getRowByEmail(currentEmail).find("[data-cy='edit-button']").click();
    
    cy.get("[data-cy='name']").clear().type(newName);
    cy.get("[data-cy='save']").click();
  }

  deleteUser(email: string) {
    this.getRowByEmail(email).find("[data-cy='delete-button']").click();
    
    cy.get("[data-cy='confirm-delete-button']").should("be.visible").click();
  }

  private fillForm(name: string, email: string) {
    cy.get("[data-cy='name']").should("be.visible").type(name);
    cy.get("[data-cy='email']").should("be.visible").type(email);
  }

  getRowByEmail(email: string) {
    return cy.contains("td", email).parents("tr");
  }

  validateUserInTable(name: string, email: string) {
    this.getRowByEmail(email).should("contain.text", name);
  }

  validateUserNotExist(email: string) {
    cy.contains("td", email).should("not.exist");
  }
}

export default new UsersPage();