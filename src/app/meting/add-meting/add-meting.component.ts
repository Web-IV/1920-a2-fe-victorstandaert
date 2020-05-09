import { MetingDataService } from '../meting-data.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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
import { EMPTY } from 'rxjs';

/*function validateResultaatType(control: FormGroup): { [key: string]: any } {
  if (
    control.get('werk_TelefonerenKlanten').value.length >= 1 &&
    control.get('werk_Administratie').value.length < 2
  ) {
    return { amountNoType: true };
  }
  return null;
}*/

@Component({
  selector: 'app-add-meting',
  templateUrl: './add-meting.component.html',
  styleUrls: ['./add-meting.component.css'],
})
export class AddMetingComponent implements OnInit {
  public readonly types = ['Type1', 'Type2', 'Eindresultaat'];
  public meting: FormGroup;
  public errorMessage: string = '';
  public confirmationMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private _metingDataService: MetingDataService
  ) {}

  get resultaten(): FormArray {
    return <FormArray>this.meting.get('resultaten');
  }
  ngOnInit() : void {
    this.meting = this.fb.group({
      id: [''],
      werk: [''],
      werk_IN: [''],
      werk_UIT: [''],
      relaties: [''],
      relaties_IN: [''],
      relaties_UIT: [''],
      gezondheid: [''],
      gezondheid_IN: [''],
      gezondheid_UIT: [''],
      vrijetijd: [''],
      vrijetijd_IN: [''],
      vrijetijd_UIT: [''],
      resultaten: this.fb.array([this.createResultaten()])
    });

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

    /*var input1 = (<HTMLInputElement>document.getElementById("werkAdminInput")); //automatisch input value aanpassen wanneer 
    var array;
    var value;
    var somInputs;
    var teller = 0;

    input1.addEventListener("keyup", function(){
      value  = (<HTMLInputElement>document.getElementById("werkinput")).value;
      somInputs = 0;
      teller = 0;

      if(typeof input1.value !== 'string'){
        array = [(<HTMLInputElement>document.getElementById("werkAdminInput")).value,
                (<HTMLInputElement>document.getElementById("werkTelKlantInput")).value,
                (<HTMLInputElement>document.getElementById("werkBezKlantInput")).value]
        array.forEach(element => {
          if(element){
            somInputs += element;
            teller ++;
          }
        });
        (somInputs / teller) * value;       
        
        (<HTMLInputElement>document.getElementById("werkinput")).value = somInputs;
      }
    });*/

    this.resultaten.valueChanges
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
      });
  }

  createResultaten(): FormGroup {
    return this.fb.group(
      {
        vraag: ['test'],
        amount: [0],

        //#region alle subcategorie inputvelden
        werk_Administratie: [''],
        werk_BezoekenKlanten: [''],
        werk_TelefonerenKlanten: [''],
        werk_AdministratieIN: [''],
        werk_BezoekenKlantenIN: [''],
        werk_TelefonerenKlantenIN: [''],
        werk_AdministratieUIT: [''],
        werk_BezoekenKlantenUIT: [''],
        werk_TelefonerenKlantenUIT: [''],

        relaties_Partner: [''],
        relaties_Kinderen: [''],
        relaties_Ouders: [''],
        relaties_PartnerIN: [''],
        relaties_KinderenIN: [''],
        relaties_OudersIN: [''],
        relaties_PartnerUIT: [''],
        relaties_KinderenUIT: [''],
        relaties_OudersUIT: [''],

        gezondheid_Voeding: [''],
        gezondheid_Sport: [''],
        gezondheid_Yoga: [''],
        gezondheid_VoedingIN: [''],
        gezondheid_SportIN: [''],
        gezondheid_YogaIN: [''],
        gezondheid_VoedingUIT: [''],
        gezondheid_SportUIT: [''],
        gezondheid_YogaUIT: [''],

        vrijetijd_SM: [''],
        vrijetijd_TV: [''],
        vrijetijd_Hobby: [''],
        vrijetijd_SMIN: [''],
        vrijetijd_TVIN: [''],
        vrijetijd_HobbyIN: [''],
        vrijetijd_SMUIT: [''],
        vrijetijd_TVUIT: [''],
        vrijetijd_HobbyUIT: ['']
        //#endregion
      }/*,
      { validator: validateResultaatType }*/
    );
  }
  onSubmit() {
    
    //#region eindresult en vraag aanpassen voor werk-categorie
    let energieINenUITsubcat1 = this.meting.value.resultaten.map(res => [res.werk_AdministratieIN, res.werk_AdministratieUIT,
                                                                  res.werk_TelefonerenKlantenIN, res.werk_TelefonerenKlantenUIT,
                                                                  res.werk_BezoekenKlantenIN, res.werk_BezoekenKlantenUIT]);
    let energieINenUITcat1 = [this.meting.value.werk_IN, this.meting.value.werk_UIT];
    let ondercategorien1 = this.meting.value.resultaten.map(res => [res.werk_Administratie, res.werk_TelefonerenKlanten, res.werk_BezoekenKlanten]);
    let categorie1 = this.meting.value.werk;

    let eindres1 = this.berekenEindresultaatCategorie(ondercategorien1, categorie1, energieINenUITsubcat1, energieINenUITcat1);
    eindres1 = parseFloat(eindres1.toFixed(2));

    this.resultaten.patchValue([
      {vraag: "Werk", amount: eindres1}
    ]);
    //#endregion
    let resultaten = this.meting.value.resultaten.map(Resultaat.fromJSON);

    //#region eindresult en vraag aanpassen voor relaties-categorie
    let energieINenUITsubcat2 = this.meting.value.resultaten.map(res => [res.relaties_PartnerIN, res.relaties_PartnerUIT,
                                                                  res.relaties_KinderenIN, res.relaties_KinderenUIT,
                                                                  res.relaties_OudersIN, res.relaties_OudersUIT])
    let energieINenUITcat2 = [this.meting.value.relaties_IN, this.meting.value.relaties_UIT];
    let ondercategorien2 = this.meting.value.resultaten.map(res => [res.relaties_Partner, res.relaties_Kinderen, res.relaties_Ouders]);
    let categorie2 = this.meting.value.relaties;

    let eindres2 = this.berekenEindresultaatCategorie(ondercategorien2, categorie2, energieINenUITsubcat2, energieINenUITcat2);
    eindres2 = parseFloat(eindres2.toFixed(2));

    this.resultaten.patchValue([
      {vraag: "Relaties", amount: eindres2}
    ]);
    //#endregion
    resultaten.push(this.meting.value.resultaten.map(Resultaat.fromJSON)[0]);

    //#region eindresult en vraag aanpassen voor gezondheid-categorie
    let energieINenUITsubcat3 = this.meting.value.resultaten.map(res => [res.gezondheid_VoedingIN, res.gezondheid_VoedingUIT,
                                                                  res.gezondheid_SportIN, res.gezondheid_SportUIT,
                                                                  res.gezondheid_YogaIN, res.gezondheid_YogaUIT])
    let energieINenUITcat3 = [this.meting.value.gezondheid_IN, this.meting.value.gezondheid_UIT];
    let ondercategorien3 = this.meting.value.resultaten.map(res => [res.gezondheid_Voeding, res.gezondheid_Sport, res.gezondheid_Yoga]);
    let categorie3 = this.meting.value.gezondheid;

    let eindres3 = this.berekenEindresultaatCategorie(ondercategorien3, categorie3, energieINenUITsubcat3, energieINenUITcat3);
    eindres3 = parseFloat(eindres3.toFixed(2));
    
    this.resultaten.patchValue([
      {vraag: "Gezondheid", amount: eindres3}
    ]);
    //#endregion
    resultaten.push(this.meting.value.resultaten.map(Resultaat.fromJSON)[0]);

    //#region eindresult en vraag aanpassen voor vrije tijd-categorie
    let energieINenUITsubcat4 = this.meting.value.resultaten.map(res => [res.vrijetijd_SMIN, res.vrijetijd_SMUIT,
                                                                  res.vrijetijd_TVIN, res.vrijetijd_TVUIT,
                                                                  res.vrijetijd_HobbyIN, res.vrijetijd_HobbyUIT])
    let energieINenUITcat4 = [this.meting.value.vrijetijd_IN, this.meting.value.vrijetijd_UIT];
    let ondercategorien4 = this.meting.value.resultaten.map(res => [res.vrijetijd_SM, res.vrijetijd_TV, res.vrijetijd_Hobby]);
    let categorie4 = this.meting.value.vrijetijd;

    let eindres4 = this.berekenEindresultaatCategorie(ondercategorien4, categorie4, energieINenUITsubcat4, energieINenUITcat4);
    eindres4 = parseFloat(eindres4.toFixed(2));

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

  getErrorMessage(errors: any): string {
    if (!errors) {
      return null;
    }
    if (errors.required) {
      return 'is required';
    } else if (errors.minlength) {
      return `needs at least ${errors.minlength.requiredLength} characters (got ${errors.minlength.actualLength})`;
    } else if (errors.amountNoType) {
      return `if amount is set you must set a type`;
    }
  }

  berekenEindresultaatCategorie(ondercategorien, categorie, energieINenUITsubcat, energieINenUITcat){     //berekening eindresturaat voor 1 categorie
    let ondercategorienRefined = ondercategorien[0];
    let energieINenUITsubcatRefined = energieINenUITsubcat[0];
    //let energieInenUITcatRefined = energieINenUITcat[0];
    let categorieRes = 0;

    categorieRes = Math.sqrt(Math.pow(energieINenUITcat[0], 2) + Math.pow(energieINenUITcat[1], 2));
    categorieRes = categorieRes * energieINenUITcat[1];
    categorieRes = categorieRes * categorie / 100;

    var energiesum = 0;
    var energiesumsum = 0;
    var energieIN = 0;
    var energieUIT = 0;
    var teller = 0;
    let eindres = 0;

    for(var i = 0; i < energieINenUITsubcatRefined.length; i += 2 ){
      energieIN = parseInt(energieINenUITsubcatRefined[i], 10);
      energieUIT = parseInt(energieINenUITsubcatRefined[i+1], 10);

      if(energieINenUITsubcatRefined[i] == '' || ondercategorienRefined[i- (i / 2)] == ''){
        teller++;
      }
      else{
        energiesum = Math.sqrt(Math.pow(energieIN, 2) + Math.pow(energieUIT, 2));
        energiesum = energiesum * energieUIT;
        energiesum = energiesum * (ondercategorienRefined[i - (i / 2)]) / 100;
        energiesum = energiesum * categorieRes / 100;

        energiesumsum += energiesum;
      }
    }

    if(energiesumsum == 0){     //als er geen subcategorieeën zijn ingevult enkel de hoofdcategorie meerekenen
      eindres = categorieRes;
    }
    else{
      var avg = energiesumsum / ((ondercategorienRefined.length) - teller/2); //min elke input die leeg is gelaten
      eindres = avg;
    }

    return eindres;
  }

  berekenMetingResultaat(eindresultaten){   //berekenen metingresultaat
    var som = 0;
    var avg = 0;
    var teller = 0;

    eindresultaten.forEach(eindres => {
      if(eindres == ''){
        teller++;
      }
      else{
        som += eindres;
      }
    });

    avg = som / (eindresultaten.length - teller);
    
    return avg;
  }
}