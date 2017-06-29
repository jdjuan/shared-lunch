import { CrudComponent } from './crud/crud.component';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guard.service';

const routes: Routes = [
    { path: '', redirectTo: 'crud', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'crud', component: CrudComponent ,  canActivate: [AuthGuard]}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}