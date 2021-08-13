import Page from '../page';

export default class SnxHoldersPage extends Page {
  getSnxHolderRows() {
    return cy.findAllByTestId('snx-holder-row');
  }

  visit() {
    cy.visit('/network-overview/snx-holders');
  }
}
