import ErrorMessage, {
  defaultErrorMessage,
  defaultSubErrorMessage,
} from '@/components/ErrorMessage/Error.message';

describe('Components | <ErrorMessage />', () => {
  it('Should render a default ErrorMessage', () => {
    cy.mount(<ErrorMessage />);

    cy.get('[data-cy=error-message]').should('exist');
    cy.get('[data-cy=error-message]').should('be.visible');

    cy.get('[data-cy=error-message]').find('svg').should('be.visible');

    cy.get('[data-cy=error-message-text]').should('be.visible');
    cy.get('[data-cy=error-message-text]').should(
      'have.text',
      defaultErrorMessage,
    );

    cy.get('[data-cy=error-message-subtext]').should('be.visible');
    cy.get('[data-cy=error-message-subtext]').should(
      'have.text',
      defaultSubErrorMessage,
    );
  });

  it('Should be able to display a custom message', () => {
    const message = 'This is a test';

    cy.mount(<ErrorMessage message={message} />);

    cy.get('[data-cy=error-message-text]').should('have.text', message);
  });
});
