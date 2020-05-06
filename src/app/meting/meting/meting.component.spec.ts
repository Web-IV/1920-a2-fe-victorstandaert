import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetingComponent } from './meting.component';

describe('MetingComponent', () => {
  let component: MetingComponent;
  let fixture: ComponentFixture<MetingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
