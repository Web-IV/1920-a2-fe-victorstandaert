import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MetingDataService } from '../meting-data.service';
import { Meting } from '../meting.model';

@Component({
  selector: 'app-meting-detail',
  templateUrl: './meting-detail.component.html',
  styleUrls: ['./meting-detail.component.css']
})
export class MetingDetailComponent implements OnInit {
  public meting: Meting;

  constructor(
    private route: ActivatedRoute,
    private metingDataService: MetingDataService
  ) {}

  ngOnInit() {
    this.route.data.subscribe(item => (this.meting = item['meting']));
  }
}
