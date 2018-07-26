import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { ManageUserResolver } from './manage-user/manage-user-resolver.service';
import { AdminGuard } from './/guards/admin.guard';

const rootRouterConfig: Routes = [
  { path: 'manageuser', component: ManageUserComponent, resolve: { users: ManageUserResolver }, canActivate: [AdminGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(rootRouterConfig)],
  exports: [RouterModule]
})

export class AdminRoutesModule {

}
