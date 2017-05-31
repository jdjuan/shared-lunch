import { CrudComponent } from './crud/crud/crud.component';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
//import { AuthGuard } from './auth/auth.service';
const routes: Routes = [
    { path: '', redirectTo: 'crud', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'crud', component: CrudComponent},
    // { path: '**', component: PageNotFoundComponent , canActivate: [AuthGuard]  },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}