import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { User } from "../../interfaces/user.interface";
import { UsersService } from "../../services/users.service";


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  private user: User = {
    active: true,
    firstName: "",
    lastName: "",
    email: ""
  }

  nuevo: boolean = false;
  id: string;

  constructor(private _userServices: UsersService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {

    this.activatedRoute.params.subscribe(parametros => {
      this.id = parametros['id']
      if (this.id !== "nuevo") {
        this._userServices.getUser(this.id).subscribe(user => this.user = user)
      }
    });

  }

  ngOnInit() {
  }

  guardar() {
    console.log(this.user);

    if (this.id == "nuevo") {
      this._userServices.nuevoUser(this.user).subscribe(data => {
        this.router.navigate(['/user', data.name])
      },
        error => console.error(error));
    } else {
      this._userServices.ActualizarUser(this.user, this.id).subscribe(data => {
        console.log(data);
      },
        error => console.error(error));
    }
  }

  agregarNuevo(forma: NgForm) {
    this.router.navigate(['/user', 'nuevo']);

    forma.reset({
      
    });
  }

}
