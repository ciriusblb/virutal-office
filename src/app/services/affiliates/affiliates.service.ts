import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { UserService } from '../user/user.service';
import { map } from 'rxjs/internal/operators/map';
import { catchError } from 'rxjs/internal/operators/catchError';
import { throwError } from 'rxjs/internal/observable/throwError';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AffiliatesService {

  constructor(public _userService: UserService, public http: HttpClient) { }

  getAffiliates(DNI: number) {
    let url = environment.apiRoot + 'afiliado/' + DNI;
    url += '?IdToken=' + this._userService.IdToken;
    return this.http.get(url)
      .pipe(map((resp: any) => {
        resp.getDocs.afiliados.sort((a, b) => {
          return (a.arm - b.arm);
        });
        return resp;
      }), catchError(err => {
          swal('error en el la actualización', err.error.message, 'error');
          return throwError(err);
      }));
  }
  registerAffiliate(newUser: any) {
    let url = environment.apiRoot + 'afiliado';
    url += '?IdToken=' + this._userService.IdToken;
    return this.http.post(url, newUser)
      .pipe(map((resp: any) => {
        return resp;
      }), catchError(err => {
          swal('error en la activación de cuenta', err.error.message, 'error');
          Swal.close();
          return throwError(err);
      }));
  }
}
