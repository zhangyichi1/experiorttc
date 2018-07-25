import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageUserConfirmDialogComponent } from './manage-user-confirm-dialog.component';

describe('ManageUserConfirmDialogComponent', () => {
  let component: ManageUserConfirmDialogComponent;
  let fixture: ComponentFixture<ManageUserConfirmDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageUserConfirmDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageUserConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
