import { USER_MOCKED } from '@/__mocks__/user';

import { CURRENT_USER_API_PATH } from '@/features/auth/api/use-current-user.query';
import { LOGIN_API_PATH } from '@/features/auth/api/login.mutation';

describe('E2E | auth | login', () => {
  beforeEach(() => {
    cy.waitForSplashScreen();
  });

  it('should login successfully and redirect to home', () => {
    cy.intercept('POST', LOGIN_API_PATH, {
      statusCode: 201,
      body: {
        access_token: 'fake-token',
        token_type: 'Bearer',
      },
    }).as('loginMutation');
    cy.intercept('GET', CURRENT_USER_API_PATH, USER_MOCKED).as(
      'currentUserQuery',
    );

    const email = 'example@email.com';
    const password = 'securepassword';

    cy.get('div[data-cy="input-global"] input[type="email"]').type(email);
    cy.get('div[data-cy="input-global"] input[type="email"]').should(
      'have.value',
      email,
    );

    cy.get('div[data-cy="input-global"] input[type="password"]').type(password);
    cy.get('div[data-cy="input-global"] input[type="password"]').should(
      'have.value',
      password,
    );

    cy.get('button[data-cy="button-global"]').should('not.be.disabled');
    cy.get('button[data-cy="button-global"]').click();

    cy.wait('@loginMutation').then((loginMutation) => {
      expect(loginMutation.request.body).to.deep.equal({
        email,
        password,
      });
    });
    cy.get('@loginMutation.all').should('have.length', 1);

    cy.wait('@currentUserQuery');

    cy.url().should('include', 'tabs/search');
  });

  it('should handle and display error', () => {
    const message = 'There was an error';

    cy.intercept('POST', LOGIN_API_PATH, {
      statusCode: 401,
      body: {
        message,
      },
    }).as('loginMutation');

    cy.get('div[data-cy="input-global"] input[type="email"]').type(
      'example@email.com',
    );
    cy.get('div[data-cy="input-global"] input[type="password"]').type(
      'securepassword',
    );

    cy.get('button[data-cy="button-global"]').click();

    cy.wait('@loginMutation');

    cy.get('p[data-cy="input-global-error"]').should('have.text', message);

    cy.url().should('include', 'login');
  });

  it('should have a disabled button when the inputs are empty', () => {
    cy.get('button[data-cy="button-global"]').should('be.disabled');
  });

  it('should be able to navigate to register route', () => {
    cy.get('p[data-cy="auth-link-button"]').click();

    cy.url().should('include', 'register');
  });
});
