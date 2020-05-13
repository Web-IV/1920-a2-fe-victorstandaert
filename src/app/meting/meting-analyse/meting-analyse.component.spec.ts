import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetingAnalyseComponent } from './meting-analyse.component';

describe('MetingAnalyseComponent', () => {
  let component: MetingAnalyseComponent;
  let fixture: ComponentFixture<MetingAnalyseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetingAnalyseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetingAnalyseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
