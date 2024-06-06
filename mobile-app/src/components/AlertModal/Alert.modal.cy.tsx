import AlertModal from '@/components/AlertModal/Alert.modal';

describe('Components | <AlertModal />', () => {
  it('Should render an open single button alert', () => {
    const title = 'Testing';

    cy.mount(<AlertModal title="Testing" onClose={() => {}} isOpen />);

    cy.get('[data-cy=alert-modal]').should('exist');
    cy.get('[data-cy=alert-modal]').should('be.visible');

    cy.get('[data-cy=alert-modal-title]').should('have.text', title);

    cy.get('[data-cy=alert-modal-description]').should('not.exist');

    cy.get('[data-cy=alert-modal-btn-container]')
      .find('button')
      .should('have.length', 1)
      .contains('Annuler');
  });

  it('Should have a backdrop', () => {
    cy.mount(<AlertModal title="Testing" onClose={() => {}} isOpen />);

    cy.get('ion-backdrop').should('exist');
  });

  it('Should close when backdrop is clicked', () => {
    cy.mount(<AlertModal title="Testing" onClose={() => {}} isOpen />);

    cy.wait(200);

    cy.get('ion-backdrop').click({ force: true });

    cy.get('[data-cy=alert-modal]').should('not.be.visible');
    cy.get('ion-backdrop').should('not.be.visible');
  });

  it('Should fire close function when backdrop is clicked', () => {
    cy.mount(
      <AlertModal
        title="Testing"
        onClose={cy.stub().as('onCloseFunction')}
        isOpen
      />,
    );

    cy.wait(200);

    cy.get('ion-backdrop')
      .click({ force: true })
      .then(() => {
        cy.get('@onCloseFunction').should('have.been.calledOnce');
      });
  });

  it('Should be able to display a description', () => {
    const description = 'This is a test';

    cy.mount(
      <AlertModal
        title="Testing"
        description={description}
        onClose={() => {}}
        isOpen
      />,
    );

    cy.get('[data-cy=alert-modal-description]').should('be.visible');
    cy.get('[data-cy=alert-modal-description]').should(
      'have.text',
      description,
    );
  });

  it('Should be able to display a second button', () => {
    const buttonConfirmLabel = 'Confirm';

    cy.mount(
      <AlertModal
        title="Testing"
        buttonConfirmLabel={buttonConfirmLabel}
        onConfirm={() => {}}
        onClose={() => {}}
        isOpen
      />,
    );

    cy.get('[data-cy=alert-modal-btn-container]').within(() => {
      cy.get('button').should('have.length', 2);
      cy.get('button').eq(1).should('have.text', buttonConfirmLabel);
    });
  });

  // TODO -> Voir pourquoi ça marche pas ?
  // it.only('Should fire function when close button is clicked', () => {
  //   cy.mount(
  //     <AlertModal
  //       title="Testing"
  //       onClose={cy.stub().as('onCloseFunction')}
  //       isOpen
  //     />,
  //   );

  //   cy.get('[data-cy=alert-modal-btn-container]')
  //     .find('button')
  //     .click()
  //     .then(() => {
  //       cy.get('@onCloseFunction').should('have.been.calledOnce');
  //     });
  // });
});
