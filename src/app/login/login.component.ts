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
  constructor(private router: Router, public authf: AngularFireAuth) {

    if (authf.authState) {
      this.router.navigateByUrl('/crud');
    }

  }

  ngOnInit() {
  }
  onSubmit(formData: any) {
    if (formData.valid) {

      this.authf.auth.signInWithEmailAndPassword("harlengiraldo@gmail.com", "password").catch((error: any) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("Creating failed errorCode: " + errorCode);
        console.log("Creating failed errorMessage: " + errorMessage);
        this.authf.auth.createUserWithEmailAndPassword("harlengiraldo@gmail.com", "password").catch(
          (error: any) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("Loginieando failed errorCode: " + errorCode);
            console.log("Loginieando failed errorMessage: " + errorMessage);
          }
        )
      });

    }
  }
}
