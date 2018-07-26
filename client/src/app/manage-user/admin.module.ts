import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutesModule } from './admin-routes.module';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { ManageUserConfirmDialogComponent } from './manage-user/manage-user-confirm-dialog/manage-user-confirm-dialog.component';
import { ManageUserResolver } from './manage-user/manage-user-resolver.service';
import { AdminGuard } from './guards/admin.guard';

import {
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatButtonModule
} from '@angular/material';

@NgModule({
  declarations: [
    ManageUserComponent,
    ManageUserConfirmDialogComponent
  ],
  imports: [
    CommonModule,
    AdminRoutesModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule
  ],
  entryComponents: [ManageUserConfirmDialogComponent],
  providers: [ManageUserResolver, AdminGuard]
})
export class AdminModule { }
