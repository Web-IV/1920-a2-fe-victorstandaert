import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetingVooruitgangComponent } from './meting-vooruitgang.component';

describe('MetingVooruitgangComponent', () => {
  let component: MetingVooruitgangComponent;
  let fixture: ComponentFixture<MetingVooruitgangComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetingVooruitgangComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetingVooruitgangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
