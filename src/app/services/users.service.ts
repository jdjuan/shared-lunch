import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { User } from "../interfaces/user.interface";
import 'rxjs/Rx';

@Injectable()
export class UsersService {

  usersURLdb: string = "https://shared-lunch-1efae.firebaseio.com/users.json";
  userURLdb: string = "https://shared-lunch-1efae.firebaseio.com/users/";

  constructor(private http: Http) { }

  nuevoUser(user: User) {

    let body = JSON.stringify(user);
    let headers = new Headers({
      'Content_Type': 'application/json'
    });

    return this.http.post(this.usersURLdb, body, { headers })
      .map(res => {
        console.log(res.json());
        return res.json();
      })
  }

  ActualizarUser(user: User, key$: string) {

    let body = JSON.stringify(user);
    let headers = new Headers({
      'Content_Type': 'application/json'
    });

    let url = `${this.userURLdb}/${key$}.json`;

    return this.http.put(url, body, { headers })
      .map(res => {
        console.log(res.json());
        return res.json();
      })
  }

  getUser(key$) {
    let url = `${this.userURLdb}/${key$}.json`;
    return this.http.get(url).map(res => res.json());
  }

  getUsers() {
    return this.http.get(this.usersURLdb).map(res => res.json());
  }

  borrarUser(key$:string){
    let url = `${this.userURLdb}/${key$}.json`;
    return this.http.delete(url).map(res => res.json())

  }
}
