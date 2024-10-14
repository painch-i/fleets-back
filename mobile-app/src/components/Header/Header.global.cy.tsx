import Header from '@/components/Header/Header.global';

describe('Components | <Header />', () => {
  const title = 'Test Title';

  it('Should render a default header with a title and the left Icon', () => {
    cy.mount(<Header title={title} />);

    cy.get('[data-cy=header-global-title]')
      .should('be.visible')
      .and('have.text', title);

    cy.get('[data-cy=header-global-left-icon]').should('be.visible');
  });

  it('Should render the right icon when showIconRight is true', () => {
    cy.mount(<Header title={title} showIconRight />);

    cy.get('[data-cy=header-global-right-icon]').should('be.visible');
  });

  it("Shouldn't render the left icon when showIconLeft is false", () => {
    cy.mount(<Header title={title} showIconLeft={false} />);

    cy.get('[data-cy=header-global-left-icon]').should('not.exist');
  });

  it('Should onClickIconLeft when left icon is clicked', () => {
    cy.mount(
      <Header
        title={title}
        onClickIconLeft={cy.stub().as('onClickIconLeft')}
      />,
    );

    cy.get('[data-cy=header-global-left-icon]')
      .click()
      .then(() => {
        cy.get('@onClickIconLeft').should('have.been.calledOnce');
      });
  });

  it('Should onClickIconRight when right icon is clicked', () => {
    cy.mount(
      <Header
        title={title}
        onClickIconRight={cy.stub().as('onClickIconRight')}
        showIconRight
      />,
    );

    cy.get('[data-cy=header-global-right-icon]')
      .click()
      .then(() => {
        cy.get('@onClickIconRight').should('have.been.calledOnce');
      });
  });

  it('Should render a custom left icon', () => {
    const CustomLeftIcon = () => <svg data-cy="custom-left-icon" />;

    cy.mount(<Header title={title} iconLeft={CustomLeftIcon} />);

    cy.get('[data-cy=custom-left-icon]').should('be.visible');
  });

  it('Should render a custom right icon', () => {
    const CustomRightIcon = () => <svg data-cy="custom-right-icon" />;

    cy.mount(
      <Header title={title} iconRight={CustomRightIcon} showIconRight />,
    );

    cy.get('[data-cy=custom-right-icon]').should('be.visible');
  });
});
