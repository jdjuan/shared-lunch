import { User } from './shared/user';
import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private db: AngularFireDatabase) { }

  ngOnInit(): void {
    this.getActiveUsers().subscribe((users: User[]) => {
      users.forEach((user: User) => {
        if (this.isNewUser(user)) {
          const possibleMatches: User[] = this.getPossibleMatches(user, users);
          console.log(user);
          console.log(possibleMatches);
          console.log(this.selectRandomMatch(possibleMatches));
        }
      });
    });
  }

  selectRandomMatch(possibleMatches: User[]): User {
    return possibleMatches[this.getRandomNumber(possibleMatches.length)];
  }

  getPossibleMatches(user: User, allUsers: User[]): User[] {
    const availableUsers: User[] = [];
    const filteredUsers: User[] = this.filterUsersByLocation(allUsers, user.location);
    filteredUsers.forEach((userMatch: User) => {
      if (user !== userMatch && userMatch.currentMatch !== 'NO_MATCH_SET') {
        availableUsers.push(userMatch);
      }
    });
    return availableUsers;
  }

  getActiveUsers(): FirebaseListObservable<any[]> {
    return this.db.list('/users', {
      query: {
        orderByChild: 'active',
        equalTo: true,
      }
    });
  }

  filterUsersByLocation(users: User[], location: number): User[] {
    const availableUsers: User[] = users
      .filter((user: User) => location === 2 || location === user.location);
    return availableUsers.length ? availableUsers : users;
  }

  isNewUser(user: User): boolean {
    return !this.hasMatched(user) && !this.hasCurrentMatch(user);
  }

  hasMatched(user: User): boolean {
    return user.matches ? !Object.keys(user.matches).length : false;
  }

  hasCurrentMatch(user: User): boolean {
    return user.currentMatch !== 'NO_MATCH_SET';
  }

  getRandomNumber(limit: number): number {
    return Math.trunc(Math.random() * limit);
  }
}

