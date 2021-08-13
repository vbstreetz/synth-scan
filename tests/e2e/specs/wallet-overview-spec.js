/* eslint-disable ui-testing/missing-assertion-in-test */
import WalletOverviewPage from '../pages/wallet-overview-page';

const walletOverview = new WalletOverviewPage();

let walletAddress = '0x8Dd7B3223b9c2f18b0F4b4108ed2A506f824b1ce';

describe('Wallet overview tests', () => {
  before(() => {
    walletOverview.visit();
  });
  context('Verify correct data is shown', () => {
    it(`after typing a wallet address which has locked SNX balance`, () => {
      walletOverview.getWalletAddressInput().type(`${walletAddress}{enter}`);
    });
  });
});
