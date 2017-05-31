import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { UserService } from './user.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthModule } from "./../auth/auth.module"; 
const firebaseConfig = {
  apiKey: "AIzaSyCtQA6I7dECF8MrcAbnsIsAzBhxZ0W9fLY", 
  authDomain: "testeo-ee0f2.firebaseapp.com", 
  databaseURL: "https://testeo-ee0f2.firebaseio.com", 
  projectId: "testeo-ee0f2", 
  storageBucket: "testeo-ee0f2.appspot.com", 
  messagingSenderId: "609257446137" 
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
