import Page from '../page';

export default class SnxHoldersPage extends Page {
  visit() {
    cy.visit('/network-overview/snx-holders');
  }
}
