import { setupIonicReact } from '@ionic/react';
import { mount, MountOptions, MountReturn } from 'cypress/react18';

import '@cypress/support/commands';
import '@/global.css';

setupIonicReact();

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Mounts a React node
       * @example cy.mount(</Fragment>)
       * @param component React Node to mount
       * @param options Additional options to pass into mount
       */
      mount(
        component: React.ReactNode,
        options?: MountOptions,
      ): Cypress.Chainable<MountReturn>;
    }
  }
}

Cypress.Commands.add('mount', mount);
