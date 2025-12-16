// Объявляем команды Cypress
Cypress.Commands.add('login', (email = 'test@example.com', password = 'password123') => {
  cy.visit('/login');
  cy.get('input[name=email]').type(email);
  cy.get('input[name=password]').type(password);
  cy.get('button[type=submit]').click();
});

Cypress.Commands.add('addIngredient', (ingredientName: string) => {
  cy.contains(ingredientName).click();
});

Cypress.Commands.add('createOrder', () => {
  cy.get('[data-testid="order-button"]').click();
});
