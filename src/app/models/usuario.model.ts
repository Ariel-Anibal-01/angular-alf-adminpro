import { environment } from "src/environments/environment";

const base_url = environment.base_url;

export class Usuario {

    constructor(
       public name:string,
       public password:string,
       public dni:string,
       public role: string,
       public email:string,
       public phone?:string,
       public home?:string,
       public img?:string,
       public _id?: string,
    ){
    }

    get imagenUrl() {

        if( !this.img ){
            return `${ base_url}/upload/usuarios/no-image`;
        } else if ( this.img?.includes('https')) {
            return this.img;

        } else if( this.img) {
            return `${ base_url}/upload/usuarios/${ this.img}`;
        } else{
            return `${ base_url }/upload/usuarios/no-image`;
          //  localhost:3005/api/upload/usuarios/no-image

        }
    }
}
