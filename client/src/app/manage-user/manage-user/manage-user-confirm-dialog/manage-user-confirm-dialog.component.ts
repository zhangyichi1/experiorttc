import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-manage-user-confirm-dialog',
  templateUrl: './manage-user-confirm-dialog.component.html',
  styleUrls: ['./manage-user-confirm-dialog.component.css']
})
export class ManageUserConfirmDialogComponent {

  message: string;

  constructor(
    public dialogRef: MatDialogRef<ManageUserConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      console.log('in edit dialog constructor and the data is: ', this.data);
      this.message = 'Are you sure you want to permanently delete ' + this.data.username + '\'s account?';
  }
}
