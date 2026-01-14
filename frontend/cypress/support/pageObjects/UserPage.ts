 class UsersPage {
  visit() {
    cy.visit("/users");
  }

  openCreateModal() {
    cy.get("[data-cy='add-user-button']").click();
  }

  fillName(name: string) {
    cy.get("[data-cy='name']").clear().type(name);
  }

  fillEmail(email: string) {
    cy.get("[data-cy='email']").clear().type(email);
  }

  submit() {
    cy.get("[data-cy='save']").click();
  }
  getDeleteButton() {
    return cy.get("[data-cy='delete-user-button']");
  }
  getEmptyListMessage() {
    return cy.get("[data-cy='empty-list-message']").contains("Nenhum usuário cadastrado.");
  }

 
  createUser(name: string, email: string) {
    this.openCreateModal();
    this.fillName(name);
    this.fillEmail(email);
    this.submit();
  }

  removeUser(email: string) {
    this.getDeleteButton().should("be.visible").click();
    cy.get("[data-cy='confirm-delete']").click();
    this.shouldUserNotExist(email);
    
  }

  shouldShowSuccess(message: string) {
    cy.contains(message).should("be.visible");
  }

  shouldShowError(message: RegExp | string) {
    cy.contains(message).should("be.visible");
  }

  shouldUserExist(email: string) {
    cy.contains(email).should("be.visible");
  }

  shouldUserNotExist(email: string) {
    cy.contains(email).should("not.exist");
  }
}
export default new UsersPage();