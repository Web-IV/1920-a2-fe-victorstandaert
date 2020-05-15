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

function validateCategorien(control: FormGroup): { [key: string]: any } {
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

function validateOnderCategorien1(control : FormGroup): { [key: string]: any } {
  if(
  parseInt(control.get('werk_Administratie').value) +
  parseInt(control.get('werk_BezoekenKlanten').value) +
  parseInt(control.get('werk_TelefonerenKlanten').value) != 100
  ){
    return { nietHonderdSamen1: true }
  } 
  
  return null;
}

function validateOnderCategorien3(control : FormGroup): { [key: string]: any } {
  if(
    parseInt(control.get('gezondheid_Voeding').value) +
    parseInt(control.get('gezondheid_Sport').value) +
    parseInt(control.get('gezondheid_Yoga').value) != 100
  ){
    return {nietHonderdSamen3: true }
  }
  
  return null;
}

function validateOnderCategorien2(control : FormGroup): { [key: string]: any } {
  if(
    parseInt(control.get('relaties_Partner').value) +
    parseInt(control.get('relaties_Kinderen').value) +
    parseInt(control.get('relaties_Ouders').value) != 100
  ){
    return { nietHonderdSamen2: true }
  }
  
  return null;
}

function validateOnderCategorien4(control : FormGroup): { [key: string]: any } {
  if(
    parseInt(control.get('vrijetijd_SM').value) +
    parseInt(control.get('vrijetijd_TV').value) +
    parseInt(control.get('vrijetijd_Hobby').value) != 100
  ){
    return {nietHonderdSamen4: true }
  }
  
  return null;
}

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

    this.meting = this.fb.group({
      floatLabel: this.floatLabelControl,
      id: [''],
      werk: [50],
      relaties: [30],
      gezondheid: [10],
      vrijetijd: [10],
      resultaten: this.fb.array([this.createResultaten()])
    }, {validator: validateCategorien }
    );

    var coll = document.getElementsByClassName("collapsible");  //openvouwen categorie
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

    /*this.resultaten.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((ingList) => {
        // if the last entry's name is typed, add a new empty one
        // if we're removing an entry's name, and there is an empty one after that one, remove the empty one
        const lastElement = ingList[ingList.length - 1];

        if (lastElement.type && lastElement.type.length > 2) {
          this.resultaten.push(this.createResultaten());
        } else if (ingList.length >= 2) {
          const secondToLast = ingList[ingList.length - 2];
          if (
            !lastElement.vraag &&
            !lastElement.amount &&
            (!secondToLast.vraag || secondToLast.vraag.length < 2)
          ) {
            this.resultaten.removeAt(this.resultaten.length - 1);
          }
        }
      });*/
  }

  //label aan value slider gelijk stellen
  onInputChange(event: any, id: any) {
      document.getElementById(id).innerHTML = event.value;
  }
  
  

  createResultaten(): FormGroup {
    return this.fb.group(
      {
        vraag: ['test'],
        amount: [0],

        //#region alle subcategorie inputvelden
        werk_Administratie: ['100'],
        werk_BezoekenKlanten: ['0'],
        werk_TelefonerenKlanten: ['0'],
        werk_AdministratieIN: [''],
        werk_BezoekenKlantenIN: [''],
        werk_TelefonerenKlantenIN: [''],
        werk_AdministratieUIT: [''],
        werk_BezoekenKlantenUIT: [''],
        werk_TelefonerenKlantenUIT: [''],

        relaties_Partner: ['100'],
        relaties_Kinderen: ['0'],
        relaties_Ouders: ['0'],
        relaties_PartnerIN: [''],
        relaties_KinderenIN: [''],
        relaties_OudersIN: [''],
        relaties_PartnerUIT: [''],
        relaties_KinderenUIT: [''],
        relaties_OudersUIT: [''],

        gezondheid_Voeding: ['100'],
        gezondheid_Sport: ['0'],
        gezondheid_Yoga: ['0'],
        gezondheid_VoedingIN: [''],
        gezondheid_SportIN: [''],
        gezondheid_YogaIN: [''],
        gezondheid_VoedingUIT: [''],
        gezondheid_SportUIT: [''],
        gezondheid_YogaUIT: [''],

        vrijetijd_SM: ['100'],
        vrijetijd_TV: ['0'],
        vrijetijd_Hobby: ['0'],
        vrijetijd_SMIN: [''],
        vrijetijd_TVIN: [''],
        vrijetijd_HobbyIN: [''],
        vrijetijd_SMUIT: [''],
        vrijetijd_TVUIT: [''],
        vrijetijd_HobbyUIT: ['']
        //#endregion
      },
      {validators: [validateOnderCategorien1, validateOnderCategorien2, validateOnderCategorien3, validateOnderCategorien4]},
    );
  }
  onSubmit() {
    
    console.log(this.meting.value.slider);

    //#region eindresult en vraag aanpassen voor werk-categorie
    let energieINenUITsubcat1 = this.meting.value.resultaten.map(res => [res.werk_AdministratieIN, res.werk_AdministratieUIT,
                                                                  res.werk_TelefonerenKlantenIN, res.werk_TelefonerenKlantenUIT,
                                                                  res.werk_BezoekenKlantenIN, res.werk_BezoekenKlantenUIT]);
    let ondercategorien1 = this.meting.value.resultaten.map(res => [res.werk_Administratie, res.werk_TelefonerenKlanten, res.werk_BezoekenKlanten]);
    let categorie1 = this.meting.value.werk;

    let eindres1 = this.berekenEindresultaatCategorie(ondercategorien1, categorie1, energieINenUITsubcat1);
    eindres1 = parseFloat(eindres1.toFixed(0));

    this.resultaten.patchValue([
      {vraag: "Werk", amount: eindres1}
    ]);
    //#endregion
    let resultaten = this.meting.value.resultaten.map(Resultaat.fromJSON);

    //#region eindresult en vraag aanpassen voor relaties-categorie
    let energieINenUITsubcat2 = this.meting.value.resultaten.map(res => [res.relaties_PartnerIN, res.relaties_PartnerUIT,
                                                                  res.relaties_KinderenIN, res.relaties_KinderenUIT,
                                                                  res.relaties_OudersIN, res.relaties_OudersUIT])
    let ondercategorien2 = this.meting.value.resultaten.map(res => [res.relaties_Partner, res.relaties_Kinderen, res.relaties_Ouders]);
    let categorie2 = this.meting.value.relaties;

    let eindres2 = this.berekenEindresultaatCategorie(ondercategorien2, categorie2, energieINenUITsubcat2);
    eindres2 = parseFloat(eindres2.toFixed(0));

    this.resultaten.patchValue([
      {vraag: "Relaties", amount: eindres2}
    ]);
    //#endregion
    resultaten.push(this.meting.value.resultaten.map(Resultaat.fromJSON)[0]);

    //#region eindresult en vraag aanpassen voor gezondheid-categorie
    let energieINenUITsubcat3 = this.meting.value.resultaten.map(res => [res.gezondheid_VoedingIN, res.gezondheid_VoedingUIT,
                                                                  res.gezondheid_SportIN, res.gezondheid_SportUIT,
                                                                  res.gezondheid_YogaIN, res.gezondheid_YogaUIT])
    let ondercategorien3 = this.meting.value.resultaten.map(res => [res.gezondheid_Voeding, res.gezondheid_Sport, res.gezondheid_Yoga]);
    let categorie3 = this.meting.value.gezondheid;

    let eindres3 = this.berekenEindresultaatCategorie(ondercategorien3, categorie3, energieINenUITsubcat3);
    eindres3 = parseFloat(eindres3.toFixed(0));
    
    this.resultaten.patchValue([
      {vraag: "Gezondheid", amount: eindres3}
    ]);
    //#endregion
    resultaten.push(this.meting.value.resultaten.map(Resultaat.fromJSON)[0]);

    //#region eindresult en vraag aanpassen voor vrije tijd-categorie
    let energieINenUITsubcat4 = this.meting.value.resultaten.map(res => [res.vrijetijd_SMIN, res.vrijetijd_SMUIT,
                                                                  res.vrijetijd_TVIN, res.vrijetijd_TVUIT,
                                                                  res.vrijetijd_HobbyIN, res.vrijetijd_HobbyUIT])
    let ondercategorien4 = this.meting.value.resultaten.map(res => [res.vrijetijd_SM, res.vrijetijd_TV, res.vrijetijd_Hobby]);
    let categorie4 = this.meting.value.vrijetijd;

    let eindres4 = this.berekenEindresultaatCategorie(ondercategorien4, categorie4, energieINenUITsubcat4);
    eindres4 = parseFloat(eindres4.toFixed(0));

    this.resultaten.patchValue([
      {vraag: "Vrije tijd", amount: eindres4}
    ]);
    //#endregion
    resultaten.push(this.meting.value.resultaten.map(Resultaat.fromJSON)[0]);

    console.log(resultaten);

    let metingResultaat = this.berekenMetingResultaat([eindres1, eindres2, eindres3, eindres4]);
    metingResultaat = parseFloat(metingResultaat.toFixed(2));

    //console.log(resultaten);
    let dateTime = new Date();
    //resultaten = resultaten.filter((res) => res.vraag.length > 2);
    this._metingDataService
      .addNewMeting(new Meting(resultaten, dateTime, metingResultaat))
      .pipe(
        catchError((err) => {
          this.errorMessage = err;
          return EMPTY;
        })
      )
      .subscribe((rec: Meting) => {
        this.confirmationMessage = `a meting for ${rec.id} was successfully added`;
      });

    /*this.meting = this.fb.group({
      //vraag: ['', [Validators.required, Validators.minLength(2)]],
      resultaten: this.fb.array([this.createResultaten()]),
    });*/
  }


  berekenEindresultaatCategorie(ondercategorien, categorie, energieINenUITsubcat){     //berekening eindresturaat voor 1 categorie
    let ondercategorienRefined = ondercategorien[0];
    let energieINenUITsubcatRefined = energieINenUITsubcat[0];

    var energiesumSubCat = 0;
    var energiesumsum = 0;
    var energieINSubCat = 0;
    var energieUITSubCat = 0;
    let eindres = 0;
    var alfaSubCat = 0;
    var energieTotaalSubCat = 0;

    for(var i = 0; i < energieINenUITsubcatRefined.length; i += 2 ){
      if(!(energieINenUITsubcatRefined[i] == '' || energieINenUITsubcatRefined[i+1] == '' || ondercategorienRefined[i - (i/2)] == '')){
        energieINSubCat = parseInt(energieINenUITsubcatRefined[i], 10);
        energieUITSubCat = parseInt(energieINenUITsubcatRefined[i+1], 10);

        energiesumSubCat = Math.sqrt(Math.pow(energieINSubCat, 2) + Math.pow(energieUITSubCat, 2));
        alfaSubCat = 180 / Math.PI * Math.asin(energieUITSubCat / energiesumSubCat);
        energieTotaalSubCat = energiesumSubCat * alfaSubCat / 100; //energie totaal voor subcategorie

        energieTotaalSubCat = energieTotaalSubCat * (ondercategorienRefined[i - (i / 2)]) / 100;

        energiesumsum += energieTotaalSubCat;
        console.log(energiesumsum);

      }      
    }
    
    console.log("cat:" + categorie);
    console.log("sum:" + energiesumsum);
    eindres = energiesumsum * categorie / 100;
    
    console.log(eindres);
    return eindres;
  }

  berekenMetingResultaat(eindresultaten){   //berekenen metingresultaat
    var som = 0;

    eindresultaten.forEach(eindres => {
      som += eindres;
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
    else if(errors.nietHonderdSamen){
      return 'alle categorien moeten samen 100 zijn!'
    }
    else if(errors.nietHonderdSamen1){
      return 'alle ondercategorien moeten samen 100 zijn!'
    }
    else if(errors.nietHonderdSamen2){
      return 'alle ondercategorien moeten samen 100 zijn!'
    }
    else if(errors.nietHonderdSamen3){
      return 'alle ondercategorien moeten samen 100 zijn!'
    }
    else if(errors.nietHonderdSamen4){
      return 'alle ondercategorien moeten samen 100 zijn!'
    }
    
  }

  /*bekijkMeting(){
    console.log("bekijkmeting begin");
    this._fetchMetingen$ = this._metingDataService.allMetingen$.pipe(
      catchError((err) => {
        this.errorMessage = err;
        return EMPTY;
      })
    );

    var lengte;
    this.metingen$.subscribe(meting => lengte = meting.length);
    var laatsteId = this.metingen$[lengte].map(val => val.id);
    console.log("bekijkmeting einde");

    this._router.navigate(['/../../meting/analyse', laatsteId])
  }*/
}