import BottomSheet from '@/components/BottomSheet/Bottom.sheet';
import { colors } from '@/styles';

import { hexToRgb } from '@/utils/string';

describe('Components | <BottomSheet />', () => {
  it('Should be open & empty', () => {
    cy.mount(<BottomSheet isOpen />);

    cy.get('[data-cy=bottom-sheet]').should('exist');
    cy.get('[data-cy=bottom-sheet]').should('be.visible');
  });

  it('Should have a backdrop', () => {
    cy.mount(<BottomSheet isOpen />);

    cy.get('ion-backdrop').should('exist');
    cy.get('ion-backdrop').should('be.visible');
  });

  it('Should close when backdrop is clicked', () => {
    cy.mount(<BottomSheet isOpen />);

    cy.get('ion-backdrop').click();

    cy.get('[data-cy=bottom-sheet]').should('not.be.visible');
    cy.get('ion-backdrop').should('not.be.visible');
  });

  it('Should fire function when dismissed', () => {
    cy.mount(
      <BottomSheet
        isOpen
        onWillDismiss={cy.stub().as('onWillDismissFunction')}
      />,
    );

    cy.get('ion-backdrop')
      .click()
      .then(() => {
        cy.get('@onWillDismissFunction').should('have.been.calledOnce');
      });
  });

  it('Should apply style to all "bottom-sheet-btn" childrens', () => {
    cy.mount(
      <BottomSheet isOpen>
        <div className="bottom-sheet-btn">
          <p>Signaler</p>
        </div>
        <div className="bottom-sheet-btn">
          <p>Quitter</p>
        </div>
      </BottomSheet>,
    );

    cy.get('[data-cy=bottom-sheet]')
      .find('[class*="bottom-sheet-btn"]')
      .each((btn) => {
        cy.wrap(btn).should(
          'have.css',
          'background-color',
          hexToRgb(colors.whiteSmoke),
        );
      });
  });
});
