import SnxHoldersPage from '../pages/network-overview/snx-holders-page';

const snxHolders = new SnxHoldersPage();

describe('SNX holders tests', () => {
  before(() => {
    snxHolders.visit();
  });
  context('Verify correct data is shown', () => {
    it(`table shows top 99 SNX holders`, () => {
      snxHolders.getSnxHolderRows().then((snxHolderRow) => {
        snxHolderRow.should('be.visible');
      });
      snxHolders.getSnxHolderRows().should('have.length', 99);
    });
  });
});
