import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { UserService } from './user.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

const firebaseConfig = {
  apiKey: 'AIzaSyBqKAZkqej4_iVBTmPof7_3CwivOpskQW8',
  authDomain: 'shared-lunch.firebaseapp.com',
  databaseURL: 'https://shared-lunch.firebaseio.com',
  projectId: 'shared-lunch',
  storageBucket: 'shared-lunch.appspot.com',
  messagingSenderId: '44211415855'
};

@NgModule({
  imports: [
    CommonModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
  ],
  declarations: [],
  providers: [UserService]
})
export class CoreModule { }
