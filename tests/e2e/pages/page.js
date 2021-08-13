export default class Page {
  getTitle() {
    return cy.title();
  }

  getMetamaskWalletAddress() {
    return '0x8Dd7B3223b9c2f18b0F4b4108ed2A506f824b1ce';
    // return cy.fetchMetamaskWalletAddress();
  }
}
