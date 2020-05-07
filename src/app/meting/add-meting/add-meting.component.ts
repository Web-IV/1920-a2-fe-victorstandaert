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
      relaties: [''],
      gezondheid: [''],
      vrijetijd: [''],
      resultaten: this.fb.array([this.createResultaten()]),
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
    let resultaat1 = this.meting.value.resultaten.map(res => [res.werk_Administratie, res.werk_TelefonerenKlanten, res.werk_BezoekenKlanten]);
    let resultaat2 = this.meting.value.werk;

    let eindres1 = this.berekenEindresultaat(resultaat1, resultaat2);
    console.log(eindres1);

    this.resultaten.patchValue([
      {vraag: "Werk", amount: eindres1}
    ]);
    //#endregion
    let resultaten = this.meting.value.resultaten.map(Resultaat.fromJSON);

    //#region eindresult en vraag aanpassen voor relaties-categorie
    let resultaat3 = this.meting.value.resultaten.map(res => [res.relaties_Partner, res.relaties_Kinderen, res.relaties_Ouders]);
    let resultaat4 = this.meting.value.relaties;

    let eindres2 = this.berekenEindresultaat(resultaat3, resultaat4);

    this.resultaten.patchValue([
      {vraag: "Relaties", amount: eindres2}
    ]);
    //#endregion
    resultaten.push(this.meting.value.resultaten.map(Resultaat.fromJSON)[0]);

    //#region eindresult en vraag aanpassen voor gezondheid-categorie
    let resultaat5 = this.meting.value.resultaten.map(res => [res.gezondheid_Voeding, res.gezondheid_Sport, res.gezondheid_Yoga]);
    let resultaat6 = this.meting.value.gezondheid;

    let eindres3 = this.berekenEindresultaat(resultaat5, resultaat6);

    this.resultaten.patchValue([
      {vraag: "Gezondheid", amount: eindres3}
    ]);
    //#endregion
    resultaten.push(this.meting.value.resultaten.map(Resultaat.fromJSON)[0]);

    //#region eindresult en vraag aanpassen voor vrije tijd-categorie
    let resultaat7 = this.meting.value.resultaten.map(res => [res.vrijetijd_SM, res.vrijetijd_TV, res.vrijetijd_Hobby]);
    let resultaat8 = this.meting.value.vrijetijd;

    let eindres4 = this.berekenEindresultaat(resultaat7, resultaat8);

    this.resultaten.patchValue([
      {vraag: "Vrije tijd", amount: eindres4}
    ]);
    //#endregion
    resultaten.push(this.meting.value.resultaten.map(Resultaat.fromJSON)[0]);

    console.log(resultaten);

    //console.log(resultaten);
    let dateTime = new Date();
    //resultaten = resultaten.filter((res) => res.vraag.length > 2);
    this._metingDataService
      .addNewMeting(new Meting(resultaten, dateTime))
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

  berekenEindresultaat(resultaat1, resultaat2){     //berekening eindresturaat voor 1 categorie
    let resultaat1Refined = resultaat1[0];

    var sum = 0;
    var teller = 0;
    let eindres = 0;

    for( var i = 0; i < resultaat1Refined.length; i++ ){
      if(resultaat1Refined[i] == ''){
        teller++;
      }
      else{
        sum += parseInt(resultaat1Refined[i], 10);
      }
    }

    if(sum == 0){     //als er geen subcategorieeën zijn ingevult enkel de hoofdcategorie meerekenen
      eindres = resultaat2;
    }
    else{
      var avg = sum / ((resultaat1Refined.length) - teller); //min elke input die leeg is gelaten
      eindres = (avg * (resultaat2 / 100));
    }

    return eindres;
  }
}
