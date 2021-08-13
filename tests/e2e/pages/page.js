export default class Page {
  getTitle() {
    return cy.title();
  }

  getMetamaskWalletAddress() {
    return cy.fetchMetamaskWalletAddress();
  }

  getSynthBalanceRows() {
    return cy.findAllByTestId('synth-balance-row');
  }

  getWalletAddressInput() {
    return cy.findByTestId('wallet-address-input').find('input');
  }
}
