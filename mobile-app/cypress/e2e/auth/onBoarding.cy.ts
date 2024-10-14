describe('E2E | auth | onBoarding', () => {
  beforeEach(() => {
    cy.waitForSplashScreen();
  });

  it('Should be able to swipe', () => {
    const slides = Array.from({ length: 3 }, (_, i) => `onBoarding-slide-${i}`);

    cy.get(`div[data-cy=${slides[0]}]`).should('be.visible');
    cy.get('div[data-cy=progress-point] > div')
      .eq(0)
      .should('have.class', 'active');

    cy.swipe('div[data-cy=onBoarding-container-slides]', 300, 300, 50, 300);

    cy.get(`div[data-cy=${slides[0]}]`).should('not.be.visible');
    cy.get('div[data-cy=progress-point] > div')
      .eq(0)
      .should('not.have.class', 'active');

    cy.get(`div[data-cy=${slides[1]}]`).should('be.visible');
    cy.get('div[data-cy=progress-point] > div')
      .eq(1)
      .should('have.class', 'active');

    cy.swipe('div[data-cy=onBoarding-container-slides]', 300, 300, 50, 300);

    cy.get(`div[data-cy=${slides[1]}]`).should('not.be.visible');
    cy.get('div[data-cy=progress-point] > div')
      .eq(1)
      .should('not.have.class', 'active');

    cy.get(`div[data-cy=${slides[2]}]`).should('be.visible');
    cy.get('div[data-cy=progress-point] > div')
      .eq(2)
      .should('have.class', 'active');
  });

  it('Should be able to navigate to the register page on register button click', () => {
    cy.get('div[data-cy=onBoarding-container-buttons] > button').eq(0).click();
    cy.url().should('include', '/register');
  });

  it('Should be able to navigate to the login page on login button click', () => {
    cy.get('div[data-cy=onBoarding-container-buttons] > button').eq(1).click();
    cy.url().should('include', '/login');
  });
});
