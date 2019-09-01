import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/service.index';
import { NgForm } from '@angular/forms';
import { User } from '../models/user.model';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';

declare function init_plugins();

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  remember: boolean = false;
  email: string;
  constructor(public router: Router, public _userService: UserService, public http: HttpClient) {
  }

  ngOnInit() {
    init_plugins();
    this.email = localStorage.getItem('email') || '';
    if (this.email.length > 1) {
      this.remember = true;
    }
  }
  login(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const user = new User(form.value.email, form.value.password, null, null);
    Swal({
      title: 'Verificando Credenciales',
      html: '<h2> <strong></strong> </h2>',
      onBeforeOpen: () => {
        Swal.showLoading();
        this._userService.login(user, form.value.remember)
          .subscribe(resp => {
            Swal.getContent().querySelector('strong').textContent = 'Autenticando usuario';
            this._userService._firebaseAuth().then((data) => {
              Swal.hideLoading(); Swal.close();
              this.router.navigate(['/profile']);
            });
          });
      },
    });
  }
}
