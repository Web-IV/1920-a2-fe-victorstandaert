import { createPartiallyEmittedExpression } from "typescript"

function goToMetingList(){
  cy.visit('/')
  cy.location('pathname').should('equal', '/login')

  // enter valid username and password
  cy.get('[data-cy=login-email]').type('student@hogent.be')
  cy.get('[data-cy=login-password]').type('P@ssword1111')
  cy.contains('button', 'Login').click()
}

function goToAddMeting(){
  cy.visit('/')
  cy.location('pathname').should('equal', '/login')

  // enter valid username and password
  cy.get('[data-cy=login-email]').type('student@hogent.be')
  cy.get('[data-cy=login-password]').type('P@ssword1111')
  cy.contains('button', 'Login').click()

  cy.visit('/meting/add')
}

describe('My First Test', function() {
  it('Filtertesten', function() {            //test filter
    
    goToMetingList();

    cy.get('[data-cy=filterInput]').type('maart');
    cy.get('[data-cy=metingCard]').should('have.length', 1);    

    cy.get('[data-cy=filterInput]').type('Maart');
    cy.get('[data-cy=metingCard]').should('have.length', 1);

    cy.get('[data-cy=filterInput]').type('maart 26');
    cy.get('[data-cy=metingCard]').should('have.length', 1);

    cy.get('[data-cy=filterInput]').type('maart 27');
    cy.get('[data-cy=metingCard]').should('have.length', 0);
  });
  
  it('AddMetingtesten', function(){           //test add meting (formule)

    goToAddMeting();

    cy.get('[data-cy=openvouwknop]').click({multiple: true}); //openen collapsables
    //#region add meting inputs
    cy.get('[data-cy=werk]').type('50');
      cy.get('[data-cy=werkAdmin]').type('50');
      cy.get('[data-cy=werkAdminIN]').type('0');
      cy.get('[data-cy=werkAdminUIT]').type('100');

      cy.get('[data-cy=werkTelKlant]').type('30');
      cy.get('[data-cy=werkTelKlantIN]').type('50');
      cy.get('[data-cy=werkTelKlantUIT]').type('50');

      cy.get('[data-cy=werkBezKlant]').type('20');
      cy.get('[data-cy=werkBezKlantIN]').type('75');
      cy.get('[data-cy=werkBezKlantUIT]').type('-25');

    cy.get('[data-cy=relaties]').type('20');
      cy.get('[data-cy=relatiesPartner]').type('50');
      cy.get('[data-cy=relatiesPartnerIN]').type('-0');
      cy.get('[data-cy=relatiesPartnerUIT]').type('100');

      cy.get('[data-cy=relatiesKinderen]').type('30');
      cy.get('[data-cy=relatiesKinderenIN]').type('50');
      cy.get('[data-cy=relatiesKinderenUIT]').type('50');

      cy.get('[data-cy=relatiesOuders]').type('20');
      cy.get('[data-cy=relatiesOudersIN]').type('75');
      cy.get('[data-cy=relatiesOudersUIT]').type('-25');

    cy.get('[data-cy=gezondheid]').type('20');

      cy.get('[data-cy=gezondheidVoeding]').type('50');
      cy.get('[data-cy=gezondheidVoedingIN]').type('0');
      cy.get('[data-cy=gezondheidVoedingUIT]').type('100');

      cy.get('[data-cy=gezondheidSport]').type('30');
      cy.get('[data-cy=gezondheidSportIN]').type('50');
      cy.get('[data-cy=gezondheidSportUIT]').type('50');

      cy.get('[data-cy=gezondheidYoga]').type('20');
      cy.get('[data-cy=gezondheidYogaIN]').type('75');
      cy.get('[data-cy=gezondheidYogaUIT]').type('-25');

    cy.get('[data-cy=vrijetijd]').type('10');
      cy.get('[data-cy=vrijetijdSM]').type('50');
      cy.get('[data-cy=vrijetijdSMIN]').type('0');
      cy.get('[data-cy=vrijetijdSMUIT]').type('100');

      cy.get('[data-cy=vrijetijdTV]').type('30');
      cy.get('[data-cy=vrijetijdTVIN]').type('50');
      cy.get('[data-cy=vrijetijdTVUIT]').type('50');

      cy.get('[data-cy=vrijetijdHobby]').type('20');
      cy.get('[data-cy=vrijetijdHobbyIN]').type('75');
      cy.get('[data-cy=vrijetijdHobbyUIT]').type('-25');

    //#endregion
 
    cy.contains('button', 'Opslaan').click();
    cy.visit('/meting/list');

    cy.get('[data-cy=metingCard]:last').contains('Werk: 26');
    cy.get('[data-cy=metingCard]:last').contains('Relaties: 10');
    cy.get('[data-cy=metingCard]:last').contains('Gezondheid: 10');
    cy.get('[data-cy=metingCard]:last').contains('Vrije tijd: 5');
    cy.get('[data-cy=metingCard]:last').contains('Score: 51');

  })

})

