import { User } from './shared/user';
import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  private _activeUsers: FirebaseListObservable<any[]>;

  constructor(private db: AngularFireDatabase) { }

  ngOnInit() {
    this.activeUsers.map((users: User[]) => User.createUsers(users))
      .subscribe((users: User[]) => {
        users.forEach((user: User) => {
          if (user.isNewUser()) {
            console.log(user);
            console.log(user.getMatch(users));
          }
        });
      });
  }

  get activeUsers(): FirebaseListObservable<any[]> {
    if (!this._activeUsers) {
      this._activeUsers = this.db.list('/users', {
        query: {
          orderByChild: 'active',
          equalTo: true,
        }
      });
    }
    return this._activeUsers;
  }
}

