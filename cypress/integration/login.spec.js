describe("Login page", () => {
  const typedText = "usuario1";
  const userLogged = "Usuario1";
  const errorMessage = "Nombre de usuario y contraseña son incorrectos";

  beforeEach(() => {
    cy.visit("http://localhost:8080");
  });

  it("input visible", () => {
    cy.get("input").first().should("be.visible");
  });

  it("input properly class", () => {
    cy.get("input").first().should("have.class", "form-control");
  });

  it("type input username", () => {
    cy.get("input")
      .first()
      .focus()
      .type(typedText)
      .should("have.value", typedText);
  });

  it("type input password", () => {
    cy.get("input[type=password]")
      .type(typedText)
      .should("have.value", typedText);
  });
  describe("Going to main page", () => {
    it("pulse login button", () => {
      cy.get("input")
        .first()
        .focus()
        .type(typedText)
        .should("have.value", typedText);

      cy.get("input[type=password]")
        .type(typedText)
        .should("have.value", typedText);

      cy.get("button").should("have.text", "Login").click();
    });

    it("just pulsing enter", () => {
      cy.get("input")
        .first()
        .focus()
        .type(typedText)
        .should("have.value", typedText);

      cy.get("input[type=password]")
        .type(typedText)
        .should("have.value", typedText)
        .type("{enter}");
    });

    it("pulse button access to main page", () => {
      cy.get("input")
        .first()
        .focus()
        .type(typedText)

      cy.get("input[type=password]")
        .type(typedText)

      cy.get("button").should("have.text", "Login").click();

      cy.get("nav").contains("Alvaro Vallejos");
    });

    it("has the properly username", () => {
      cy.get("input").first().focus().type(typedText);

      cy.get("input[type=password]").type(typedText);

      cy.get("button").should("have.text", "Login").click();

      cy.get("div #username").should("have.text", userLogged);
    });

    it("div error shows up properly when incorrect username-password", () => {
      cy.get("input").first().focus().type(typedText);

      cy.get("input[type=password]").type('bad password');

      cy.get("button").should("have.text", "Login").click();
      
      cy.get("form").contains(errorMessage);
    });

    it("not access to main when unproperly username", () => {
      cy.get("input").first().focus().type(typedText);

      cy.get("input[type=password]").type('bad password');

      cy.get("button").should("have.text", "Login").click();

      cy.url().should('include', '/login');
    });
  });
});
