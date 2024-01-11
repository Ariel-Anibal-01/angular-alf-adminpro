import { environment } from "src/environments/environment";

const base_url = environment.base_url;

export class Publicacion {

    constructor(

       public title:string,
       public category:string,
       public bodies: string,
       public caption?:string,
       public date?:string,
       public slug?:string,
       public images?:string[],
       public frontPage?:string,
       public _id?: string,
    ){
    }


}
