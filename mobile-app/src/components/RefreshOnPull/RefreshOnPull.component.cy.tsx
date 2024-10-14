import { IonContent, IonPage } from '@ionic/react';

import RefreshOnPull from '@/components/RefreshOnPull/RefreshOnPull.component';

describe('Components | <RefreshOnPull />', () => {
  it('Should render an inactive RefreshOnPull', () => {
    cy.mount(
      <IonPage>
        <IonContent>
          <RefreshOnPull onRefresh={async () => {}} />
        </IonContent>
      </IonPage>,
    );

    cy.get('[data-cy=refresh-on-pull]').should('exist');
    cy.get('[data-cy=refresh-on-pull] div[class*=refresher-pulling]').should(
      'not.be.visible',
    );
  });
});
