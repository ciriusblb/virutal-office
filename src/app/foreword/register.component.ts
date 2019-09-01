import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import swal from 'sweetalert';
import { UserService } from '../services/service.index';
import { User } from '../models/user.model';
import Swal from 'sweetalert2';

declare function init_plugins();

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./login.component.css']
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  constructor(
    public _userService: UserService,
    public router: Router
  ) { }

  theyAreEqual(field1: string, field2: string) {
    return (group: FormGroup) => {
      const pass1 = group.controls[field1].value;
      const pass2 = group.controls[field2].value;
      if (pass1 === pass2) {
        return null;
      }
      return{
        theyAreEqual: true
      };
    };
  }
  ngOnInit() {
    init_plugins();
    this.form = new FormGroup({
      name: new FormControl( null, Validators.required),
      lastname: new FormControl( null, Validators.required),
      email: new FormControl( null, [Validators.required, Validators.email]),
      password: new FormControl( null, Validators.required),
      password2: new FormControl( null, Validators.required),
      phoneNumber: new FormControl( null, Validators.required),
      DNI: new FormControl( null, Validators.required),
      sponsor: new FormControl( null, Validators.required),
      terms: new FormControl( false )
    }, {validators: this.theyAreEqual('password', 'password2')});

    this.form.setValue({
      name: '',
      lastname: '',
      email: '',
      password: '',
      password2: '',
      phoneNumber: '',
      DNI: null,
      sponsor: null,
      terms: false
    });

  }
  registerUser() {
    if (this.form.invalid) {
      return;
    }
    if (!this.form.value.terms) {
      swal('Importante', 'Debes aceptar las condiciones', 'warning');
      return;
    }
    const user = new User(
      this.form.value.email,
      this.form.value.password,
      this.form.value.phoneNumber,
      this.form.value.sponsor,
      this.form.value.DNI,
      this.form.value.name,
      this.form.value.lastname,
    );
    Swal({
      title: 'Registrando Usuario',
      html: 'Esto puede tomar un laaargo pero laaaargos segundos, no... ¡Horas!',
      onBeforeOpen: () => {
        Swal.showLoading();
        this._userService.createUser(user)
        .subscribe(resp => {
          Swal.hideLoading(); Swal.close();
          this.router.navigate(['/login']);
        });
      },
    });
  }
}
