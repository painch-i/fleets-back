import Skeleton from '@/components/Skeleton/Skeleton.text';

describe('Components | <Skeleton />', () => {
  it('Should render a default animated skeleton', () => {
    cy.mount(<Skeleton className="h-14" />);
    cy.get('[data-cy=skeleton-text]').should('exist');
    cy.get('[data-cy=skeleton-text]').should('be.visible');

    cy.get('[data-cy=skeleton-text]').should('have.attr', 'animated', 'true');
  });
});
