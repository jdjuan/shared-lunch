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

  activeUsers: User[];

  constructor(private db: AngularFireDatabase) {
    this.fetchActiveUsers();
  }

  ngOnInit() {
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
      if (user.hasCurrentMatch()) {
        this.db.database
          .ref('/users/' + user.$key + '/matches/' + user.currentMatch)
          .transaction((oldValue) => oldValue ? oldValue + 1 : 1,
          this.onTransactionError, true);
        this.db.object('/users/' + user.$key).update({ 'currentMatch': 'NO_MATCH_SET' });
      }
    });
  }

  fetchActiveUsers() {
    this.db.list('/users', {
      query: {
        orderByChild: 'active',
        equalTo: true
      }
    }).subscribe((users: User[]) => {
      this.activeUsers = User.createUsers(users);
    });
  }

  onTransactionError(error, committed, snapshot) {
    if (error) {
      console.log('error in transaction');
    } else if (!committed) {
      console.log('transaction not committed');
    } else {
      console.log('Transaction Committed');
    }
  }
}

