import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangeRecordsComponent } from './exchange-records.component';

describe('ExchangeRecordsComponent', () => {
  let component: ExchangeRecordsComponent;
  let fixture: ComponentFixture<ExchangeRecordsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExchangeRecordsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExchangeRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
