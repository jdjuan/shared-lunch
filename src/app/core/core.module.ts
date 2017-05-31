import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { UserService } from './user.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthModule } from "./../auth/auth.module"; 
const firebaseConfig = {
  apiKey: 'AIzaSyBqKAZkqej4_iVBTmPof7_3CwivOpskQW8',
  authDomain: 'shared-lunch.firebaseapp.com',
  databaseURL: 'https://shared-lunch.firebaseio.com',
  storageBucket: 'shared-lunch.appspot.com',
  messagingSenderId: '44211415855'

    // apiKey: "AIzaSyATXIzetlqqVm2kv96FeV0IzfQ-6Rh9WRs",
    // authDomain: "shared-lunch-1efae.firebaseapp.com",
    // databaseURL: "https://shared-lunch-1efae.firebaseio.com",
    // projectId: "shared-lunch-1efae",
    // storageBucket: "shared-lunch-1efae.appspot.com",
    // messagingSenderId: "88873309460"  
};

@NgModule({
  imports: [
    CommonModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AuthModule 
  ],
  declarations: [],
  providers: [UserService]
})
export class CoreModule { }
