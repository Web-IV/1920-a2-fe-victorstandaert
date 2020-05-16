import { createPartiallyEmittedExpression } from "typescript"

function goToMetingList(){ //ga naar de metinglijst pagina
  cy.visit('/')
  cy.location('pathname').should('equal', '/login')

  // enter valid username and password
  cy.get('[data-cy=login-email]').type('student@hogent.be')
  cy.get('[data-cy=login-password]').type('P@ssword1111')
  cy.contains('button', 'Login').click()
}

function goToAddMeting(){ //ga naar de nieuwe meting toevoegen pagina
  cy.visit('/')
  cy.location('pathname').should('equal', '/login')

  // enter valid username and password
  cy.get('[data-cy=login-email]').type('student@hogent.be')
  cy.get('[data-cy=login-password]').type('P@ssword1111')
  cy.contains('button', 'Login').click()

  cy.visit('/meting/add')
}

function goToMetingAnalyse1(){ //ga naar de eerste meting analyse
  cy.visit('/')
  cy.location('pathname').should('equal', '/login')

  // enter valid username and password
  cy.get('[data-cy=login-email]').type('student@hogent.be')
  cy.get('[data-cy=login-password]').type('P@ssword1111')
  cy.contains('button', 'Login').click()

  cy.get('app-meting').eq(0).parent().click(); //klik op de eerste meting (id=1)
}

function goToMetingAnalyse2(){ //ga naar de tweede meting analyse
  cy.visit('/')
  cy.location('pathname').should('equal', '/login')

  // enter valid username and password
  cy.get('[data-cy=login-email]').type('student@hogent.be')
  cy.get('[data-cy=login-password]').type('P@ssword1111')
  cy.contains('button', 'Login').click()

  cy.get('app-meting').eq(1).parent().click(); //klik op de eerste meting (id=2)
}

