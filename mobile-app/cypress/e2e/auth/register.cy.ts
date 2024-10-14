import { CURRENT_USER_API_PATH } from '@/features/auth/api/use-current-user.query';
import { START_REGISTRATION_API_PATH } from '@/features/auth/api/start-registration.mutation';
import { VERIFY_OTP_API_PATH } from '@/features/auth/api/verify-otp.mutation';

import { PENDING_USER_MOCKED } from '@/__mocks__/user';

describe('E2E | auth | register', () => {
  const email = 'example@email.com';
  const otpVerificationUrl = `/otp-verification?email=${email}&type=registration`;

  beforeEach(() => {
    cy.waitForSplashScreen();

    cy.visit('/register');
  });

  it('Should create an user, login and redirect to account-creation', () => {
    cy.intercept('POST', START_REGISTRATION_API_PATH, {
      statusCode: 201,
    }).as('startRegistrationMutation');

    cy.intercept('POST', VERIFY_OTP_API_PATH, {
      statusCode: 201,
      body: {
        token: 'fake-token',
        type: 'Bearer',
      },
    }).as('verifyOtpMutation');

    cy.intercept('GET', CURRENT_USER_API_PATH, PENDING_USER_MOCKED).as(
      'currentUserQuery',
    );

    cy.get('div[data-cy="input-global"] input[type="email"]').type(email);

    cy.get('button[data-cy="button-global"]').should('not.be.disabled');
    cy.get('button[data-cy="button-global"]').click();

    cy.wait('@startRegistrationMutation').then((startRegistrationMutation) => {
      expect(startRegistrationMutation.request.body).to.deep.equal({
        email,
      });
    });
    cy.get('@startRegistrationMutation.all').should('have.length', 1);

    cy.url().should('include', otpVerificationUrl);

    const inputs = Array.from({ length: 6 }, (_, i) => `code-input-${i}`);

    inputs.forEach((input, index) => {
      cy.get(`[data-cy=${input}]`).type(String(index + 1));
    });

    cy.get('button[data-cy="button-global"]').should('not.be.disabled');
    cy.get('button[data-cy="button-global"]').click();

    cy.wait('@verifyOtpMutation').then((verifyOtpMutation) => {
      expect(verifyOtpMutation.request.body).to.deep.equal({
        email,
        otp: '123456',
      });
    });
    cy.get('@verifyOtpMutation.all').should('have.length', 1);

    cy.wait('@currentUserQuery');

    cy.url().should('include', 'account-creation');
  });

  describe('Should handle and display errors', () => {
    const message = 'There was an error';

    it('In /register page', () => {
      cy.intercept('POST', START_REGISTRATION_API_PATH, {
        statusCode: 401,
        body: {
          message,
        },
      }).as('startRegistrationMutation');

      cy.get('div[data-cy="input-global"] input[type="email"]').type(email);

      cy.get('button[data-cy="button-global"]').click();

      cy.wait('@startRegistrationMutation');
      cy.get('@startRegistrationMutation.all').should('have.length', 1);

      cy.get('p[data-cy="input-global-error"]').should('have.text', message);

      cy.url().should('include', 'register');
    });

    it('In /otp-verification page in registration type', () => {
      cy.visit(otpVerificationUrl);

      cy.intercept('POST', VERIFY_OTP_API_PATH, {
        statusCode: 401,
        body: {
          message,
        },
      }).as('verifyOtpMutation');

      const inputs = Array.from({ length: 6 }, (_, i) => `code-input-${i}`);

      inputs.forEach((input, index) => {
        cy.get(`[data-cy=${input}]`).type(String(index + 1));
      });

      cy.get('button[data-cy="button-global"]').click();

      cy.wait('@verifyOtpMutation');
      cy.get('@verifyOtpMutation.all').should('have.length', 1);

      cy.get('p[class=text-error]').should('have.text', message);

      cy.url().should('include', otpVerificationUrl);
    });
  });

  describe('Should have disabled buttons when the inputs are empty', () => {
    it('In /register page', () => {
      cy.get('button[data-cy=button-global]').should('be.disabled');
    });

    it('In /otp-verification page in registration type', () => {
      cy.get('button[data-cy=button-global]').should('be.disabled');
    });
  });

  it('Should be able to resend an register otp', () => {
    cy.visit(otpVerificationUrl);

    cy.intercept('POST', START_REGISTRATION_API_PATH, {
      statusCode: 201,
    }).as('startRegistrationMutation');

    cy.get('span[class=active]').click();

    cy.wait('@startRegistrationMutation').then((startRegistrationMutation) => {
      expect(startRegistrationMutation.request.body).to.deep.equal({
        email,
      });
    });
    cy.get('@startRegistrationMutation.all').should('have.length', 1);
  });
});
