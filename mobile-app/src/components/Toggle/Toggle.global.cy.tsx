import Toggle from '@/components/Toggle/Toggle.global';

import { UserGenderIcons } from '@/features/auth/types/user.types';
import { hexToRgb } from '@/utils/string';
import { colors } from '@/styles';

describe('Components | <Toggle />', () => {
  const currentValue = 'Yes';
  const secondOption = 'No';
  const defaultValues = [
    {
      value: currentValue,
      icon: UserGenderIcons.MALE,
    },
    {
      value: secondOption,
      icon: UserGenderIcons.FEMALE,
    },
  ];

  describe('With the same props', () => {
    beforeEach(() => {
      cy.mount(
        <Toggle
          value={currentValue}
          onChange={cy.stub().as('onChangeFunction')}
          defaultValues={defaultValues}
        />,
      );
    });

    it('Should render a default toggle', () => {
      cy.get('div[data-cy=toggle-global]').should('exist');
      cy.get('div[data-cy=toggle-global]').should('be.visible');

      cy.get(
        'div[data-cy=toggle-global] button[data-cy=toggle-global-option]',
      ).should('have.length', defaultValues.length);
    });

    describe('Toggle Options', () => {
      it('Should render a Icon', () => {
        cy.get('div[data-cy=toggle-global]').find('svg').should('exist');
        cy.get('div[data-cy=toggle-global]').find('svg').should('be.visible');
      });

      it('Should be clickable', () => {
        cy.get(
          'div[data-cy=toggle-global] button[data-cy=toggle-global-option]',
        )
          .eq(1)
          .click()
          .then(() => {
            cy.get('@onChangeFunction').should(
              'have.been.calledOnceWithExactly',
              secondOption,
            );
          });
      });

      it('Should be disabled when selected', () => {
        cy.get(
          'div[data-cy=toggle-global] button[data-cy=toggle-global-option]',
        )
          .eq(0)
          .should('be.disabled');
      });
    });

    describe('Default style', () => {
      it('Should have the correct style', () => {
        cy.get('[data-cy=toggle-global]').should(
          'have.css',
          'background-color',
          hexToRgb(colors.whiteSmoke),
        );

        cy.get(
          'div[data-cy=toggle-global] button[data-cy=toggle-global-option]',
        )
          .eq(0)
          .should('have.css', 'background-color', hexToRgb(colors.primary));

        cy.get(
          'div[data-cy=toggle-global] button[data-cy=toggle-global-option]',
        )
          .eq(1)
          .should('have.css', 'background-color', 'rgba(0, 0, 0, 0)');
      });
    });
  });

  it('Should be disabled', () => {
    cy.mount(
      <Toggle
        value={currentValue}
        onChange={() => {}}
        defaultValues={defaultValues}
        disabled
      />,
    );

    cy.get(
      'div[data-cy=toggle-global] button[data-cy=toggle-global-option]',
    ).each((option) => {
      cy.wrap(option).should('be.disabled');
    });
  });
});
