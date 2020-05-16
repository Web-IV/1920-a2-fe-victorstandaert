import { Component, OnInit, ViewChild  } from '@angular/core';
import { Meting } from '../meting.model';
import { MetingDataService } from '../meting-data.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-meting-analyse',
  templateUrl: './meting-analyse.component.html',
  styleUrls: ['./meting-analyse.component.css']
})

export class MetingAnalyseComponent implements OnInit {

  public meting: Meting;
  public metingResult: number;
  public metingResultOp100: number;

  public canvasWidth = 800
  public needleValue: number 
  public centralLabel = ''
  public name = ''
  public bottomLabel: number
  public options = { //default waarden gauge chart
      hasNeedle: true,
      needleColor: 'gray',
      needleUpdateSpeed: 5000,
      arcColors: ['rgb(252, 55, 0)', 'rgb(255, 171, 25)', 'rgb(255, 224, 130)', 'rgb(168, 250, 206)', 'rgb(66, 223, 194)', 'rgb(0, 164, 96)'],
      arcDelimiters: [10, 30, 50, 70, 90],
      rangeLabel: ['-100', '100'],
      needleStartValue: 0,
  }

  constructor(private _metingDataService: MetingDataService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data.subscribe(item => (this.meting = item['meting'])); //haal de specifieke meting op adhv id

    this.metingResult = this.meting.metingResultaat

    //default waarden gauge chart aanpassen
    this.metingResultOp100 = this.metingResult / 90 * 100;  //waarde van een schaal van -90 tot 90 omzetten naar schaal van 0 tot 100
    this.metingResultOp100 = (this.metingResultOp100 / 2) + 50;

    this.needleValue = this.metingResultOp100;
    this.bottomLabel = this.metingResult;
  }
}
