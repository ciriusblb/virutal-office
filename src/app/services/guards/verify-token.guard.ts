import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { UserService } from '../user/user.service';

@Injectable()
export class VerifyTokenGuard implements CanActivate {
  constructor(
    public _userService: UserService
  ) {}
  canActivate(): Promise<boolean> | boolean {
    const token = this._userService.token;
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirado = this.expirado(payload.exp);
    if (expirado) {
      this._userService.logout();
      return false;
    }
    return this.verificaRenueva(payload.exp);
  }

  verificaRenueva(fehcaExp: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const tokenExp = new Date(fehcaExp * 1000);
      const ahora = new Date();
      ahora.setTime(ahora.getTime() + (0.5 * 60 * 60 * 1000));
      if (tokenExp.getTime() > ahora.getTime()) {
        console.log('aun no');
        resolve(true);
      } else {
        this._userService.renuevaToken()
          .subscribe(() => {
            resolve(true);
          }, () => {
            this._userService.logout();
            reject(false);
          });
      }
    });
  }
  expirado(fechaExp: number) {
    const ahora = new Date().getTime() / 1000;
    if (fechaExp < ahora) {
      return true;
    } else {
      return false;
    }
  }
}
