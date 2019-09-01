import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { UserService } from '../../services/service.index';
import { AngularFireStorage } from '@angular/fire/storage';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: []
})
export class ProfileComponent implements OnInit {
  user: User;
  imagenTemp: any;
  levels: any;
  constructor(public _userService: UserService, private afStorage: AngularFireStorage) {
    this.user = this._userService.user;
  }

  ngOnInit() {
    this.getUser();
  }
  getUser() {
    this._userService.getUser()
      .subscribe(resp => {
          this.getLevels();
      });
  }
  getLevels() {
    this._userService.getLevels()
      .subscribe(resp => {
        this.levels = resp;
      });
  }

  updateUser(user: User) {
    const userUpdated = new User(
      this.user.email,
      user.password,
      user.phoneNumber,
      this.user.sponsor,
      this.user.DNI,
      user.name,
      user.lastname,
      this.user.arm,
      this.user.photoURL,
      user.address,
      this.user.id,
      user.newPassword,
      user.city,
      user.country,
      this.user.points,
      this.user.rank,
      user.postalCode,
      this.user.file
    );
    if (userUpdated.newPassword) {
      if (!userUpdated.password) {
        swal('Importante', 'escriba su contraseña actual', 'warning');
        return;
      }
      swal({
        title: '¿Está seguro?',
        text: 'Usted va a actualizar su contraseña actual',
        icon : 'warning',
        buttons: ['Cancelar', 'Continuar'],
      }).then((willUpdate) => {
        if (willUpdate) {
          this.updateUser1(userUpdated);
        }
      });
    } else {
        this.updateUser1(userUpdated);
    }
  }
  updateUser1(userUpdated: User) {
    Swal({
      title: 'Actualizando datos',
    });
    Swal.showLoading();
    if (userUpdated.file) {
      this.updateUser2(userUpdated);
    } else {
      this.updateUser3(userUpdated);
    }
  }
  updateUser2(userUpdated: User) {
    this.afStorage.upload('users/' + userUpdated.id, userUpdated.file).then(() => {
      const ref = this.afStorage.ref('users/' + userUpdated.id);
      ref.getDownloadURL().subscribe(url => {
        userUpdated.photoURL = url;
        userUpdated.file = undefined;
        this.updateUser3(userUpdated);
      });
    });
  }
  updateUser3(userUpdated: User) {
    this._userService.updateUser(userUpdated)
      .subscribe(resp => {
        this.user = this._userService.user;
        Swal.hideLoading();
        Swal('Usuario Actualizando', this.user.email, 'success');
      });
  }

  selectImage(archivo: File) {
    if (!archivo) {
      this.user.file = undefined;
      return;
    }
    if (archivo.type.indexOf('image') < 0) {
      swal('Solo imágenes', 'el archivo que estas subiendo no es una imagen', 'error');
      this.user.file = undefined;
      return;
    }
    const reader = new FileReader();
    const urlImagenTemp = reader.readAsDataURL(archivo);
    reader.onloadend = () => this.imagenTemp = reader.result;
    this.user.file = archivo;
  }
}
