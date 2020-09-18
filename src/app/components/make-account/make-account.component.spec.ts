import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeAccountComponent } from './make-account.component';

describe('MakeAccountComponent', () => {
  let component: MakeAccountComponent;
  let fixture: ComponentFixture<MakeAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakeAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakeAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
