import Page from '../page';

export default class SynthHoldersPage extends Page {
  visit() {
    cy.visit('/network-overview/synth-holders');
  }
}
