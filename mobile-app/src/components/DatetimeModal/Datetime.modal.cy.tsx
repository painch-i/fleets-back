import { IonDatetimeButton } from '@ionic/react';

import DatetimeModal from '@/components/DatetimeModal/Datetime.modal';

describe('Components | <DatetimeModal />', () => {
  it('Should open the DatetimeModal', () => {
    cy.mount(
      <div>
        <IonDatetimeButton datetime="datetime" />
        <DatetimeModal value={new Date()} onUpdate={() => {}} />
      </div>,
    );

    cy.get('ion-datetime-button').find('button').eq(0).click();

    cy.get('ion-datetime[data-cy="datetime-modal-content"]').should(
      'be.visible',
    );
  });

  it('Should close when backdrop is clicked', () => {
    cy.mount(
      <div>
        <IonDatetimeButton datetime="datetime" />
        <DatetimeModal value={new Date()} onUpdate={() => {}} />
      </div>,
    );

    cy.get('ion-datetime-button').find('button').eq(0).click();

    cy.get('ion-backdrop').click({ force: true });

    cy.get('ion-datetime[data-cy="datetime-modal-content"]').should(
      'not.be.visible',
    );
    cy.get('ion-backdrop').should('not.be.visible');
  });

  it('Should be able to choose a date', () => {
    cy.mount(
      <div>
        <IonDatetimeButton datetime="datetime" />
        <DatetimeModal
          value={new Date()}
          onUpdate={cy.stub().as('onUpdateFunction')}
        />
      </div>,
    );

    cy.get('ion-datetime-button').find('button').eq(0).click();

    cy.get('ion-datetime[data-cy="datetime-modal-content"]')
      .find('button.calendar-day:not([disabled])')
      .eq(1)
      .click();

    cy.get('@onUpdateFunction').should('have.been.calledOn');
  });

  it('Should be able to choose hours / minutes', () => {
    cy.mount(
      <div>
        <IonDatetimeButton datetime="datetime" />
        <DatetimeModal
          value={new Date()}
          onUpdate={cy.stub().as('onUpdateFunction')}
        />
      </div>,
    );

    cy.get('ion-datetime-button').find('button').eq(1).click();

    cy.get('ion-datetime[data-cy="datetime-modal-content"]')
      .find('button.picker-item[data-index="17"]')
      .eq(0)
      .click();

    cy.get('@onUpdateFunction').should('have.been.calledOn');
  });
});
