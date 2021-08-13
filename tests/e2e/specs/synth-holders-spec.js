import SynthHoldersPage from '../pages/network-overview/synth-holders-page';

const synthHolders = new SynthHoldersPage();

describe('Synth holders tests', () => {
  before(() => {
    synthHolders.visit();
  });
  context('Verify correct data is shown', () => {
    it(`table shows top 99 Synth holders`, () => {
      synthHolders.getSynthHolderRows().then((synthHolderRow) => {
        synthHolderRow.should('be.visible');
      });
      synthHolders.getSynthHolderRows().should('have.length', 99);
    });

    it(`should be able to view the list of synths of specific synth holder`, () => {
      synthHolders.getListButtons().first().click();
      synthHolders.getSynthHolderModal().should('be.visible');
    });

    it(`should be able to close the list of synths`, () => {
      synthHolders.getCloseModalButton().click();
      synthHolders.getSynthHolderModal().should('not.be.visible');
    });
  });
});
