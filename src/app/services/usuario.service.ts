import { Usuario } from './../models/usuario.model';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { catchError, delay, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { CargarUsuario } from '../interfaces/cargar-usuarios.interface';

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
    return this.usuario._id || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
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

    return this.http.post(`${ base_url}/users`, formData)
            .pipe(
              tap( (resp: any) => {
                localStorage.setItem('token', resp.token)
              })
            )

  }
  crearUser(usuario: Usuario) {
    console.log(usuario);
    const url = `${base_url}/users`;

    return this.http.post(url, usuario, this.headers);
  }

  actualizarPerfil( data: { email:string, nombre:string, role: string}) {

    data = {
      ...data,
      role: this.usuario.role
    };

   return this.http.put(`${ base_url }/users/${this.uid}`, data, this.headers);
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

  cargarUsuarios( desde: number = 0){

    const url = `${ base_url}/users?desde=${ desde }`;

    return this.http.get<CargarUsuario>( url,  this.headers )
            .pipe(
              delay(1000),
              map( resp => {

                const usuarios = resp.usuarios.map(
                  user => new Usuario(user.name,user.password,user.dni,user.role,user.email,user.phone,user.home,user.img , user._id)
                  );
                return {
                  total: resp.total,
                  usuarios
                };
              })
            );
  }

  eliminarUsuario( usuario: Usuario) {

    const url = `${ base_url }/users/${ usuario._id }`;
    return this.http.delete( url , this.headers);

  }

  guardarUsuario( usuario: Usuario) {

    /* data = {
      ...data,
      role: this.usuario.role
    }; */

   return this.http.put(`${ base_url }/users/${usuario._id}`, usuario, this.headers);
  }


}
