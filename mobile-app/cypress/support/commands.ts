import { USER_MOCKED } from '@/__mocks__/user';

import { CURRENT_USER_API_PATH } from '@/features/auth/api/use-current-user.query';
import { AUTH_TOKEN_LOCAL_KEY } from '@/config';

Cypress.Commands.add('waitForSplashScreen', () => {
  cy.intercept('GET', CURRENT_USER_API_PATH, {
    statusCode: 401,
    body: {
      message: 'No token found in request',
      error: 'Unauthorized',
      statusCode: 401,
    },
  }).as('currentUserQuery');

  cy.visit('/');

  cy.wait('@currentUserQuery').then(({ response }) => {
    if (response && response.body && response.body.retry) {
      cy.waitForSplashScreen();
    }
  });
});

Cypress.Commands.add('login', () => {
  window.localStorage.setItem(AUTH_TOKEN_LOCAL_KEY, 'fake-token');

  cy.intercept('GET', CURRENT_USER_API_PATH, USER_MOCKED).as(
    'currentUserQuery',
  );

  cy.visit('/');
});

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to create to wait for the splashscreen to be done.
       * @example cy.waitForSplashScreen()
       */
      waitForSplashScreen(): Chainable<void>;
      /**
       * Custom command to fake log a mocked user.
       * @example cy.login()
       */
      login(): Chainable<void>;
    }
  }
}

export {};
