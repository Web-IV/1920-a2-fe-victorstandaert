import { MaterialModule } from '../material/material.module';
import { ResultaatComponent } from './resultaat/resultaat.component';
import { MetingComponent } from './meting/meting.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetingListComponent } from './meting-list/meting-list.component';
import { AddMetingComponent } from './add-meting/add-meting.component';
import { MetingFilterPipe } from './meting-filter.pipe';
import { MetingDetailComponent } from './meting-detail/meting-detail.component';
import { MetingResolver } from './MetingResolver';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MetingAnalyseComponent } from './meting-analyse/meting-analyse.component';
import { GaugeChartModule } from 'angular-gauge-chart';
import {MatSliderModule} from '@angular/material/slider';

const routes: Routes = [
  { path: 'list', component: MetingListComponent },
  { path: 'add', component: AddMetingComponent },
  { 
    path: 'analyse/:id', 
    component: MetingAnalyseComponent, 
    resolve: { meting: MetingResolver }
  },
  {
    path: 'detail/:id',
    component: MetingDetailComponent,
    resolve: { meting: MetingResolver },
  },
];
@NgModule({
  declarations: [
    MetingComponent,
    ResultaatComponent,
    MetingListComponent,
    AddMetingComponent,
    MetingFilterPipe,
    MetingDetailComponent,
    MetingAnalyseComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    HttpClientModule,
    GaugeChartModule,
    MatSliderModule
  ],
  exports: [
    AddMetingComponent, 
    MetingListComponent, 
    MetingAnalyseComponent, 
  ],
})
export class MetingModule {}
