import { MetingDataService } from '../meting-data.service';
import { Component, OnInit, Input } from '@angular/core';
import { Meting } from '../meting.model';

@Component({
  selector: 'app-meting',
  templateUrl: './meting.component.html',
  styleUrls: ['./meting.component.css']
})
export class MetingComponent implements OnInit {
  @Input() public meting: Meting;

  constructor(private _metingDataService: MetingDataService) {}

  ngOnInit() {}

  deleteMeting() {
    this._metingDataService.deleteMeting(this.meting);
  }
}
