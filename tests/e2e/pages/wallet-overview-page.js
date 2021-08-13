import Page from './page';

export default class WalletOverviewPage extends Page {
  getWalletAddressInput() {
    return cy.findByTestId('wallet-address-input').find('input');
  }

  getSynthBalanceRows() {
    return cy.findAllByTestId('synth-balance-row');
  }

  visit() {
    cy.visit('/');
  }
}
