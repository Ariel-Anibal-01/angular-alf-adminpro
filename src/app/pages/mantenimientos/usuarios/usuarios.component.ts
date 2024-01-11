import { delay } from 'rxjs/operators';
import { ModalImagenService } from './../../../services/modal-imagen.service';
import Swal from 'sweetalert2';
import { BusquedasService } from './../../../services/busquedas.service';
import { CargarUsuario } from './../../../interfaces/cargar-usuarios.interface';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Usuario } from './../../../models/usuario.model';
import { UsuarioService } from './../../../services/usuario.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']

})
export class UsuariosComponent implements OnInit, OnDestroy {

  public formData: FormData = new FormData();
  public usuarioForm: FormGroup;

  public totalUsuarios: number = 0;
  public usuarios: Usuario[] = [];
  public user: Usuario ;
  public usuariosTemp: Usuario[] = [];

  public imgSubs: Subscription;
  public desde: number = 0;
  public cargando: boolean = true;

  public nombre: string;
  public DNI: string;
  public email: String;
  public telefono: string;
  public password: string;
  public category: string;
  public domicilio: string;
  public userLocal = JSON.parse(localStorage.getItem('session'));
  public userRole = this.userLocal.usuarioDB.role;



  modalVisible = false;



  constructor(
    private usuarioService: UsuarioService,
    private busquedasService: BusquedasService,
    private modalImagenService: ModalImagenService,
    private fb:FormBuilder,
    private router: Router
  ) {
    this.usuarioForm = this.fb.group({
      nombre: ['',  Validators.required],
      DNI: [ '', Validators.required],
      email: [ '', [Validators.email, Validators.required]],
      password: [ '',  Validators.required],
      category: [ '',  Validators.required],
      telefono: [ ''],
      domicilio:['']

    });
  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();

  }

  ngOnInit(): void {
    this.cargarUsuarios();

    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(delay(100))
      .subscribe((img) => this.cargarUsuarios());
      this.closeModal();
  }

  openModal() {
    this.modalVisible = true;

  }

  closeModal() {
    this.limpiarCampos();
    this.modalVisible = false;
  }

  limpiarCampos() {
    this.nombre= '';
    this.DNI= '';
    this.domicilio = '';
    this.email = '';
    this.telefono= '';
    this.password= '';

  }

  cargarUsuarios() {
    this.cargando = true;
    this.usuarioService
      .cargarUsuarios(this.desde)
      .subscribe(({ total, usuarios }) => {
        this.totalUsuarios = total;
        this.usuarios = usuarios;
        this.usuariosTemp = usuarios;
        this.cargando = false;
      });
  }

  cambiarPagina(valor: number) {
    this.desde += valor;

    if (this.desde < 0) {
      this.desde = 0;
    } else if (this.desde >= this.totalUsuarios) {
      this.desde -= valor;
    }

    this.cargarUsuarios();
  }

  buscar(termino: string) {
    if (termino.length === 0) {
      this.usuarios = this.usuariosTemp;
      return;
    }

    this.busquedasService.buscar('usuarios', termino).subscribe((resp:Usuario[]) => {
      this.usuarios = resp;
    });
  }

  eliminarUsuario(usuario: Usuario) {
    console.log(usuario._id);
    const user = JSON.parse(localStorage.getItem('session')).usuarioDB;
    console.log(user._id);

    if (usuario._id === user._id) {
      Swal.fire('Error', 'No puede borrarse a si mismo', 'error');
      return;
    }

    Swal.fire({
      title: '¿Borrar usuario?',
      text: `Esta a punto de borrar a ${usuario.name}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo',
    }).then((result) => {
      if (result.value) {
        this.usuarioService.eliminarUsuario(usuario).subscribe((resp) => {
          this.cargarUsuarios();
          Swal.fire(
            'Usuario borrado',
            `${usuario.name} fue eliminado correctamente`,
            'success'
          );
        });
      }
    });
  }

  crearUsuario() {
    if (this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();
      return;
    }

    console.log(this.nombre);
    console.log(this.password);
    console.log(this.DNI);
    console.log(this.telefono);
    console.log(this.domicilio);
    this.formData.append('name', this.nombre);
    this.formData.append('password', this.password);
    this.formData.append('dni', this.DNI);
    this.formData.append('email', this.email.toString());
    this.formData.append('phone', this.telefono);
    this.formData.append('home', this.domicilio);
     this.user = new Usuario(this.nombre,this.password,this.DNI,this.category,this.email.toString(),this.telefono,this.domicilio,'');


    this.usuarioService.crearUser(this.user)
    .subscribe( resp => {
      console.log(resp);
       this.cargarUsuarios;
       this.closeModal();

       this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['./dashboard/usuarios']);
      });


       Swal.fire('Usuario creado',  this.nombre, 'success').then(() => {
        this.router.navigate(['./dashboard/usuarios']);
      });


    })


  }



  cambiarRole(usuario: Usuario) {
    this.usuarioService.guardarUsuario(usuario).subscribe((resp) => {
      console.log(resp);
    });
  }

  abrirModal(usuario: Usuario) {
    console.log(usuario);
    this.modalImagenService.abrirModal('usuarios', usuario._id, usuario.img);
  }
}
