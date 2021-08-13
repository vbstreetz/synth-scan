/* eslint-disable ui-testing/missing-assertion-in-test */
import WalletOverviewPage from '../pages/wallet-overview-page';

const walletOverview = new WalletOverviewPage();

let metamaskWalletAddress;

describe('Wallet overview tests', () => {
  before(() => {
    walletOverview.getMetamaskWalletAddress().then((address) => {
      metamaskWalletAddress = address;
    });
    walletOverview.visit();
  });
  context('Verify correct data is shown', () => {
    it(`after typing a wallet address which has locked SNX balance`, () => {
      walletOverview
        .getWalletAddressInput()
        .type(`${metamaskWalletAddress}{enter}`);
    });
  });
});
