import { MaterialModule } from '../material/material.module';
import { ResultaatComponent } from './resultaat/resultaat.component';
import { MetingComponent } from './meting/meting.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetingListComponent } from './meting-list/meting-list.component';
import { AddMetingComponent } from './add-meting/add-meting.component';
import { MetingFilterPipe } from './meting-filter.pipe';
import { MetingResolver } from './MetingResolver';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MetingAnalyseComponent } from './meting-analyse/meting-analyse.component';
import { MetingVooruitgangComponent } from './meting-vooruitgang/meting-vooruitgang.component';
import { GaugeChartModule } from 'angular-gauge-chart';
import { MatSliderModule } from '@angular/material/slider';


const routes: Routes = [
  { path: 'list', component: MetingListComponent },
  { path: 'add', component: AddMetingComponent },
  { 
    path: 'analyse/:id', 
    component: MetingAnalyseComponent, 
    resolve: { meting: MetingResolver }
  },
  { path: 'vooruitgang', component: MetingVooruitgangComponent }
];
@NgModule({
  declarations: [
    MetingComponent,
    ResultaatComponent,
    MetingListComponent,
    AddMetingComponent,
    MetingFilterPipe,
    MetingAnalyseComponent,
    MetingVooruitgangComponent
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
    MetingVooruitgangComponent
  ],
})
export class MetingModule {}
