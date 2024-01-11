import { Usuario } from './../models/usuario.model';
import { map } from 'rxjs/operators';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Publicacion } from '../models/publicacion.model';
import { Informe } from '../models/imforme.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class BusquedasService {

  constructor( private http:HttpClient) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }
/*
  get uid():string {
    return this.usuario.uid || '';
  } */

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  private transformarUsuarios( resultadosUs: any[]): Usuario[]{
    return resultadosUs.map(
      user => new Usuario(user.name,'', user.dni, user.role, user.email , user.phone,'','', user.uid)

    )
  }
  private transformarPublicaciones( resultadosPu: any[]): Publicacion[]{
    return resultadosPu.map(
      publi => new Publicacion(publi.title,publi.category, publi.bodies, publi.cation, publi.date , publi.slug, publi.images,publi.frontPage, publi._id)

    )
  }
  private transformarInformes( resultadosRe: any[]): Informe[]{
    return resultadosRe.map(
      report => new Informe(report.title,report.category, report.description ,  report.date,report.links, report._id)

    )
  }

  buscar( tipo:'usuarios'|'publication'|'reports',
          termino: string ){

    const url = `${ base_url}/todo/coleccion/${ tipo }/${termino}`;

    return this.http.get<any[]>( url,  this.headers )
             .pipe(
              map( (resp:any) =>
                {
                  console.log(resp.resultados)

                  switch( tipo) {
                    case 'usuarios':
                      return this.transformarUsuarios( resp.resultados);
                    break;
                    case 'publication':
                      return this.transformarPublicaciones( resp.resultados );
                    break;
                    case 'reports':
                      return this.transformarInformes( resp.resultados );
                    break;


                      default:
                        return [];
                  }
                }

                ),

             );

  }

}
