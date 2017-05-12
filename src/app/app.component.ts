import { User } from './shared/user';
import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  private activeUsers: User[];

  constructor(private db: AngularFireDatabase) {
    this.fetchActiveUsers();
  }

  ngOnInit() {
    // this.settleCurrentMatches();
  }

  generateMatchesForNewbies() {
    this.activeUsers.forEach((user: User) => {
      if (user.isNewUser()) {
        console.log(user);
        console.log(user.getMatch(this.activeUsers));
      }
    });
  }

  settleCurrentMatches() {
    this.activeUsers.forEach((user: User) => {
      if (user.currentMatch !== 'NO_MATCH_SET') {
        const currentMatch = user.currentMatch;
        // user.matches.
        // if() {
        // db.database.ref('').transaction
        // }
        const match = {};
        match[currentMatch] = 1;
        this.db.object('/users/' + user.$key + '/matches').update(match);
        this.db.object('/users/' + user.$key).update({ 'currentMatch': 'NO_MATCH_SET' });
      }
    });
  }

  fetchActiveUsers() {
    this.db.list('/users', {
      query: {
        orderByChild: 'active',
        equalTo: true,
        limitToFirst: 1
      }
    }).subscribe((users: User[]) => {
      this.activeUsers = User.createUsers(users);
    });
  }
}

