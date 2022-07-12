import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

const base_url = environment.base_url;
declare const google :any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor( private http: HttpClient,
             private router:Router,
             private ngZone: NgZone) {

              }


  logout() {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/login');

    google.accounts.id.revoke( 'ariel02041993@gmail.com', () => {
      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');

      })
    });
  }

  validarToken(): Observable<boolean> {
    const token = localStorage.getItem('token') || '';

    return this.http.get(`${ base_url}/login/renew`, {
      headers: {
        'x-token': token
      }
    }).pipe(
      tap((resp:any) => {
        localStorage.setItem('token', resp.token);
      }),
      map( resp => true),
      catchError( error => of(false))
    );
  }
  
  crearUsuario( formData: RegisterForm){
    
    return this.http.post(`${ base_url}/usuarios`, formData)
            .pipe(
              tap( (resp: any) => {
                localStorage.setItem('token', resp.token)
              })
            )

  }

  login( formData: LoginForm) {
    return this.http.post(`${ base_url}/login`, formData)
          .pipe(
            tap( (resp: any) => {
              localStorage.setItem('token', resp.token)
            })
          )
  }

  loginGoogle( token: string) {
    return this.http.post(`${base_url}/login/google`, { token })
           .pipe(
             tap( (resp:any) => {
              console.log(resp)
              localStorage.setItem('token', resp.token);
             })
           )
  }



}
