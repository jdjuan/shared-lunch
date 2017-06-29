import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, public authf: AngularFireAuth) {
    if (!authf.auth.currentUser) {
      this.authf.auth.signInWithEmailAndPassword('david.juanherrera@gmail.com', '123456')
        .catch((error: any) => {
          console.log('Creating failed errorCode: ' + error.code);
          console.log('Creating failed errorMessage: ' + error.message);
        });
    }
    authf.authState.subscribe(data => console.log(data));
    this.router.navigateByUrl('/crud');
  }

  ngOnInit() {
  }

  onSubmit(formData: any) {
    if (formData.valid) {
    }
  }
}
