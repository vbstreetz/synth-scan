import Page from '../page';

export default class SynthHoldersPage extends Page {
  getSynthHolderRows() {
    return cy.findAllByTestId('synth-holder-row');
  }

  getListButtons() {
    return cy.findAllByTestId('list-button');
  }

  getSynthHolderModal() {
    return cy.findByTestId('synth-holder-modal');
  }

  getCloseModalButton() {
    return cy.findByTestId('close-modal-button');
  }

  visit() {
    cy.visit('/network-overview/synth-holders');
  }
}
