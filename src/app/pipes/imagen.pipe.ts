import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url_image

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transform(img: string, tipo: string): string {


    if( !img  ){

      return `${ base_url}/no-imagen/no-img.png`;
  } else if( img) {

    if(tipo == 'informes'){
      console.log(`${ base_url}/${img}`);
      return `${ base_url}/informes/${img}`;
    } else if(tipo == 'resolucion'){
      return `${ base_url}/resoluciones/${img}`;
    }
    else{
      console.log(`${ base_url}/${tipo}/${img}`);
      return `${ base_url}/${tipo}/${img}`;

    }

  } else{
      return `${ base_url }/no-imagen/no-img.png`;
    //  localhost:3005/api/upload/usuarios/no-image

  }
  }

}
