import { Component, OnInit } from '@angular/core';
import { Meting } from '../meting.model';
import { MetingDataService } from '../meting-data.service';
import { Subject, Observable, of, EMPTY, merge } from 'rxjs';
import {
  distinctUntilChanged,
  debounceTime,
  map,
  filter,
  catchError,
  scan,
} from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-meting-analyse',
  templateUrl: './meting-analyse.component.html',
  styleUrls: ['./meting-analyse.component.css']
})
export class MetingAnalyseComponent implements OnInit {

  private _fetchMeting$: Observable<Meting>;

  public errorMessage: string = '';

  constructor(private _metingDataService: MetingDataService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    var id = this.route.snapshot.paramMap.get('id');
    this._fetchMeting$ = this._metingDataService.getMeting$(parseInt(id));
  }

  get meting$(): Observable<Meting> {
    return this._fetchMeting$;
  }

}
