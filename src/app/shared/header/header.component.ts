import { Usuario } from './../../models/usuario.model';
import { Router } from '@angular/router';
import { UsuarioService } from './../../services/usuario.service';
import { Component } from '@angular/core';



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent {

  public usuario?:Usuario;

  constructor( private usuarioService:UsuarioService) {
    
    this.usuario = usuarioService.usuario;
  }

    logout() {
      this.usuarioService.logout();
   
    }
   

  

}
