import { MetingDataService } from '../meting-data.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Subject, Observable, of, EMPTY, merge } from 'rxjs';
import { Meting } from '../meting.model';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  FormArray,
} from '@angular/forms';
import { Resultaat } from '../resultaat.model';
import { debounceTime, distinctUntilChanged, catchError } from 'rxjs/operators';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ConditionalExpr } from '@angular/compiler';

//#region custom validations
function validateCategorien(control: FormGroup): { [key: string]: any } { //als de som van de categorieën niet gelijk is aan 100 => geef error
  if(
    parseInt(control.get('werk').value) +
    parseInt(control.get('relaties').value) +
    parseInt(control.get('gezondheid').value) +
    parseInt(control.get('vrijetijd').value) != 100
  ) { 
    return { nietHonderdSamen: true }; 
  }

  return null;
}

function validateOnderCategorien1(control : FormGroup): { [key: string]: any } { //als de som van deze ondercategorieën niet gelijk is aan 100 => geef error
  
  if(document.getElementById("werkLabel").innerHTML != "0"){ //als de categorie nog op 0 staat, moet er niet gecontrolleerd worden of de subcategorieen gelijk zijn aan 100
    if(
      parseInt(control.get('werk_Administratie').value) +
      parseInt(control.get('werk_BezoekenKlanten').value) +
      parseInt(control.get('werk_TelefonerenKlanten').value) != 100
    ){
      return { nietHonderdSamen1: true }
    } 
  }
  
  
  return null;
}

function validateOnderCategorien3(control : FormGroup): { [key: string]: any } { //als de som van deze ondercategorieën niet gelijk is aan 100 => geef error
  
  if(document.getElementById("gezondheidLabel").innerHTML != "0"){//als de categorie nog op 0 staat, moet er niet gecontrolleerd worden of de subcategorieen gelijk zijn aan 100
    if(
      parseInt(control.get('gezondheid_Voeding').value) +
      parseInt(control.get('gezondheid_Sport').value) +
      parseInt(control.get('gezondheid_Yoga').value) != 100
    ){
      return {nietHonderdSamen3: true }
    }
  }
  
  
  return null;
}

function validateOnderCategorien2(control : FormGroup): { [key: string]: any } { //als de som van deze ondercategorieën niet gelijk is aan 100 => geef error
  
  if(document.getElementById("relatiesLabel").innerHTML != "0"){//als de categorie nog op 0 staat, moet er niet gecontrolleerd worden of de subcategorieen gelijk zijn aan 100
    if(
      parseInt(control.get('relaties_Partner').value) +
      parseInt(control.get('relaties_Kinderen').value) +
      parseInt(control.get('relaties_Ouders').value) != 100
    ){
      return { nietHonderdSamen2: true }
    }
  }
  
  
  return null;
}

function validateOnderCategorien4(control : FormGroup): { [key: string]: any } { //als de som van deze ondercategorieën niet gelijk is aan 100 => geef error
  
  if(document.getElementById("vrijetijdLabel").innerHTML != "0"){//als de categorie nog op 0 staat, moet er niet gecontrolleerd worden of de subcategorieen gelijk zijn aan 100
    if(
      parseInt(control.get('vrijetijd_SM').value) +
      parseInt(control.get('vrijetijd_TV').value) +
      parseInt(control.get('vrijetijd_Hobby').value) != 100
    ){
      return {nietHonderdSamen4: true }
    }
  }
  
  
  return null;
}
//#endregion

@Component({
  selector: 'app-add-meting',
  templateUrl: './add-meting.component.html',
  styleUrls: ['./add-meting.component.css'],
})
export class AddMetingComponent implements OnInit {
  public meting: FormGroup;
  public errorMessage: string = '';
  public confirmationMessage: string = '';
  private _fetchMetingen$: Observable<Meting[]>;
  value = 0;
  floatLabelControl = new FormControl('auto');

  constructor(
    private fb: FormBuilder,
    private _metingDataService: MetingDataService,
    private _router : Router
  ) {}

