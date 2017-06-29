import { UserService } from './../core/user.service';

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.scss']
})
export class CrudComponent implements OnInit {

  constructor(public userService: UserService) { }

  ngOnInit() {
  }

}
