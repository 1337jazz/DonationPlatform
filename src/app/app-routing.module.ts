import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin/admin-auth/admin.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './_guards/auth.guard';
import { AdminHomeComponent } from './admin/admin-home/admin-home.component';
import { ErrorPageComponent } from './_layout/error-page/error-page.component';
import { ManageComponent } from './admin/manage/manage.component';
import { ArchiveComponent } from './admin/archive/archive.component';
import { ScheduleComponent } from './admin/schedule/schedule.component';
import { ManageDonationComponent } from './admin/manage-donation/manage-donation.component';
import { SuccessComponent } from './home/success/success.component';
import { FormPostedService } from './_services/form-posted.service';
import { SuccessGuard } from './_guards/success.guard';
import { SettingsComponent } from './admin/settings/settings.component';
import { AdminGuard } from './_guards/admin.guard';

const routes: Routes = [
  { path: '', component: HomeComponent , data: {animation: 'yes-5'}},
  { path: 'admin', component: AdminComponent, data: {animation: 'yes-6'}},
  { path: 'admin/admin-home', component: AdminHomeComponent, canActivate: [AuthGuard, AdminGuard], data: {animation: 'yes-8'}},
  { path: 'admin/manage', component: ManageComponent, canActivate: [AuthGuard, AdminGuard], data: {animation: 'yes-0'}},
  { path: 'admin/manage/:id', component: ManageDonationComponent, canActivate: [AuthGuard],  data: {animation: 'yes-1'}},
  { path: 'admin/archive', component: ArchiveComponent, canActivate: [AuthGuard, AdminGuard], data: {animation: 'yes-2'}},
  { path: 'admin/schedule', component: ScheduleComponent, canActivate: [AuthGuard], data: {animation: 'yes-3'}},
  { path: 'admin/settings', component: SettingsComponent, canActivate: [AuthGuard, AdminGuard], data: {animation: 'yes-4'}},
  { path: 'error', component: ErrorPageComponent},
  { path: 'success', component: SuccessComponent, data: {animation: 'yes-7'}},
  // { path: 'success', component: SuccessComponent, canActivate: [SuccessGuard]},
  { path: '**', redirectTo: 'error', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
