import { Component, OnInit } from '@angular/core';

import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import * as firebase from 'firebase';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  test: FirebaseObjectObservable<any>;

  constructor(private db: AngularFireDatabase) { }

  ngOnInit(): void {
    const activeUsers$ = this.getActiveUsers();
    activeUsers$.subscribe(users => {
      const newUsers = this.filterNewUsers(users);
      const usersWithoutMatch = this.filterUsersWithoutCurrentMatch(newUsers);
      usersWithoutMatch.forEach(userLeft => {
        let availableUserList = '';
        // console.log(userLeft.location, userLeft.firstName, "Principal");
        const usersFilteredByLocation = this.filterUsersByLocation(users, userLeft.location);
        usersFilteredByLocation.forEach(userRight => {
          if (userLeft !== userRight && userRight.currentMatch !== "NO_MATCH_SET") {
            availableUserList += userRight.firstName + " - ";
          }
        });
        console.log(availableUserList);
      });
    });
  }

  getActiveUsers() {
    return this.db.list('/users', {
      query: {
        orderByChild: "active",
        equalTo: true,
      }
    });
  }

  filterNewUsers(users) {
    return users.filter(user => user.matches ? !Object.keys(user.matches).length : true);
  }

  filterUsersWithoutCurrentMatch(users) {
    return users.filter(user => user.currentMatch === "NO_MATCH_SET");
  }

  filterUsersByLocation(users, location) {
    let availableUsers = users.filter(user => location === 2 || location === user.location);
    return availableUsers.length ? availableUsers : users;
  }
}

