import { USER_MOCKED } from '@/__mocks__/user';

import { CURRENT_USER_API_PATH } from '@/features/auth/api/use-current-user.query';
import { AUTH_TOKEN_LOCAL_KEY } from '@/constants/local-storage.const';
import { UserOrPendingUser } from '@/features/auth/types/user.types';

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

Cypress.Commands.add('login', (mockedUser = USER_MOCKED) => {
  window.localStorage.setItem(AUTH_TOKEN_LOCAL_KEY, 'fake-token');

  cy.intercept('GET', CURRENT_USER_API_PATH, mockedUser).as(
    'loggedCurrentUserQuery',
  );

  cy.visit('/');
  cy.wait('@loggedCurrentUserQuery');
});

Cypress.Commands.add('swipe', (selector, startX, startY, endX, endY) => {
  cy.get(selector)
    .trigger('touchstart', {
      touches: [{ clientX: startX, clientY: startY }],
      force: true,
    })
    .trigger('touchmove', {
      touches: [{ clientX: endX, clientY: endY }],
      force: true,
    })
    .trigger('touchend', {
      touches: [{ clientX: endX, clientY: endY }],
      force: true,
    });
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
      login(mockedUser?: UserOrPendingUser): Chainable<void>;
      /**
       * Custom command to fake swipe.
       * @example cy.swipe('div', 300, 300, 50, 300)
       */
      swipe(
        selector: string,
        startX: number,
        startY: number,
        endX: number,
        endY: number,
      ): Chainable<void>;
    }
  }
}

export {};
