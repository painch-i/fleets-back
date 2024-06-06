import { USER_MOCKED } from '@/__mocks__/user';

import { CURRENT_USER_API_PATH } from '@/features/auth/api/use-current-user.query';
import { CREATE_USER_API_PATH } from '@/features/auth/api/create-user.mutation';
import { LOGIN_API_PATH } from '@/features/auth/api/login.mutation';
import { Gender } from '@/features/auth/types/user.types';
import { colors } from '@/styles';
import { hexToRgb } from '@/utils/string';

describe('E2E | auth | register', () => {
  beforeEach(() => {
    cy.waitForSplashScreen();

    cy.get('p[data-cy="auth-link-button"]').click();
  });

  it('should create an user, login and redirect to home', () => {
    cy.intercept('POST', CREATE_USER_API_PATH, {
      statusCode: 201,
      body: USER_MOCKED,
    }).as('createUserMutation');

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
    const gender = Gender.MALE;

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

    cy.get('div[data-cy="gender-toggle"]').within(() => {
      cy.get('div').eq(1).click();
      cy.get('div')
        .eq(1)
        .should('have.css', 'background-color', hexToRgb(colors.primary));
    });

    cy.get('button[data-cy="button-global"]').should('not.be.disabled');
    cy.get('button[data-cy="button-global"]').click();

    cy.wait('@createUserMutation').then((createUserMutation) => {
      expect(createUserMutation.request.body).to.deep.equal({
        email,
        password,
        gender,
      });
    });
    cy.get('@createUserMutation.all').should('have.length', 1);

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

    cy.intercept('POST', CREATE_USER_API_PATH, {
      statusCode: 401,
      body: {
        message,
      },
    }).as('createUserMutation');

    cy.get('div[data-cy="input-global"] input[type="email"]').type(
      'example@email.com',
    );
    cy.get('div[data-cy="input-global"] input[type="password"]').type(
      'securepassword',
    );

    cy.get('button[data-cy="button-global"]').click();

    cy.wait('@createUserMutation');

    cy.get('p[data-cy="input-global-error"]').should('have.text', message);

    cy.url().should('include', 'register');
  });

  it('should have a disabled button when the inputs are empty', () => {
    cy.get('button[data-cy="button-global"]').should('be.disabled');
  });

  it('should be able to navigate to login route', () => {
    cy.get('p[data-cy="auth-link-button"]').click();

    cy.url().should('include', 'login');
  });
});
