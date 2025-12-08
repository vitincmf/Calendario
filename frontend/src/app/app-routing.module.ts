import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LayoutPrincipalComponent } from './layout/layout-principal/layout-principal.component';
import { CalendarComponent } from './calendar/calendar.component';
//import { pathToFileURL } from 'url';

const routes: Routes = [
  {path: '', redirectTo: 'auth/login', pathMatch: 'full'},
  {path: 'auth/login', component: LoginComponent },
  {path: 'auth/register', component: RegisterComponent},
  {path: 'main', component: LayoutPrincipalComponent, children: [
    {path: '', redirectTo: 'calendar', pathMatch: 'full'},
    { path: 'calendar', component: CalendarComponent },
  ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
