/* eslint-disable ui-testing/missing-assertion-in-test */
import WalletOverviewPage from '../pages/wallet-overview-page';

const walletOverview = new WalletOverviewPage();

// let metamaskWalletAddress;

describe('Wallet overview tests', () => {
  before(() => {
    walletOverview.getMetamaskWalletAddress().then((address) => {
      // metamaskWalletAddress = address;
    });
    walletOverview.visit();
  });
  context('Verify correct data', () => {
    it(`is shown after typing a wallet address which has SNX balance`, () => {});
  });
});
