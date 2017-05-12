import { Component, OnInit } from '@angular/core';
import { UsersService } from "../../services/users.service";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
   users: any;

  constructor(private _userServices: UsersService) { 
    this._userServices.getUsers().subscribe(users=>{
      console.log(users);
      this.users=users;
    })
  }

  ngOnInit() {
  }

  borrarUser(key$:string){
    this._userServices.borrarUser(key$).subscribe(respuesta=>{
      if(respuesta){
        console.error(respuesta);
      }else{
        delete this.users[key$]; 
      }
    })

  }

}
