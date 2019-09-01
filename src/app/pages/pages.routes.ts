import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { VerifyTokenGuard } from '../services/service.index';
import { AffiliatesComponent } from './affiliates/affiliates.component';
import { AccountHistoryComponent } from './account-history/account-history.component';



const pagesRoutes: Routes = [
    { path: 'profile', component: ProfileComponent, canActivate: [VerifyTokenGuard], data: { title: 'Perfil del usuario'} },
    { path: 'affiliates', component: AffiliatesComponent, canActivate: [VerifyTokenGuard], data: { title: 'Afiliados'} },
    { path: 'accountHistory', component: AccountHistoryComponent, canActivate: [VerifyTokenGuard], data: { title: 'Historial de cuentas'} },
    { path: '', redirectTo: '/profile', pathMatch: 'full' }
];

export const PAGES_ROUTES = RouterModule.forChild( pagesRoutes );
