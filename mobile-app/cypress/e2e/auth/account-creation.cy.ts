import { COMPLETE_REGISTRATION_API_PATH } from '@/features/auth/api/complete-registration.mutation';
import { CURRENT_USER_API_PATH } from '@/features/auth/api/use-current-user.query';

import { PENDING_USER_MOCKED, USER_MOCKED } from '@/__mocks__/user';

describe('E2E | auth | account-creation', () => {
  beforeEach(() => {
    cy.login(PENDING_USER_MOCKED);
  });

  it('Should finish the account-creation of the user and redirect to home', () => {
    cy.intercept('POST', COMPLETE_REGISTRATION_API_PATH, {
      statusCode: 201,
    }).as('completeRegistrationMutation');

    cy.intercept('GET', CURRENT_USER_API_PATH, USER_MOCKED).as(
      'newCurrentUserQuery',
    );

    cy.url().should('include', 'account-creation');

    cy.get('div[data-cy=input-global] input[name=lastName]').type(
      USER_MOCKED.lastName,
    );
    cy.get('div[data-cy=input-global] input[name=firstName]').type(
      USER_MOCKED.firstName,
    );

    cy.get('button[data-cy=toggle-global-option]').eq(1).click();

    cy.get('button[data-cy=button-global]').should('not.be.disabled');
    cy.get('button[data-cy=button-global]').click();

    // TODO -> ion-picker-column fonctionne pas ?

    // cy.get(
    //   'ion-picker-column[aria-label="Select a year"] > ion-picker-column-option:contains(2001)',
    // ).click({ force: true });

    cy.get('button[data-cy="button-global"]').should('not.be.disabled');
    cy.get('button[data-cy="button-global"]').click();

    cy.wait('@completeRegistrationMutation');

    // cy.wait('@completeRegistrationMutation').then(
    //   (completeRegistrationMutation) => {
    //     expect(completeRegistrationMutation.request.body).to.deep.equal({
    //       firstName: USER_MOCKED.firstName,
    //       lastName: USER_MOCKED.lastName,
    //       gender: USER_MOCKED.gender,
    //       birthDate: new Date(),
    //     });
    //   },
    // );
    cy.get('@completeRegistrationMutation.all').should('have.length', 1);

    cy.url().should('include', 'tabs/search');
  });

  it('Should handle and display errors', () => {
    const message = 'There was an error';

    cy.intercept('POST', COMPLETE_REGISTRATION_API_PATH, {
      statusCode: 401,
      body: { message },
    }).as('completeRegistrationMutation');

    cy.get('div[data-cy=input-global] input[name=lastName]').type(
      USER_MOCKED.lastName,
    );
    cy.get('div[data-cy=input-global] input[name=firstName]').type(
      USER_MOCKED.firstName,
    );

    cy.get('button[data-cy=button-global]').click();
    cy.get('button[data-cy=button-global]').click();

    cy.wait('@completeRegistrationMutation');
    cy.get('@completeRegistrationMutation.all').should('have.length', 1);

    cy.get('p[class=text-error]').should('have.text', message);
    cy.url().should('include', 'account-creation');
  });

  it('Should have disabled button when the inputs are empty', () => {
    cy.get('button[data-cy=button-global]').should('be.disabled');
  });
});
