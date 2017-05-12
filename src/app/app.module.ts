import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';


//Components
import { AppComponent } from './app.component';
import { UsersComponent } from './components/users/users.component';
import { UserComponent } from './components/users/user.component';

//Routes
import { APP_ROUTING } from './app.routes';

//services
import { UsersService } from "./services/users.service";

//AngularFire
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';

//pipes
import { KeysPipe } from './pipes/keys.pipe';

const firebaseConfig = {
  // apiKey: 'AIzaSyBqKAZkqej4_iVBTmPof7_3CwivOpskQW8',
  // authDomain: 'shared-lunch.firebaseapp.com',
  // databaseURL: 'https://shared-lunch.firebaseio.com',
  // storageBucket: 'shared-lunch.appspot.com',
  // messagingSenderId: '44211415855'
    apiKey: "AIzaSyATXIzetlqqVm2kv96FeV0IzfQ-6Rh9WRs",
    authDomain: "shared-lunch-1efae.firebaseapp.com",
    databaseURL: "https://shared-lunch-1efae.firebaseio.com",
    projectId: "shared-lunch-1efae",
    storageBucket: "shared-lunch-1efae.appspot.com",
    messagingSenderId: "88873309460"
};

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    UsersComponent,
    KeysPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    APP_ROUTING,
    AngularFireModule.initializeApp(firebaseConfig, 'my-app-name'),
    AngularFireDatabaseModule
  ],
  providers: [UsersService],
  bootstrap: [AppComponent]
})
export class AppModule { }
