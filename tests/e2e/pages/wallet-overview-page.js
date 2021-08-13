import Page from './page';

export default class WalletOverviewPage extends Page {
  visit() {
    cy.visit('/');
  }
}
