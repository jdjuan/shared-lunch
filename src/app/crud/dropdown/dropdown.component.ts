import { UserService } from './../../core/user.service';
import { IMatches } from './../../core/definitions/imatches';
import { User } from './../../core/user';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css']
})
export class DropdownComponent implements OnInit {

  @Input() matches: IMatches;
  users: {
    [id: string]:
    { instance: User, quantity: number }
  };

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.users = {};
    if (this.matches) {
      for (const userId of Object.keys(this.matches)) {
        this.users[userId] = {
          instance: this.userService.getUserById(userId),
          quantity: this.matches[userId]
        }
      }
    }
  }

}
