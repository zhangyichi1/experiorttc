import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { AuthService } from '../../common/services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { User } from '../../common/models/user.model';
import { ManageUserConfirmDialogComponent } from './manage-user-confirm-dialog/manage-user-confirm-dialog.component';
import { MatDialog, MatPaginator, MatTableDataSource, MatSort } from '@angular/material';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.css']
})
export class ManageUserComponent {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSource: any;
  displayedColumns: any;
  iterableDiffer: any;

  constructor(private route: ActivatedRoute,
              private authService: AuthService,
              private flashMessages: FlashMessagesService,
              private dialog: MatDialog) {

    this.route.data.subscribe((data: Data) => {
      console.log('data is: ', data);
      this.displayedColumns = ['email', 'username', 'address', 'phone', 'roles', 'actions'];
      this.dataSource = new MatTableDataSource<User>(data.users);
      console.log('dataSource is: ', this.dataSource);
      // this.addSomeFakeUsers(20);
    })
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  onRemove(email, username) {
    console.log('email is: ', email);

    let dialogRef = this.dialog.open(ManageUserConfirmDialogComponent, {
      data: {
        username: username
      }
    });
    console.log('dialogRef is: ', dialogRef);

    dialogRef.afterClosed().subscribe((event) => {
      console.log('in afterclosed, new event is: ', event);
      if(event === true) {
        this.authService.removeUser(email).subscribe((res: any) => {
          if(res.success) {
            this.flashMessages.show(res.message, { cssClass: 'alert-success', timeout: 5000 });
            for(let i=0; i<this.dataSource.data.length; i++) {
              if(this.dataSource.data[i].email == email) {
                console.log('return value is: ', this.dataSource.data.splice(i, 1));
                console.log('dataSource is: ', this.dataSource);
                this.dataSource = new MatTableDataSource<User>(this.dataSource.data);
                this.dataSource.paginator = this.paginator;
              }
            }
          }else {
            this.flashMessages.show(res.message, { cssClass: 'alert-danger', timeout: 5000 });
          }
        });
      }
    });
  }

  addSomeFakeUsers(num: number) {
    for(let i=0; i<num; i++) {
      let email = 'test' + i + '@test.com';
      let username = 'test' + i;
      let password = 'test';
      let address = 'test' + i + '\'s address';
      let phone = '1234567890';
      let user = new User(email, username, address, phone, password);
      this.authService.signUpUser(user).subscribe((res) => {
        if(res.success) {
          console.log(email + ' registration succeeded');
        }else {
          console.log(email + ' registration failed');
        }
      })
    }
  }
}
