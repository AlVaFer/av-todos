describe("Main page", () => {
  const typedText = "usuario1";
  const userLogged = "Usuario1";
  before(() => {
    cy.visit("http://localhost:8080");
    cy.get("input").first().focus().type(typedText);
    cy.get("input[type=password]").type(typedText).type("{enter}");
  });

  it("nav visible", () => {
    cy.get("nav").first().should("be.visible");
    cy.get("nav").contains("Alvaro Vallejos");
  });

  it("create task", () => {
    cy.get("input[placeholder=Título]").type("Tarea 1");

    cy.get("input[placeholder=Descripción]").type("Ir a la playa");

    cy.get("button")
      .eq(0)
      .should("not.be.disabled")
      .should("have.text", " Guardar")
      .click();

    cy.get("div .list-group-item > div .task-title")
      .first()
      .should("have.text", "Tarea 1");

    cy.get("div .list-group-item > div .task-description")
      .first()
      .should("have.text", "Ir a la playa");
  });

  it("edit task", () => {
    cy.get("div .task-item-buttons > button")
      .eq(0)
      .should("not.be.disabled")
      .should("have.text", "Editar ")
      .click();

    cy.get("input[placeholder=Título]").eq(1).clear().type("Título cambiado");

    cy.get("input[placeholder=Descripción]")
      .eq(1)
      .clear()
      .type("Descripción cambiada");

    cy.get("button")
      .eq(1)
      .should("not.be.disabled")
      .should("have.text", " Guardar")
      .click();
  });

  it("delete task", () => {
    cy.get(".trash-button.btn.btn-danger")
      .eq(0)
      .should("not.be.disabled")
      .should("have.text", "Eliminar")
      .click();

    cy.get("input[placeholder=Descripción]").should(
      "not.have.text",
      "Descripción cambiada"
    );
  });

  it("Logout", () => {
    cy.get("a").first().click();

    cy.get("h2").should("have.text", "Login");
  });
});
