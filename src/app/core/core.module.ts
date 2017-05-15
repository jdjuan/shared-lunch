import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { UserService } from './user.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

const firebaseConfig = {
  apiKey: 'AIzaSyBqKAZkqej4_iVBTmPof7_3CwivOpskQW8',
  authDomain: 'shared-lunch.firebaseapp.com',
  databaseURL: 'https://shared-lunch.firebaseio.com',
  storageBucket: 'shared-lunch.appspot.com',
  messagingSenderId: '44211415855'
};

@NgModule({
  imports: [
    CommonModule,
    AngularFireModule.initializeApp(firebaseConfig, 'my-app-name'),
    AngularFireDatabaseModule
  ],
  declarations: [],
  providers: [UserService]
})
export class CoreModule { }
