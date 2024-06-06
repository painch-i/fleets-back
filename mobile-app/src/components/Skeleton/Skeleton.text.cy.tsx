import Skeleton from '@/components/Skeleton/Skeleton.text';

describe('Components | <Skeleton />', () => {
  it('Should render a default animated skeleton', () => {
    cy.mount(<Skeleton h={60} />);

    cy.get('[data-cy=skeleton-text]').should('exist');
    cy.get('[data-cy=skeleton-text]').should('be.visible');

    cy.get('[data-cy=skeleton-text]').should('have.attr', 'animated', 'true');
  });

  it('Should be able to change height, width and radius', () => {
    const size = 100;
    const radius = 5;

    cy.mount(<Skeleton h={size} w={size} radius={radius} />);

    cy.get('[data-cy=skeleton-text]').should('exist');
    cy.get('[data-cy=skeleton-text]').should('be.visible');

    cy.get('[data-cy=skeleton-text]').should('have.css', 'height', `${size}px`);
    cy.get('[data-cy=skeleton-text]').should('have.css', 'width', `${size}px`);
    cy.get('[data-cy=skeleton-text]').should(
      'have.css',
      'border-radius',
      `${radius}px`,
    );
  });
});
