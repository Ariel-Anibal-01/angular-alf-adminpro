import  Swal  from 'sweetalert2';
import { FileUploadService } from './../../services/file-upload.service';
import { Usuario } from './../../models/usuario.model';
import { UsuarioService } from './../../services/usuario.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ]
})
export class PerfilComponent implements OnInit {

  public perfilForm: FormGroup;
  public usuario: Usuario;
  public imagenSubir: File;
  public imgTemp: any = '';
  public userLocal;
  public userRole: string;
  public nombre: string;
  public DNI: string;
  public email: String;
  public telefono: string;
  public password: string;
  public category: string;
  public domicilio: string;

  constructor( private fb:FormBuilder,
               private usuarioService:UsuarioService,
               private fileUploadService:FileUploadService) {

                this.usuario = JSON.parse(localStorage.getItem('session')).usuarioDB;
                }

  ngOnInit(): void {
    this.userLocal = JSON.parse(localStorage.getItem('session'));
  this.userRole = this.userLocal.usuarioDB.role;
  this.nombre = this.userLocal.usuarioDB.name;
  this.email = this.userLocal.usuarioDB.email;
  this.category =  this.userLocal.usuarioDB.role;
  this.telefono = this.userLocal.usuarioDB.phone;
  this.DNI = this.userLocal.usuarioDB.dni;
  console.log(this.userLocal);
  console.log(this.userRole);
  console.log(this.nombre);
  console.log(this.email);
    this.perfilForm = this.fb.group({
      nombre: [ this.usuario.name, Validators.required],
      email: [ this.usuario.email , [ Validators.required, Validators.email]],
      category: [ this.usuario.role , [ Validators.required, Validators.email]],
      telefono: [ this.usuario.phone , [ Validators.required, Validators.email]],
      DNI: [ this.usuario.dni , [ Validators.required, Validators.email]]
    });

  }


  actualizarPerfil() {
    console.log(this.perfilForm.value);
    this.usuarioService.actualizarPerfil( this.perfilForm.value)
    .subscribe( resp => {
      const { nombre, email } = this.perfilForm.value;
      this.usuario.name = nombre;
      this.usuario.email = email;

      Swal.fire('Guardado', 'Cambios fueron guardados', 'success');
    }, (err) => {
        Swal.fire('Error', err.error.msg, 'error')
    });

  }

  cambiarImagen( event ) {
    const  file : File = event.target.files[0];
    this.imagenSubir = event.target.files[0];

    if(!file) {
      return this.imgTemp = null;
    }

    const reader = new FileReader();

    reader.readAsDataURL( file );

    reader.onloadend = () =>{
      this.imgTemp = reader.result;
      console.log(reader.result)
    }
  }

  subirImagen() {
    this.fileUploadService
       .actualizarFoto( this.imagenSubir, 'usuarios' , this.usuario._id)
       .then( img =>  {

         this.usuario.img = img

         Swal.fire('Guardado', 'Imagen actualizada', 'success');
       })
       .catch((err) => {
        console.log(err);
        Swal.fire('Error','No se pudo subir la imagen', 'error')
       })
  }

}
