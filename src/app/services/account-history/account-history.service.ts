import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { UserService } from '../user/user.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/internal/operators/map';
import { catchError } from 'rxjs/internal/operators/catchError';
import { throwError } from 'rxjs/internal/observable/throwError';

@Injectable({
  providedIn: 'root'
})
export class AccountHistoryService {
  months: Array<string> = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  payment: number = 0;
  constructor(public _userService: UserService, public http: HttpClient) { }
  getAccountHistory() {
    let url = environment.apiRoot + 'accountHistory/' + this._userService.user.DNI;
    url += '?IdToken=' + this._userService.IdToken;
    return this.http.get(url)
    .pipe(map((resp: any) => {
      resp.result.forEach(element => {
        this.payment += element.money;
      });
      resp.result.sort((a: any, b: any) => {
        return ((b.date._seconds  * 1000) - (a.date._seconds  * 1000));
      });
      return resp.result;
    }), catchError(err => {
        return throwError(err);
    }));
  }
  setpaymentHistory() {
    let url = environment.apiRoot + 'accountHistory/' + this._userService.user.DNI;
    url += '?IdToken=' + this._userService.IdToken;
    return this.http.put(url, {payment: this.payment})
    .pipe(map((resp: any) => {
      for (let i = 0; i < resp.result.length; i++) {
        resp.result[i].month = this.months[resp.result[i].month];
      }
      return resp.result;
    }), catchError(err => {
        return throwError(err);
    }));
  }
  getpaymentHistory() {
  let url = environment.apiRoot + 'accountHistory/get/' + this._userService.user.DNI;
    url += '?IdToken=' + this._userService.IdToken;
    return this.http.get(url)
    .pipe(map((resp: any) => {
      for (let i = 0; i < resp.result.length; i++) {
        resp.result[i].month = this.months[resp.result[i].month];
      }
      return resp.result;
    }), catchError(err => {
        return throwError(err);
    }));
  }
}
