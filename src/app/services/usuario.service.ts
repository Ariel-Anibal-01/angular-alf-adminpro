import { Usuario } from './../models/usuario.model';
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
  public usuario?:Usuario;

  constructor( private http: HttpClient,
             private router:Router,
             private ngZone: NgZone) {

              }


  logout() {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/login');

    google.accounts.id.revoke( this.usuario?.email, () => {
      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');

      })
    });
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get uid():string {
    return this.usuario.uid || '';
  }

  validarToken(): Observable<boolean> {
    

    return this.http.get(`${ base_url}/login/renew`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map((resp:any) => {
       
        const { 
          email, google,nombre, role, img='', uid
        } = resp.usuario;

        this.usuario = new Usuario(nombre, email, '', img,role, google,uid);
        localStorage.setItem('token', resp.token);

        console.log(this.usuario);
        return true;
      }),
   
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

  actualizarPerfil( data: { email:string, nombre:string, role: string}) {

    data = {
      ...data,
      role: this.usuario.role
    };

   return this.http.put(`${ base_url }/usuarios/${this.uid}`, data,{
      headers: {
        'x-token': this.token
      }
    })
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
