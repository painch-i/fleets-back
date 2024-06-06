import '@cypress/support/commands';

// Is launched one time before all the tests
before(() => {
  // Incercept every get request to not send them to the back API
  cy.intercept('GET', 'http://localhost:3000/**', {});
});
