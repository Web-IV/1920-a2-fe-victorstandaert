import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError, tap, shareReplay, switchMap } from 'rxjs/operators';
import { Meting } from './meting.model';
import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MetingDataService {
  private _metingen$ = new BehaviorSubject<Meting[]>([]);
  private _metingen: Meting[];

  constructor(private http: HttpClient) {
    this.metingen$
      .pipe(
        catchError((err) => {
          this._metingen$.error(err);
          return throwError(err);
        })
      )
      .subscribe((metingen: Meting[]) => { //vult onze private attributen met metingen uit de database
        this._metingen = metingen;
        this._metingen$.next(this._metingen);
      });
        
  }

  get allMetingen$(): Observable<Meting[]> {
    return this._metingen$;
  }

  get metingen$(): Observable<Meting[]> {
    return this.http.get(`${environment.apiUrl}/Meting/metingenUser/`).pipe(   //return alle metingen als json ( per account MOET NOG GEBEUREN) !!!!!
      tap(console.log),
      shareReplay(1),
      catchError(this.handleError),
      map((list: any[]): Meting[] => list.map(Meting.fromJSON))
    );
  }

  getMeting$(id: number): Observable<Meting>{ // returns één Meting adhv een meegegeven id, als json 
    return this.http
      .get(`${environment.apiUrl}/Meting/${id}`)
      .pipe(
        catchError(this.handleError), 
        map(Meting.fromJSON)
      ); 
  }

  addNewMeting(meting: Meting) { //voegt nieuwe meting toe aan de database
    return this.http
      .post(`${environment.apiUrl}/Meting/`, meting.toJSON())
      .pipe(catchError(this.handleError), map(Meting.fromJSON))
      .pipe(
        catchError((err) => {
          this._metingen$.error(err);
          return throwError(err);
        }),
        tap((m: Meting) => {
          this._metingen = [...this._metingen, m];
          this._metingen$.next(this._metingen);
        })
      );
  }

  deleteMeting(meting: Meting) { //delete meting in database
    return this.http
      .delete(`${environment.apiUrl}/Meting/${meting.id}`)
      .pipe(tap(console.log), catchError(this.handleError))
      .subscribe(() => {
        this._metingen = this._metingen.filter((m) => m.id != meting.id);
        this._metingen$.next(this._metingen);
      });
  }

  handleError(err: any): Observable<never> {
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else if (err instanceof HttpErrorResponse) {
      console.log(err);
      errorMessage = `'${err.status} ${err.statusText}' when accessing '${err.url}'`;
    } else {
      errorMessage = err;
    }
    return throwError(errorMessage);
  }
}
