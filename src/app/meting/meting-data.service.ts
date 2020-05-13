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
  private _meting$ = new BehaviorSubject<Meting>(new Meting(null, null, null, null));
  private _meting: Meting;

  constructor(private http: HttpClient) {
    this.metingen$
      .pipe(
        catchError((err) => {
          // temporary fix, while we use the behaviorsubject as a cache stream
          this._metingen$.error(err);
          return throwError(err);
        })
      )
      .subscribe((metingen: Meting[]) => {
        this._metingen = metingen;
        this._metingen$.next(this._metingen);
      });
        
  }

  get allMetingen$(): Observable<Meting[]> {
    return this._metingen$;
  }

  get metingen$(): Observable<Meting[]> {
    return this.http.get(`${environment.apiUrl}/Meting/`).pipe(   //return alle metingen ( per account MOET NOG GEBEUREN) !!!!!
      tap(console.log),
      shareReplay(1),
      catchError(this.handleError),
      map((list: any[]): Meting[] => list.map(Meting.fromJSON))
    );
  }

  getMeting$(id: number): Observable<Meting>{
    return this.http
      .get(`${environment.apiUrl}/Meting/${id}`)
      .pipe(
        catchError(this.handleError), 
        map(Meting.fromJSON)
      ); // returns just one Meting, as json
  }

  addNewMeting(meting: Meting) {
    return this.http
      .post(`${environment.apiUrl}/Meting/`, meting.toJSON())
      .pipe(catchError(this.handleError), map(Meting.fromJSON))
      .pipe(
        // temporary fix, while we use the behaviorsubject as a cache stream
        catchError((err) => {
          this._metingen$.error(err);
          return throwError(err);
        }),
        tap((rec: Meting) => {
          this._metingen = [...this._metingen, rec];
          this._metingen$.next(this._metingen);
        })
      );
  }

  deleteMeting(meting: Meting) {
    return this.http
      .delete(`${environment.apiUrl}/Meting/${meting.id}`)
      .pipe(tap(console.log), catchError(this.handleError))
      .subscribe(() => {
        this._metingen = this._metingen.filter((rec) => rec.id != meting.id);
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
