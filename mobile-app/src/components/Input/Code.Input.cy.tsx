import CodeInput from '@/components/Input/Code.input';

describe('Components | <CodeInput />', () => {
  it('Should render a default CodeInput of 6 input fields', () => {
    cy.mount(<CodeInput onChange={() => {}} />);

    cy.get('input').should('have.length', 6);
  });

  it('Should render the correct number of input fields', () => {
    const length = 3;

    cy.mount(<CodeInput length={length} onChange={() => {}} />);

    cy.get('input').should('have.length', length);
  });

  it('Should fire onChange with the correct value when inputs are filled', () => {
    const handleChange = cy.spy();

    cy.mount(<CodeInput onChange={handleChange} />);

    const inputs = Array.from({ length: 6 }, (_, i) => `code-input-${i}`);

    inputs.forEach((input, index) => {
      cy.get(`[data-cy=${input}]`).type(String(index + 1));
    });

    cy.wrap(handleChange).should('have.been.calledWith', '123456');
  });

  it('Should allow only one character per input field', () => {
    cy.mount(<CodeInput onChange={() => {}} />);

    cy.get('[data-cy=code-input-0]').type('12').should('have.value', '1');
  });

  it('Should move focus to the next input after typing', () => {
    cy.mount(<CodeInput onChange={() => {}} />);

    cy.get('[data-cy="code-input-0"]').type('1');
    cy.get('[data-cy="code-input-1"]').should('be.focused');
  });
});
