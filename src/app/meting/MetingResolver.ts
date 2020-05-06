import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Meting } from './meting.model';
import { Injectable } from '@angular/core';
import { MetingDataService } from './meting-data.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MetingResolver implements Resolve<Meting> {
  constructor(private metingService: MetingDataService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Meting> {
    return this.metingService.getMeting$(route.params['id']);
  }
}
