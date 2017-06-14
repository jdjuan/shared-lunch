import { CanActivate, Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import 'rxjs/add/observable/from';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authFirebase: AngularFireAuth, private router: Router) {
    console.log('Estatus', authFirebase.authState);
  }

  canActivate(): Observable<boolean> {
    return Observable.from(this.authFirebase.authState)
      .take(1)
      .map(state => !!state)
      .do(authenticated => {
        console.log(authenticated);
        if (!authenticated) {
          this.router.navigate(['/login']);
        }
      })
  }

}