  get resultaten(): FormArray {
    return <FormArray>this.meting.get('resultaten');
  }
  ngOnInit() : void {

    this.meting = this.fb.group({ //formgroup van een meting
      floatLabel: this.floatLabelControl,
      id: [''], //wordt automatisch toegewezen in backend
      werk: [0],
      relaties: [0],
      gezondheid: [0],
      vrijetijd: [0],
      resultaten: this.fb.array([this.createResultaten()]) //formarray van resultaten
    }, {validator: validateCategorien}
    );

    //#region open- en dichvouwen knop
    var coll = document.getElementsByClassName("collapsible");  
    var i;

    for (i = 0; i < coll.length; i++) {
      coll[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.display === "block") {
          content.style.display = "none";
        } else {
          content.style.display = "block";
        }
      });
    }
    //#endregion
  }

  //label aan slider-value gelijk stellen
  onInputChange(event: any, id: any) {
      document.getElementById(id).innerHTML = event.value;
      this.resultaten.patchValue([ //bij verandering van een slider, wordt de vraag veranderd (naar dezelfde waarde) omdat dan de validators opnieuw worden geccontrolleerd
        {vraag: "startwaarde"}
      ]);
  }  

  createResultaten(): FormGroup { //formgroup van een resultaat
    return this.fb.group(
      {
        vraag: ['startwaarde'],
        amount: [0],

        //#region alle subcategorie inputvelden
        werk_Administratie: ['0'],
        werk_BezoekenKlanten: ['0'],
        werk_TelefonerenKlanten: ['0'],
        werk_AdministratieIN: ['0'],
        werk_BezoekenKlantenIN: ['0'],
        werk_TelefonerenKlantenIN: ['0'],
        werk_AdministratieUIT: ['0'],
        werk_BezoekenKlantenUIT: ['0'],
        werk_TelefonerenKlantenUIT: ['0'],

        relaties_Partner: ['0'],
        relaties_Kinderen: ['0'],
        relaties_Ouders: ['0'],
        relaties_PartnerIN: ['0'],
        relaties_KinderenIN: ['0'],
        relaties_OudersIN: ['0'],
        relaties_PartnerUIT: ['0'],
        relaties_KinderenUIT: ['0'],
        relaties_OudersUIT: ['0'],

        gezondheid_Voeding: ['0'],
        gezondheid_Sport: ['0'],
        gezondheid_Yoga: ['0'],
        gezondheid_VoedingIN: ['0'],
        gezondheid_SportIN: ['0'],
        gezondheid_YogaIN: ['0'],
        gezondheid_VoedingUIT: ['0'],
        gezondheid_SportUIT: ['0'],
        gezondheid_YogaUIT: ['0'],

        vrijetijd_SM: ['0'],
        vrijetijd_TV: ['0'],
        vrijetijd_Hobby: ['0'],
        vrijetijd_SMIN: ['0'],
        vrijetijd_TVIN: ['0'],
        vrijetijd_HobbyIN: ['0'],
        vrijetijd_SMUIT: ['0'],
        vrijetijd_TVUIT: ['0'],
        vrijetijd_HobbyUIT: ['0']
        //#endregion
      },
      {validators: [validateOnderCategorien1, validateOnderCategorien2, validateOnderCategorien3, validateOnderCategorien4]},
    );
  }

  onSubmit() {

    //#region amount en vraag aanpassen voor werk-categorie door in formule te steken
    let energieINenUITsubcat1 = this.meting.value.resultaten.map(res => [res.werk_AdministratieIN, res.werk_AdministratieUIT, //ondercategorieen energie IN en UIT mappen
                                                                  res.werk_TelefonerenKlantenIN, res.werk_TelefonerenKlantenUIT,
                                                                  res.werk_BezoekenKlantenIN, res.werk_BezoekenKlantenUIT]);
    let ondercategorien1 = this.meting.value.resultaten.map(res => [res.werk_Administratie, res.werk_TelefonerenKlanten, res.werk_BezoekenKlanten]); //ondercategorieen waarde mappen
    let categorie1 = this.meting.value.werk;

    let eindres1 = this.berekenEindresultaatCategorie(ondercategorien1, categorie1, energieINenUITsubcat1); //eindres van één subcategorie berekenen
    eindres1 = parseFloat(eindres1.toFixed(0));

    this.resultaten.patchValue([ //dit eindresultaat van één subcat in resultaten patchen
      {vraag: "Werk", amount: eindres1}
    ]);
    //#endregion
    let resultaten = this.meting.value.resultaten.map(Resultaat.fromJSON); //dit eindresultaat van één subcat in resultaten patchen

    //#region amount en vraag aanpassen voor relaties-categorie door in formule te steken
    let energieINenUITsubcat2 = this.meting.value.resultaten.map(res => [res.relaties_PartnerIN, res.relaties_PartnerUIT, //ondercategorieen energie IN en UIT mappen
                                                                  res.relaties_KinderenIN, res.relaties_KinderenUIT,
                                                                  res.relaties_OudersIN, res.relaties_OudersUIT])
    let ondercategorien2 = this.meting.value.resultaten.map(res => [res.relaties_Partner, res.relaties_Kinderen, res.relaties_Ouders]); //ondercategorieen waarde mappen
    let categorie2 = this.meting.value.relaties;

    let eindres2 = this.berekenEindresultaatCategorie(ondercategorien2, categorie2, energieINenUITsubcat2); //eindres van één subcategorie berekenen
    eindres2 = parseFloat(eindres2.toFixed(0));

    this.resultaten.patchValue([ //dit eindresultaat van één subcat in resultaten patchen
      {vraag: "Relaties", amount: eindres2}
    ]);
    //#endregion
    resultaten.push(this.meting.value.resultaten.map(Resultaat.fromJSON)[0]); //dit eindresultaat van één subcat in resultaten patchen

    //#region amount en vraag aanpassen voor gezondheid-categorie door in formule te steken
    let energieINenUITsubcat3 = this.meting.value.resultaten.map(res => [res.gezondheid_VoedingIN, res.gezondheid_VoedingUIT, //ondercategorieen energie IN en UIT mappen
                                                                  res.gezondheid_SportIN, res.gezondheid_SportUIT,
                                                                  res.gezondheid_YogaIN, res.gezondheid_YogaUIT])
    let ondercategorien3 = this.meting.value.resultaten.map(res => [res.gezondheid_Voeding, res.gezondheid_Sport, res.gezondheid_Yoga]); //ondercategorieen waarde mappen
    let categorie3 = this.meting.value.gezondheid;

    let eindres3 = this.berekenEindresultaatCategorie(ondercategorien3, categorie3, energieINenUITsubcat3); //eindres van één subcategorie berekenen
    eindres3 = parseFloat(eindres3.toFixed(0));
    
    this.resultaten.patchValue([ //dit eindresultaat van één subcat in resultaten patchen
      {vraag: "Gezondheid", amount: eindres3}
    ]);
    //#endregion
    resultaten.push(this.meting.value.resultaten.map(Resultaat.fromJSON)[0]); //dit eindresultaat van één subcat in resultaten patchen

    //#region amount en vraag aanpassen voor vrije tijd-categorie door in formule te steken
    let energieINenUITsubcat4 = this.meting.value.resultaten.map(res => [res.vrijetijd_SMIN, res.vrijetijd_SMUIT, //ondercategorieen energie IN en UIT mappen
                                                                  res.vrijetijd_TVIN, res.vrijetijd_TVUIT,
                                                                  res.vrijetijd_HobbyIN, res.vrijetijd_HobbyUIT])
    let ondercategorien4 = this.meting.value.resultaten.map(res => [res.vrijetijd_SM, res.vrijetijd_TV, res.vrijetijd_Hobby]); //ondercategorieen waarde mappen
    let categorie4 = this.meting.value.vrijetijd; //categorie waarde in let steken

    let eindres4 = this.berekenEindresultaatCategorie(ondercategorien4, categorie4, energieINenUITsubcat4); //eindres van één subcategorie berekenen
    eindres4 = parseFloat(eindres4.toFixed(0));

    this.resultaten.patchValue([ //dit eindresultaat van één subcat in resultaten patchen
      {vraag: "Vrije tijd", amount: eindres4}
    ]);
    //#endregion
    resultaten.push(this.meting.value.resultaten.map(Resultaat.fromJSON)[0]); //dit eindresultaat van één subcat in resultaten patchen

    console.log([eindres1, eindres2, eindres3, eindres4]);
    let metingResultaat = this.berekenMetingResultaat([eindres1, eindres2, eindres3, eindres4]); //eindresultaat (metingresultaat) berekenen adhv alle subcategorie resultatan
    console.log(metingResultaat);
    metingResultaat = parseFloat(metingResultaat.toFixed(2));
    console.log(metingResultaat);

    let dateTime = new Date(); //datum van vandaag nemen
    this._metingDataService
      .addNewMeting(new Meting(resultaten, dateTime, metingResultaat)) //nieuwe meting toevoegen met de subcategorieresultaten, de datum van vandaag en het metingresultaat
      .pipe(
        catchError((err) => {
          this.errorMessage = err;
          return EMPTY;
        })
      )
      .subscribe((rec: Meting) => {
        this.confirmationMessage = `a meting for ${rec.id} was successfully added`;
      });
  }

  berekenEindresultaatCategorie(subcategorien, categorie, energieINenUIT){     //berekening eindresturaat voor 1 categorie
    let subcategorienRefined = subcategorien[0]; //onze array zit in een andere array voor een of andere reden, dus halen we die eruit
    let energieINenUITRefined = energieINenUIT[0];

    var energieSum = 0;
    var energieTotaalSum = 0;
    var energieIN = 0;
    var energieUIT = 0;
    var eindres = 0;
    var alfa = 0;
    var energieTotaal = 0;

    for(var i = 0; i < energieINenUITRefined.length; i += 2 ){ //forloop van de groote van de array. (i += 2 omdat er energieIN en -UIT is per subcategorie)
      if(!(subcategorienRefined[i - (i/2)] == 0 || categorie == 0)){  // gaat enkel door als de subcategorie waarde die horen bij de enerieIN en UIT niet gelijk is aan 0
        energieIN = parseInt(energieINenUITRefined[i], 10);
        energieUIT = parseInt(energieINenUITRefined[i+1], 10);

        energieSum = Math.sqrt(Math.pow(energieIN, 2) + Math.pow(energieUIT, 2)); //formule
        alfa = 180 / Math.PI * Math.asin(energieUIT / energieSum);
        energieTotaal = energieSum * alfa / 100; //energie totaal voor subcategorie

        energieTotaal = energieTotaal * (subcategorienRefined[i - (i / 2)]) / 100; //dit energietotaal maal de subcategoriewaarde (als je 50% invult bij die subcat weegt het maar voor de helft door)

        energieTotaalSum += energieTotaal; //som van alle subcategorie uitkomsten
      }      
    }
    
    eindres = energieTotaalSum * categorie / 100; //de som van alle subcat uitkomsten maal de hoofdcategorie percentage wordt het eindresultaat van één categorie
    
    return eindres;
  }

  berekenMetingResultaat(eindresultaten){   //berekenen metingresultaat
    var som = 0;

    eindresultaten.forEach(eindres => { //simpele som berekenen van alle categorieresultaten 
      if(eindres !== NaN){
        som += eindres;
      }
    });

    return som;
  }

  get metingen$(): Observable<Meting[]> {
    return this._fetchMetingen$;
  }

  getErrorMessage(errors: any): string {
    if (!errors) {
      return null;
    }
    if (errors.required) {
      return 'is required';
    } 
    else if (errors.minlength) {
      return `needs at least ${errors.minlength.requiredLength} characters (got ${errors.minlength.actualLength})`;
    }  
    else if(errors.nietHonderdSamen){ //error voor de hoofdcategorieen
      return 'alle categorien moeten samen 100 zijn!'
    }
    else if(errors.nietHonderdSamen1){ //error voor subcategorie werk
      return 'alle ondercategorien moeten samen 100 zijn!'
    }
    else if(errors.nietHonderdSamen2){ //error voor subcategorie relaties
      return 'alle ondercategorien moeten samen 100 zijn!'
    }
    else if(errors.nietHonderdSamen3){ //error voor subcategorie gezondheid
      return 'alle ondercategorien moeten samen 100 zijn!'
    }
    else if(errors.nietHonderdSamen4){ //error voor subcategorie vrijetijd
      return 'alle ondercategorien moeten samen 100 zijn!'
    }
    
//ik besef dat deze subcategorie error dezelfde zijn, maar als ik wil per categorie apart controleren of de subcategorieen gelijk zijn aan 100.
//daarom controlleer ik in mijn html welke error wordt gegeven en zo kan ik per categorien controleren.

  }
}