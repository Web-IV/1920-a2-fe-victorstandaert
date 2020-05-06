import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMetingComponent } from './add-meting.component';

describe('AddMetingComponent', () => {
  let component: AddMetingComponent;
  let fixture: ComponentFixture<AddMetingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMetingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
