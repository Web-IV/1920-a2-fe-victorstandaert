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

const routes: Routes = [
  { path: 'list', component: MetingListComponent },
  { path: 'add', component: AddMetingComponent },
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
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    HttpClientModule
  ],
  exports: [AddMetingComponent, MetingListComponent],
})
export class MetingModule {}
