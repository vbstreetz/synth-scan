import Page from './page';

export default class WalletOverviewPage extends Page {
  getWalletAddressInput() {
    return cy.findByTestId('wallet-address-input').find('input');
  }

  visit() {
    cy.visit('/');
  }
}
