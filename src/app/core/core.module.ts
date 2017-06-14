import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireModule } from 'angularfire2';
import { UserService } from './user.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthModule } from "./../auth/auth.module";

const firebaseConfig = {
  apiKey: 'AIzaSyCtQA6I7dECF8MrcAbnsIsAzBhxZ0W9fLY',
  authDomain: 'testeo-ee0f2.firebaseapp.com',
  databaseURL: 'https://testeo-ee0f2.firebaseio.com',
  storageBucket: 'testeo-ee0f2.appspot.com',
  messagingSenderId: '609257446137'

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
    AngularFireAuthModule,
    AuthModule 
  ],
  declarations: [],
  providers: [UserService]
})
export class CoreModule { }
