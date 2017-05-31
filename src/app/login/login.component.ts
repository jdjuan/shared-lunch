import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  state: string = '';
  error: any;
  constructor( private router: Router) {

    // if (authf.authState) {
    //   this.router.navigateByUrl('/members');
    // }

  }

  ngOnInit() {
  }
  // onSubmit(formData: any) {
  //   if (formData.valid) {
  //     console.log(formData.value);
  //     this.authf.auth.signInWithEmailAndPassword("user", "password").catch( (error: any) => {
  //       const errorCode = error.code;
  //       const errorMessage = error.message;
  //       console.log("login failed errorCode: " + errorCode);
  //       console.log("login failed errorMessage: " + errorMessage);
  //     });

  //   }
  // }
}
