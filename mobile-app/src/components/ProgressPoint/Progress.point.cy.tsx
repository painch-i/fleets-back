import ProgressPoint from '@/components/ProgressPoint/Progress.point';

import { colors } from '@/styles';
import { hexToRgb } from '@/utils/string';

describe('Components | <ProgressPoint />', () => {
  it('Should render a default ProgressPoint with 3 points', () => {
    const totalProp = 3;
    const currentProp = 1;

    cy.mount(
      <div style={{ width: '85px' }}>
        <ProgressPoint total={totalProp} current={currentProp} />
      </div>,
    );

    cy.get('div[data-cy=progress-point]').should('exist');
    cy.get('div[data-cy=progress-point] > div').should('have.length', 3);
  });

  it('Should display the first point as activate', () => {
    const totalProp = 3;
    const currentProp = 1;

    cy.mount(
      <div style={{ width: '85px' }}>
        <ProgressPoint total={totalProp} current={currentProp} />
      </div>,
    );

    cy.get('div[data-cy=progress-point] > div')
      .eq(0)
      .should('have.css', 'backgroundColor', hexToRgb(colors.dark));
  });

  it('Should display the other point as desactivate', () => {
    const totalProp = 3;
    const currentProp = 1;

    cy.mount(
      <div style={{ width: '85px' }}>
        <ProgressPoint total={totalProp} current={currentProp} />
      </div>,
    );

    cy.get('div[data-cy=progress-point] > div')
      .first()
      .nextAll()
      .each((point) => {
        cy.wrap(point).should(
          'have.css',
          'backgroundColor',
          hexToRgb(colors.medium),
        );
      });
  });

  it('Should handle negative values in props', () => {
    const totalProp = -3;
    const currentProp = -1;

    cy.mount(
      <div style={{ width: '85px' }}>
        <ProgressPoint total={totalProp} current={currentProp} />
      </div>,
    );

    cy.get('div[data-cy=progress-point]').should('exist');
    cy.get('div[data-cy=progress-point] > div').should('have.length', 0);
  });
});
