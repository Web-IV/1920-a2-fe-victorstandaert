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

    var idk = (<HTMLInputElement>document.getElementById("werkAdminInput"));
    var array;
    var value;
    var somInputs;
    var teller = 0;

    idk.addEventListener("keyup", function(){
      value  = (<HTMLInputElement>document.getElementById("werkinput")).value;
      somInputs = 0;
      teller = 0;

      if(typeof idk.value !== 'string'){
        array = [(<HTMLInputElement>document.getElementById("werkAdminInput")).value,
                (<HTMLInputElement>document.getElementById("werkTelKlantInput")).value,
                (<HTMLInputElement>document.getElementById("werkBezKlantInput")).value]
        array.forEach(element => {
          if(element)
          somInputs += element;
          teller ++;
        });
        (somInputs / teller) * value;
        (<HTMLInputElement>document.getElementById("werkinput")).value = somInputs;
      }
    });

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
        vraag: ['werk'],
        amount: [''],
        werk_Administratie: [''],
        werk_BezoekenKlanten: [''],
        werk_TelefonerenKlanten: ['']
        
      }/*,
      { validator: validateResultaatType }*/
    );
  }
  onSubmit() {
    let amount = 
        ((this.meting.value.resultaten.werk_Administratie + 
        this.meting.value.resultaten.werk_BezoekenKlanten +
        this.meting.value.resultaten.werk_TelefonerenKlanten) / 3) * 
        this.meting.value.werk / 100

    
    let resultaten = this.meting.value.resultaten.map(Resultaat.fromJSON);
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

    this.meting = this.fb.group({
      //vraag: ['', [Validators.required, Validators.minLength(2)]],
      resultaten: this.fb.array([this.createResultaten()]),
    });
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
}
