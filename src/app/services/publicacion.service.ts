import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Publicacion } from '../models/publicacion.model';
const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class PublicacionService {
  public publicacion?: Publicacion;

  constructor(private http: HttpClient) {}

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    };
  }

  cargarPublicaciones( desde: number = 0) {

    const url = `${ base_url}/publication?desde=${ desde }`;

    return this.http
      .get(url, this.headers)
      .pipe(
        map((resp: { publication: Publicacion[], total: number }) => {
          // Obtén los campos "publicaciones" y "total" de la respuesta
          const { publication, total } = resp;

          // Crea un objeto con los dos campos y devuélvelo
          return { publication, total };
        })



        );



  }

  verificarSlug(slug: string) {
    console.log(slug);
    const url = `${base_url}/publication/verificar-slug/${slug}`;

    return this.http
      .get(url, this.headers)
      .pipe(map((resp: { unique: string }) => resp.unique));
  }

  crearPublicacion(publicacion: FormData) {
    const url = `${base_url}/publication`;

    return this.http.post(url, publicacion, this.headers);
  }

  editarPublicacion(_id: string, publicacion: FormData) {
    const url = `${base_url}/publication/${_id}`;

    return this.http.put(url, publicacion, this.headers);
  }
  obtenerPublicacion(_id: string) {
    const url = `${base_url}/publication/${_id}`;

    return this.http.get(url, this.headers);
  }

  eliminarPublicacion(_id: string) {
    const url = `${base_url}/publication/${_id}`;

    return this.http.delete(url, this.headers);
  }
}
