import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetingDetailComponent } from './meting-detail.component';

describe('MetingDetailComponent', () => {
  let component: MetingDetailComponent;
  let fixture: ComponentFixture<MetingDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetingDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetingDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
