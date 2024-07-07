import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendsMenuComponent } from './friends-menu.component';

describe('FriendsMenuComponent', () => {
  let component: FriendsMenuComponent;
  let fixture: ComponentFixture<FriendsMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FriendsMenuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FriendsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
