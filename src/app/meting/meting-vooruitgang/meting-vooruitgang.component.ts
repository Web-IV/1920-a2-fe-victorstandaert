import { Component, AfterViewInit, OnInit  } from '@angular/core';
import * as Chart from 'chart.js'
import { Observable, EMPTY } from 'rxjs';
import { Meting } from '../meting.model';
import { MetingDataService } from '../meting-data.service';
import { catchError } from 'rxjs/operators';


@Component({
  selector: 'app-meting-vooruitgang',
  templateUrl: './meting-vooruitgang.component.html',
  styleUrls: ['./meting-vooruitgang.component.css']
})
export class MetingVooruitgangComponent implements OnInit  {

  private _fetchMetingen$: Observable<Meting[]>;
  canvas: any;
  ctx: any;
  errorMessage: string = '';
  metingenPerMaand: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  MaandTeller: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  dezeMaand = new Date().getMonth();

  constructor(private _metingDataService: MetingDataService) {
    
  }

  ngOnInit(): void {
    this._fetchMetingen$ = this._metingDataService.allMetingen$.pipe(
      catchError((err) => {
        this.errorMessage = err;
        return EMPTY;
      })
    );    

    this._fetchMetingen$.forEach(meting => {
      meting.forEach(element => {
        switch(true){ //per maand de som van de metingresultaten (scores)
          case element.dateAdded.toString().includes("Jan"):{
            this.metingenPerMaand[0] += element.metingResultaat;
            this.MaandTeller[0]++;
            break;
          }
          case element.dateAdded.toString().includes("Feb"):{
            this.metingenPerMaand[1] += element.metingResultaat;
            this.MaandTeller[1]++;
            break;
          }
          case element.dateAdded.toString().includes("Mar"):{
            this.metingenPerMaand[2] += element.metingResultaat;
            this.MaandTeller[2]++;
            break;
          }
          case element.dateAdded.toString().includes("Apr"):{
            this.metingenPerMaand[3] += element.metingResultaat;
            this.MaandTeller[3]++;
            break;
          }
          case element.dateAdded.toString().includes("May"):{
            this.metingenPerMaand[4] += element.metingResultaat;
            this.MaandTeller[4]++;
            break;
          }
          case element.dateAdded.toString().includes("Jun"):{
            this.metingenPerMaand[5] += element.metingResultaat;
            this.MaandTeller[5]++;
            break;
          }
          case element.dateAdded.toString().includes("Jul"):{
            this.metingenPerMaand[6] += element.metingResultaat;
            this.MaandTeller[6]++;
            break;
          }
          case element.dateAdded.toString().includes("Aug"):{
            this.metingenPerMaand[7] += element.metingResultaat;
            this.MaandTeller[7]++;
            break;
          }
          case element.dateAdded.toString().includes("Sep"):{
            this.metingenPerMaand[8] += element.metingResultaat;
            this.MaandTeller[8]++;
            break;
          }
          case element.dateAdded.toString().includes("Oct"):{
            this.metingenPerMaand[9] += element.metingResultaat;
            this.MaandTeller[9]++;
            break;
          }
          case element.dateAdded.toString().includes("Nov"):{
            this.metingenPerMaand[10] += element.metingResultaat;
            this.MaandTeller[10]++;
            break;
          }
          case element.dateAdded.toString().includes("Dec"):{
            this.metingenPerMaand[11] += element.metingResultaat;
            this.MaandTeller[11]++;
            break;
          }
        }
      });
      for(var i = 0; i < this.metingenPerMaand.length; i++){ //gemiddelde per maand
        if(this.MaandTeller[i] != 0){
          this.metingenPerMaand[i] = this.metingenPerMaand[i] / this.MaandTeller[i];
        }
      }
      for(var i = 0; i < this.metingenPerMaand.length; i++){ //gemiddelde per maand
        if(this.MaandTeller[i] == 0 && i != 0 && i != 11){ 
          if(i >= (this.dezeMaand + 1)){
            this.metingenPerMaand[i] = null; //als we de maand nog niet zijn, wordt de grafiek gestopt
          }else{
            this.metingenPerMaand[i] = (this.metingenPerMaand[i-1] + this.metingenPerMaand[i+1]) /2; //als 0 is, pak gemiddelde van de maand ervoor en erachter
          }
        }
      }
    });

    this.canvas = document.getElementById('myChart');
    this.ctx = this.canvas.getContext('2d');

    let myChart = new Chart(this.ctx, {
      type: 'line',
      data: {
        labels: ["Jan", "Feb", "March", "April", "May", "June","July","Aug","Sep","Oct","Nov","Dec"],
        datasets: [{
          label: 'Gemiddelde score per maand',
          data: [
            this.metingenPerMaand[0], 
            this.metingenPerMaand[1],
            this.metingenPerMaand[2], 
            this.metingenPerMaand[3],
            this.metingenPerMaand[4], 
            this.metingenPerMaand[5],
            this.metingenPerMaand[6], 
            this.metingenPerMaand[7],
            this.metingenPerMaand[8], 
            this.metingenPerMaand[9],
            this.metingenPerMaand[10], 
            this.metingenPerMaand[11],
          ],
          fill: false,
          lineTension: 0.2,
          borderColor: "red",
          borderWidth: 1
      }]
      }, 
      options: {
        title:{
          text:"Line Chart",
          display: false
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  
  }
  
}
