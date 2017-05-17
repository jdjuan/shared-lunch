import { UserService } from './../../core/user.service';
import { User } from './../../core/user';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {

  constructor(private userService: UserService) { }

  ngOnInit() {
  }
  showAll() {
    this.userService.filter = Object.keys(this.userService.cachedUsers);
  }

  filterUsersThatHaveMatched(haveMatched: boolean) {
    this.userService.filter = [];
    this.userService.users.forEach((user: User) => {
      const filterUser = haveMatched ? user.hasMatched() : !user.hasMatched();
      if (filterUser) {
        this.userService.filter.push(user.$key);
      }
    });
  }

  filterUsersWithCurrentMatch(withCurrentMatch: boolean) {
    this.userService.filter = [];
    this.userService.users.forEach((user: User) => {
      const filterUser = withCurrentMatch ? user.currentMatch : !user.currentMatch;
      if (filterUser) {
        this.userService.filter.push(user.$key);
      }
    });
  }

  filterConfirmed(confirmed) {
    this.userService.filter = [];
    this.userService.users.forEach((user: User) => {
      const filterUser = confirmed ? user.matchConfirmed : !user.matchConfirmed;
      if (filterUser) {
        this.userService.filter.push(user.$key);
      }
    });
  }

  filterInactiveUsers() {
    this.userService.filter = [];
    this.userService.users.forEach((user: User) => {
      if (!user.isActive()) {
        this.userService.filter.push(user.$key);
      }
    });
  }
}
