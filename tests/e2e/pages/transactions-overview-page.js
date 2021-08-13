import Page from './page';

export default class TransactionsOverviewPage extends Page {
  visit() {
    cy.visit('/transactions-list');
  }
}
