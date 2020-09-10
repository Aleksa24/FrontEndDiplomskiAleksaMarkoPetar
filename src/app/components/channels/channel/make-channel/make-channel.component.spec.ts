import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeChannelComponent } from './make-channel.component';

describe('MakeChannelComponent', () => {
  let component: MakeChannelComponent;
  let fixture: ComponentFixture<MakeChannelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakeChannelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakeChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
