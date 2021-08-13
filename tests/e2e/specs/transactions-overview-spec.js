import TransactionsOverviewPage from '../pages/transactions-overview-page';

const transactionsOverview = new TransactionsOverviewPage();

let walletAddress = '0x8Dd7B3223b9c2f18b0F4b4108ed2A506f824b1ce';

describe('Transaction overview tests', () => {
  before(() => {
    transactionsOverview.visit();
  });
  context('Verify correct data is shown after typing a wallet address', () => {
    before(() => {
      transactionsOverview
        .getWalletAddressInput()
        .type(`${walletAddress}{enter}`);
    });
    it(`transactions are shown in a table`, () => {
      transactionsOverview.getTransactionRows().then((transactionRow) => {
        transactionRow.should('be.visible');
      });
    });
  });
});
