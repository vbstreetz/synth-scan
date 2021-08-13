import Page from './page';

export default class TransactionsOverviewPage extends Page {
  getTransactionRows() {
    return cy.findAllByTestId('transaction-row');
  }

  visit() {
    cy.visit('/transactions-list');
  }
}
