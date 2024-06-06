import Button from '@/components/Button/Button.global';

import { colors } from '@/styles';
import { hexToRgb } from '@/utils/string';

describe('Components | <Button />', () => {
  it('Should render a default button', () => {
    const buttonTxt = 'Testing';

    cy.mount(<Button>{buttonTxt}</Button>);

    cy.get('[data-cy=button-global]').should('exist');
    cy.get('[data-cy=button-global]').should('have.text', buttonTxt);
    cy.get('[data-cy=button-global]').should('not.be.disabled');
  });

  it('Should be clickable', () => {
    cy.mount(
      <Button onClick={cy.stub().as('onClickFunction')}>Testing</Button>,
    );

    cy.get('[data-cy=button-global]')
      .click()
      .then(() => {
        cy.get('@onClickFunction').should('have.been.calledOnce');
      });
  });

  it('Should render a loading and disabled button', () => {
    cy.mount(<Button isLoading>Loading</Button>);

    cy.get('[data-cy=button-global]').should('exist');
    cy.get('[data-cy=button-global]').should('contain.html', 'ion-spinner');
    cy.get('[data-cy=button-global]').should('be.disabled');
  });

  it('Should render disabled button', () => {
    cy.mount(<Button disabled>Disabled</Button>);

    cy.get('[data-cy=button-global]').should('exist');
    cy.get('[data-cy=button-global]').should('be.disabled');
  });

  describe('When variant = default / undefined', () => {
    it('Should render with default style', () => {
      cy.mount(<Button>Default style</Button>);

      cy.get('[data-cy=button-global]').should('exist');
      cy.get('[data-cy=button-global]').should(
        'have.css',
        'background-color',
        hexToRgb(colors.primary),
      );
    });
  });

  describe('When variant = outline', () => {
    it('Should render with outline style', () => {
      cy.mount(<Button variant="outline">Outline style</Button>);

      cy.get('[data-cy=button-global]').should('exist');
      cy.get('[data-cy=button-global]').should(
        'have.css',
        'background-color',
        hexToRgb(colors.whiteSmoke),
      );
    });
  });
});
