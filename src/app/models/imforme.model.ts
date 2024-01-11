import { environment } from "src/environments/environment";

const base_url = environment.base_url;

export class Informe {

    constructor(

       public title:string,
       public category:string,
       public description: string,
       public date?:Date,
       public links?:string[],
       public _id?: string,
    ){
    }


}
