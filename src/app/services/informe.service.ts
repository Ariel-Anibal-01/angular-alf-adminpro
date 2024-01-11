import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Informe } from '../models/imforme.model';
const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class InformeService {

  constructor(private http:HttpClient) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }


  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  cargarInformes( desde: number = 0){


    const url = `${ base_url}/reports?desde=${ desde }`;

    return this.http.get( url,  this.headers )
               .pipe(


                map( (resp: { reports: Informe[], total: number }) =>{

                  const { reports, total } = resp;

                  // Crea un objeto con los dos campos y devuélvelo
                  return { reports, total };
                } )
               );

  }

  crearInforme( informe: FormData){

    console.log(informe);

    const url = `${ base_url}/reports`;

    return this.http.post( url, informe,  this.headers );

  }

  editarInforme(  informe: FormData, _id:string){

    const url = `${ base_url}/reports/${_id}`;

    return this.http.put( url,informe,  this.headers );

  }

  eliminarInforme(  _id: string){

    const url = `${ base_url}/reports/${_id}`;

    return this.http.delete( url,  this.headers );

  }

}
