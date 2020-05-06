import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetingListComponent } from './meting-list.component';

describe('MetingListComponent', () => {
  let component: MetingListComponent;
  let fixture: ComponentFixture<MetingListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetingListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
