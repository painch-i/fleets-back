import { STATION_GGV_MOCKED, STATION_GSL_MOCKED } from '@/__mocks__/station';
import { FLEET_MOCKED } from '@/__mocks__/fleet';
import { LINE_MOCKED } from '@/__mocks__/line';

import { GET_STATIONS_IN_LINE_API_PATH } from '@/features/search/api/use-stations-by-line.query';
import { SEARCH_FLEETS_API_PATH } from '@/features/search/api/use-search-fleets.query';
import { GET_LINES_API_PATH } from '@/features/search/api/use-lines.query';

describe('E2E | search | searchFleets', () => {
  beforeEach(() => {
    cy.login();
  });

  it('should be able to choose a date', () => {
    // Click on the date button
    cy.get('ion-datetime-button[data-cy="datetime-buttons-container"]')
      .find('button')
      .eq(0)
      .click();

    cy.get('ion-datetime[data-cy="datetime-modal-content"]').should(
      'be.visible',
    );

    // Click on the second date that is not disabled
    cy.get('ion-datetime[data-cy="datetime-modal-content"]')
      .find('button.calendar-day:not([disabled])')
      .eq(1)
      .click();

    // Close modal by clicking on the backdrop
    cy.get('ion-modal[data-cy="datetime-modal"]')
      .find('ion-backdrop')
      .click({ force: true });

    // Click on the hours button
    cy.get('ion-datetime-button[data-cy="datetime-buttons-container"]')
      .find('button')
      .eq(1)
      .click();

    cy.get('ion-datetime[data-cy="datetime-modal-content"]').should(
      'be.visible',
    );

    // Click on 17 for the hours
    cy.get('ion-datetime[data-cy="datetime-modal-content"]')
      .find('button.picker-item[data-index="17"]')
      .eq(0)
      .click();

    // Close modal by clicking on the backdrop
    cy.get('ion-modal[data-cy="datetime-modal"]')
      .find('ion-backdrop')
      .click({ force: true });
  });

  it('should open the transport mode modal when clicking on the line button', () => {
    cy.get('div[data-cy="line-picker"]').click();

    cy.get('ion-modal[data-cy="transport-mode-modal"]').should('be.visible');
  });

  it('should display an error message if there is an error in lines fetching', () => {
    cy.get('div[data-cy="line-picker"]').click();

    cy.get('ion-modal[data-cy="transport-mode-modal"]').should('be.visible');

    cy.get('div[data-cy="error-message"]').should('exist');
    cy.get('div[data-cy="error-message"]').should('be.visible');
  });

  it('should be able to choose a line', () => {
    cy.intercept('GET', GET_LINES_API_PATH, [LINE_MOCKED]).as('getLinesQuery');

    cy.wait('@getLinesQuery');

    cy.get('div[data-cy="line-picker"]').click();

    cy.get('ion-modal[data-cy="transport-mode-modal"]').should('be.visible');

    cy.get('div[data-cy="transport-icon"').eq(0).click();

    cy.get('ion-modal[data-cy="transport-mode-modal"]').should(
      'not.be.visible',
    );
  });

  describe('When a line is choosen', () => {
    beforeEach(() => {
      cy.intercept('GET', GET_LINES_API_PATH, [LINE_MOCKED]).as(
        'getLinesQuery',
      );

      cy.wait('@getLinesQuery');

      cy.get('div[data-cy="line-picker"]').click();
    });

    it('should be able to click on the station button and open the stations modal', () => {
      cy.get('div[data-cy="transport-icon"').eq(0).click();

      cy.get('div[data-cy="stations-card"]').click();

      cy.get('ion-modal[data-cy="stations-modal"]').should('be.visible');
    });

    it('should display an error message if there is an error in stations fetching', () => {
      cy.get('div[data-cy="transport-icon"').eq(0).click();

      cy.get('div[data-cy="stations-card"]').click();

      cy.get('ion-modal[data-cy="stations-modal"]').should('be.visible');

      cy.get('div[data-cy="error-message"]').should('exist');
      cy.get('div[data-cy="error-message"]').should('be.visible');
    });

    it('should fetch the stations linked to the line choosen', () => {
      cy.intercept('GET', `${GET_STATIONS_IN_LINE_API_PATH}?lineId=*`, [
        STATION_GGV_MOCKED,
        STATION_GSL_MOCKED,
      ]).as('getStationsInLineQuery');

      cy.get('div[data-cy="transport-icon"').eq(0).click();

      cy.wait('@getStationsInLineQuery').then((getStationsInLineQuery) => {
        expect(getStationsInLineQuery.request.query).to.deep.equal({
          lineId: LINE_MOCKED.id,
        });
      });
    });

    it('should be able to choose two stations', () => {
      cy.intercept('GET', `${GET_STATIONS_IN_LINE_API_PATH}?lineId=*`, [
        STATION_GGV_MOCKED,
        STATION_GSL_MOCKED,
      ]).as('getStationsInLineQuery');

      cy.get('div[data-cy="transport-icon"').eq(0).click();

      cy.wait('@getStationsInLineQuery');

      cy.get('div[data-cy="stations-card"]').click();

      cy.get('div[data-cy="station-picker"').each((stationPicker): void => {
        cy.wrap(stationPicker).click();
      });

      cy.get('button[data-cy="button-global"').eq(2).click();
    });
  });

  it('should be able to search a Fleet', () => {
    cy.intercept('GET', GET_LINES_API_PATH, [LINE_MOCKED]).as('getLinesQuery');

    cy.intercept('GET', `${GET_STATIONS_IN_LINE_API_PATH}?lineId=*`, [
      STATION_GGV_MOCKED,
      STATION_GSL_MOCKED,
    ]).as('getStationsInLineQuery');

    cy.wait('@getLinesQuery');

    cy.get('div[data-cy="line-picker"]').click();

    cy.get('div[data-cy="transport-icon"').eq(0).click();

    cy.wait('@getStationsInLineQuery');

    cy.get('div[data-cy="stations-card"]').click();

    cy.get('div[data-cy="station-picker"').each((stationPicker): void => {
      cy.wrap(stationPicker).click();
    });

    cy.get('button[data-cy="button-global"').eq(2).click();

    cy.intercept('GET', `${SEARCH_FLEETS_API_PATH}?*`, [FLEET_MOCKED]).as(
      'searchFleetsQuery',
    );

    cy.get('button[data-cy="button-global"]').eq(0).should('not.be.disabled');
    cy.get('button[data-cy="button-global"]').eq(0).click();

    cy.url().should('include', 'results-fleets');

    cy.wait('@searchFleetsQuery').then((getStationsInLineQuery): void => {
      expect(getStationsInLineQuery.request.query).to.deep.includes({
        startStationId: STATION_GGV_MOCKED.id,
        endStationId: STATION_GSL_MOCKED.id,
      });
    });
  });
});
