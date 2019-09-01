import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../../models/user.model';
import { environment } from '../../../environments/environment.prod';
import { map, catchError, filter, tap, } from 'rxjs/operators';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { throwError } from 'rxjs/internal/observable/throwError';
import { SharedService } from '../shared/shared.service';
import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: User;
  token: string;
  IdToken: string;
  freepass: boolean;
  downloadURL: any;

  constructor(public http: HttpClient,
    private afAuth: AngularFireAuth,
    public router: Router,
    public _sharedService: SharedService) {
    this.cargarStorage();
  }
  renuevaToken() {
    let url = environment.apiRoot + 'login/renuevaToken';
    url += '?IdToken=' + this.IdToken;
    return this.http.get(url)
            .pipe(
              map((resp: any) => {
              this.guardarStorage(resp.customToken, this.user);
              console.log('oken renovado');
              this._firebaseAuth();
              return true;
            }), catchError(err => {
              this.logout();
              swal('token', 'error en la renovación del token ', 'error');
              return throwError(err);
            })
          );
  }
  getLevels() {
    const url = environment.apiRoot + 'usuario/levels';
    return this.http.get(url)
      .pipe(
        map( (resp: any) => {
          resp.forEach( (valor, indice) => {
            valor.bgClass = this._sharedService.blClasses[indice].class;
            valor.complete = 0;
          });
          resp.sort((a, b) => {
            return (b.level - a.level);
          });
          for (let i = resp.length - 1 ; i >= 0; i--) {
            if (resp[i].rank === this.user.rank ) {
                resp[i].complete = this.user.points;
                break;
            }
            resp[i].complete = 100;
          }
          return resp;
        })
      );
  }
  getUser() {
    const url = environment.apiRoot + 'usuario/user/' + this.user.id;
    return this.http.get(url)
      .pipe(
        map((resp: any) => {
        this.user = resp.user;
        localStorage.setItem('user', JSON.stringify(resp.user));
        return true;
      }), catchError(err => {
        return throwError(err);
      })
    );
  }
  createUser(user: User) {
    const url = environment.apiRoot + 'usuario';
    return this.http.post(url, user)
    .pipe(
      map((resp: any) => {
        console.log('createUserresp ', resp);
        swal('Usuario creado', user.email, 'success');
        return resp;
      }), catchError(err => {
        swal('error en el registro', err.error.message, 'error');
        Swal.close();
        return throwError(err);
      })
    );
  }
  private cargarStorage() {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.user = JSON.parse( localStorage.getItem('user'));
      this.IdToken = localStorage.getItem('IdToken');
    } else {
      this.token = '';
      this.user = null;
      this.IdToken = null;
    }
  }
  estaLogueado() {
    return (this.token.length > 5) ? true : false;
  }
  guardarStorage(token: string, user: User) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.token = token;
    this.user = user;
  }
  login(user: User, remenber: boolean = false) {
    if (remenber) { localStorage.setItem('email', user.email); } else { localStorage.removeItem('email'); }
    const url = environment.apiRoot + 'login';
    return this.http.post(url, user)
      .pipe(
        map((resp: any) => {
          resp.user.id = resp.id;
          this.guardarStorage(resp.customToken, resp.user);
        }), catchError(err => {
          swal('error en el login', err.error.message, 'error');
          Swal.close();
          return throwError(err);
        })
      );
  }
  public _firebaseAuth() {
    return new Promise<boolean> ( (resolve, reject) => {
      this.afAuth.auth.signInWithCustomToken(this.token).then(_user => {
        return this.afAuth.auth.currentUser.getIdToken().then(idToken => {
          return idToken;
        });
      }).then((idToken) => {
          this.IdToken = idToken;
          localStorage.setItem('IdToken', this.IdToken);
          resolve(true);
        }).catch(err => {
          const errorMessage = err.message;
          swal('error en el login con firebase', errorMessage, 'error');
          Swal.close();
          reject(err);
        });
    });
  }
  updateUser(user: User) {
    let url = environment.apiRoot + 'usuario/' + user.id;
    url += '?IdToken=' + this.IdToken;
    return this.http.put(url, user)
      .pipe(
        map((resp: any) => {
          this.guardarStorage(this.token, resp.data);
          // swal('Usuario Actuzalindo', user.email, 'success');
          return true;
        }), catchError(err => {
          swal('error en la actualización', err.error.message, 'error');
          Swal.close();
          return throwError(err);
        })
      );
  }
  logout() {
    this.token = '';
    this.user = null;
    this.IdToken = null;
    localStorage.removeItem('token');
    localStorage.removeItem('IdToken');
    localStorage.removeItem('user');
    this.afAuth.auth.signOut();
    this.router.navigate(['/login']);
  }
}
