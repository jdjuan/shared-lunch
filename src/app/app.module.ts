import { CoreModule } from './core/core.module';
import { CrudModule } from './crud/crud.module';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './core/guard.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    CoreModule,
    CrudModule,
    AppRoutingModule
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
