import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { SharedModule } from '../shared/shared.module';
import { ProfileComponent } from './profile/profile.component';
import { PAGES_ROUTES } from './pages.routes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AffiliatesComponent } from './affiliates/affiliates.component';
import { AccountHistoryComponent } from './account-history/account-history.component';

@NgModule({
  imports: [
    SharedModule,
    PAGES_ROUTES,
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [
    ProfileComponent,
    AffiliatesComponent,
    AccountHistoryComponent,
  ],
  exports: [
    ProfileComponent,
    AffiliatesComponent,
    AccountHistoryComponent,
  ]
})
export class PagesModule { }
