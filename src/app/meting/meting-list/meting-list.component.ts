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

@Component({
  selector: 'app-meting-list',
  templateUrl: './meting-list.component.html',
  styleUrls: ['./meting-list.component.css'],
})
export class MetingListComponent implements OnInit {
  public filterMetingDatum: string;
  public filterMeting$ = new Subject<string>();
  private _fetchMetingen$: Observable<Meting[]>;

  public errorMessage: string = '';

  constructor(private _metingDataService: MetingDataService) {
    this.filterMeting$ //filter op datum
      .pipe(
        distinctUntilChanged(),
        debounceTime(400),
        map((val) => val)
      )
      .subscribe((val) => (this.filterMetingDatum = val));
  }

  ngOnInit(): void { //haal alle metingen uit database
    this._fetchMetingen$ = this._metingDataService.allMetingen$.pipe(
      catchError((err) => {
        this.errorMessage = err;
        return EMPTY;
      })
    );
  }

  get metingen$(): Observable<Meting[]> {
    return this._fetchMetingen$;
  }
}