describe('My First Test', function() {
  
  it('Filter', function() {            //test filter
    
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
  
  it('AddMetingt', function(){           //test add meting (formule)

    var vijftigRechts = [];
    for(var i = 0; i <= 50; i++){
      vijftigRechts[i] = '{rightarrow}';
    }

    var vijventwintigLinks = [];
    for(var i = 0; i < 25; i++){
      vijventwintigLinks[i] = '{leftarrow}';
    }

    goToAddMeting(); 
    //cy.get('[data-cy=openvouwknop]').click({multiple: true}); //openen collapsables
    //#region add meting inputs
    cy.get('[data-cy=werk]').type('{home}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}'); //naar 50
      cy.get('[data-cy=werkAdmin]').type('{home}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}'); //naar 50
      cy.get('[data-cy=werkAdminIN]').type('{home}'); //naar 0
      cy.get('[data-cy=werkAdminUIT]').type('{end}'); //naar 100

      cy.get('[data-cy=werkTelKlant]').type('{home}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}'); // naar 30
      cy.get('[data-cy=werkTelKlantIN]').type('{home}' + vijftigRechts.toString() + '{leftarrow}'); //naar 50
      cy.get('[data-cy=werkTelKlantUIT]').type(vijftigRechts.toString()); //naar 50

      cy.get('[data-cy=werkBezKlant]').type('{home}{rightarrow}{rightarrow}{rightarrow}{rightarrow}'); //naar 20
      cy.get('[data-cy=werkBezKlantIN]').type('{end}' + vijventwintigLinks.toString()); //naar 75
      cy.get('[data-cy=werkBezKlantUIT]').type('{rightarrow}' + vijventwintigLinks.toString()); //naar -25

    cy.get('[data-cy=relaties]').type('{home}{rightarrow}{rightarrow}{rightarrow}{rightarrow}'); //naar 20
      cy.get('[data-cy=relatiesPartner]').type('{home}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}'); //naar 50
      cy.get('[data-cy=relatiesPartnerIN]').type('{home}'); //blijft 0
      cy.get('[data-cy=relatiesPartnerUIT]').type('{end}'); //naar 100

      cy.get('[data-cy=relatiesKinderen]').type('{home}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}'); // naar 30
      cy.get('[data-cy=relatiesKinderenIN]').type('{home}' + vijftigRechts.toString() + '{leftarrow}'); //naar 50
      cy.get('[data-cy=relatiesKinderenUIT]').type(vijftigRechts.toString()); //naar 50

      cy.get('[data-cy=relatiesOuders]').type('{home}{rightarrow}{rightarrow}{rightarrow}{rightarrow}'); //naar 20
      cy.get('[data-cy=relatiesOudersIN]').type('{end}' + vijventwintigLinks.toString()); //naar 75
      cy.get('[data-cy=relatiesOudersUIT]').type('{rightarrow}' + vijventwintigLinks.toString()); //naar -25

    cy.get('[data-cy=gezondheid]').type('{home}{rightarrow}{rightarrow}{rightarrow}{rightarrow}'); //naar 20
      cy.get('[data-cy=gezondheidVoeding]').type('{home}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}'); //naar 50
      cy.get('[data-cy=gezondheidVoedingIN]').type('{home}'); //blijft 0
      cy.get('[data-cy=gezondheidVoedingUIT]').type('{end}'); //naar 100

      cy.get('[data-cy=gezondheidSport]').type('{home}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}'); // naar 30
      cy.get('[data-cy=gezondheidSportIN]').type('{home}' + vijftigRechts.toString() + '{leftarrow}'); //naar 50
      cy.get('[data-cy=gezondheidSportUIT]').type(vijftigRechts.toString()); //naar 50

      cy.get('[data-cy=gezondheidYoga]').type('{home}{rightarrow}{rightarrow}{rightarrow}{rightarrow}'); //naar 20
      cy.get('[data-cy=gezondheidYogaIN]').type('{end}' + vijventwintigLinks.toString()); //naar 75
      cy.get('[data-cy=gezondheidYogaUIT]').type('{rightarrow}' + vijventwintigLinks.toString()); //naar -25

    cy.get('[data-cy=vrijetijd]').type('{home}{rightarrow}{rightarrow}'); //naar 10
      cy.get('[data-cy=vrijetijdSM]').type('{home}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}'); //naar 50
      cy.get('[data-cy=vrijetijdSMIN]').type('{home}'); //blijft 0
      cy.get('[data-cy=vrijetijdSMUIT]').type('{end}'); //naar 100

      cy.get('[data-cy=vrijetijdTV]').type('{home}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}'); // naar 30
      cy.get('[data-cy=vrijetijdTVIN]').type('{home}' + vijftigRechts.toString() + '{leftarrow}'); //naar 50
      cy.get('[data-cy=vrijetijdTVUIT]').type(vijftigRechts.toString()); //naar 50

      cy.get('[data-cy=vrijetijdHobby]').type('{home}{rightarrow}{rightarrow}{rightarrow}{rightarrow}'); //naar 20
      cy.get('[data-cy=vrijetijdHobbyIN]').type('{end}' + vijventwintigLinks.toString()); //naar 75
      cy.get('[data-cy=vrijetijdHobbyUIT]').type('{rightarrow}' + vijventwintigLinks.toString()); //naar -25

    //#endregion
 
    cy.contains('button', 'Opslaan').click();
    cy.visit('/meting/list');

    cy.get('[data-cy=metingCard]:last').contains('Werk: 26');
    cy.get('[data-cy=metingCard]:last').contains('Relaties: 10');
    cy.get('[data-cy=metingCard]:last').contains('Gezondheid: 10');
    cy.get('[data-cy=metingCard]:last').contains('Vrije tijd: 5');
    cy.get('[data-cy=metingCard]:last').contains('Score: 51');

  })

  it('AddMetingValidatie', function(){ //errormeldingen testen

    goToAddMeting();
    //cy.get('[data-cy=openvouwknop]').click({multiple: true});

    cy.get('[data-cy=werk]').type('{home}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}'); //naar 50
      cy.get('[data-cy=werkAdmin]').type('{home}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}'); //naar 50
      cy.get('[data-cy=werkTelKlant]').type('{home}'); //naar 0
      cy.get('[data-cy=werkBezKlant]').type('{home}'); //naar 0

    cy.get('[data-cy=errorWerk]').should('be.visible');
    cy.get('[data-cy=errorOnderCatWerk]').should('be.visible');

    cy.get('[data-cy=relaties]').type('{home}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}'); //naar 50
      cy.get('[data-cy=relatiesPartner]').type('{home}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}'); //naar 50
      cy.get('[data-cy=relatiesKinderen]').type('{home}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}'); // naar 30
      cy.get('[data-cy=relatiesOuders]').type('{home}{rightarrow}{rightarrow}{rightarrow}{rightarrow}'); //naar 20

    cy.get('[data-cy=errorRelaties]').should('not.be.visible');
    cy.get('[data-cy=errorOnderCatRelaties]').should('not.be.visible');

  }) 

  it('Analysetest1', function(){ //test wanneer er op een meting wordt gedrukt, je wel naar de juiste metinganalyse pagina wordt gestuurd
    goToMetingAnalyse1();

    cy.location('pathname').should('equal', '/meting/analyse/1')
  })

  it('Analysetest2', function(){
    goToMetingAnalyse2();

    cy.location('pathname').should('equal', '/meting/analyse/2')
  })

})

