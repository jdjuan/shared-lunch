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

        this. db.database.ref('/users/' + user.$key + '/matches/'+user.currentMatch)
        .transaction((oldPin) => {
          console.log("Primer paso");
              // Check if the result is NOT NULL:
              if (oldPin) {
                  const myvar = oldPin+1;
                  console.log(myvar)
                  return myvar;
                  
              } else {
                  // Return a value that is totally different 
                  // from what is saved on the server at this address:
                  return 1;
              }
          }, function(error, committed, snapshot) {
              if (error) {
                  console.log("error in transaction");
              } else if (!committed) {
                  console.log("transaction not committed");
              } else {
                  console.log("Transaction Committed");
              }
          }, true);
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
}

