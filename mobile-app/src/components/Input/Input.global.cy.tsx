import { FaRegEnvelope } from 'react-icons/fa';

import Input from '@/components/Input/Input.global';

import { colors } from '@/styles';
import { hexToRgb } from '@/utils/string';

describe('Components | <Input />', () => {
  it('Should render a default input with placeholder', () => {
    const placeholder = 'This is a test';

    cy.mount(<Input label="Testing" placeholder={placeholder} />);

    cy.get('div[data-cy=input-global]').find('input').should('exist');
    cy.get('div[data-cy=input-global]').find('input').should('not.be.disabled');
    cy.get('div[data-cy=input-global]')
      .find('input')
      .should('have.attr', 'placeholder', placeholder);
  });

  it('Should render a input with an Icon', () => {
    cy.mount(<Input label="Testing" icon={<FaRegEnvelope size={20} />} />);

    cy.get('div[data-cy=input-global]').find('svg').should('exist');
  });

  it('Should be able to change value', () => {
    cy.mount(<Input label="Testing" />);

    const text = 'This is a test';

    cy.get('div[data-cy=input-global]').find('input').type(text);
    cy.get('div[data-cy=input-global]')
      .find('input')
      .should('have.value', text);
  });

  it('Should trigger onChange callback when input value changes', () => {
    cy.mount(
      <Input label="Testing" onChange={cy.stub().as('onChangeFunction')} />,
    );

    const text = 'This is a test';

    cy.get('div[data-cy=input-global]').find('input').type(text);
    cy.get('div[data-cy=input-global]')
      .find('input')
      .should('have.value', text);

    cy.get('@onChangeFunction').should('have.been.calledOn');
  });

  it('Should display an error and have a red bottom border', () => {
    const error = 'There is an error';

    cy.mount(<Input label="Testing" error={error} />);

    cy.get('p[data-cy=input-global-error]').should('be.visible');
    cy.get('p[data-cy=input-global-error]').should('have.text', error);

    cy.get('div[data-cy=input-global] div').should(
      'have.css',
      'border-bottom-color',
      hexToRgb(colors.danger),
    );
  });

  describe('When variant = default / undefined', () => {
    it('Should render with default style', () => {
      cy.mount(<Input label="Testing" />);

      cy.get('div[data-cy=input-global] div').should(
        'have.css',
        'border-bottom',
        `1px solid ${hexToRgb(colors.border)}`,
      );
    });
  });

  describe('When variant = outline', () => {
    it('Should render with default style', () => {
      cy.mount(<Input label="Testing" variant="outline" />);

      cy.get('div[data-cy=input-global] div').should(
        'have.css',
        'border',
        `1px solid ${hexToRgb(colors.border)}`,
      );

      cy.get('div[data-cy=input-global] div').should(
        'have.css',
        'background-color',
        hexToRgb(colors.light),
      );
    });
  });

  describe('When variant = subtle', () => {
    it('Should render with default style', () => {
      cy.mount(<Input label="Testing" variant="subtle" />);

      const rbgWhiteSmoke = hexToRgb(colors.whiteSmoke);

      cy.get('div[data-cy=input-global] div').should(
        'have.css',
        'border',
        `1px solid ${rbgWhiteSmoke}`,
      );

      cy.get('div[data-cy=input-global] div').should(
        'have.css',
        'background-color',
        rbgWhiteSmoke,
      );
    });
  });
});
