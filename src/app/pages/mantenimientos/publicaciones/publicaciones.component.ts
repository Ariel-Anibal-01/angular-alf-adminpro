import { Publicacion } from 'src/app/models/publicacion.model';
import { PublicacionService } from './../../../services/publicacion.service';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { BusquedasService } from 'src/app/services/busquedas.service';



@Component({
  selector: 'app-publicaciones',
  templateUrl: './publicaciones.component.html',
  styles: [
  ]
})
export class PublicacionesComponent implements OnInit {
  public imagenSubir: File;
  public name: string;
  public qualification: string;
  public caption: string;
  public bodies: string;
  public selectedImages: File[] = [];
  public selectedImages2: File[] = [];
  public formDataImage2 : File[] = [];
  public formData: FormData = new FormData();
  public publicaciones: Publicacion[] = [];
  public publicacionesTemp: Publicacion[] = [];
  public cargando: boolean= true;
  public urlPhotos: string;
  modalVisible = false;

  public totalPublicaciones: number = 0;

  public desde: number = 0;


  constructor(private publicacionService: PublicacionService, private busquedasService: BusquedasService, private router: Router) {


   }



  openModal() {
    this.modalVisible = true;
  }

  closeModal() {
    this.modalVisible = false;
  }

  onFileSelected(event: any) {
    const files: File[] = Array.from(event.target.files);
    this.selectedImages2 = event.target.files;
    this.selectedImages = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileObj = new File([file], file.name, { type: file.type });
      this.formDataImage2.push( fileObj);
    }

    // Leer y convertir las imágenes a formato base64
    files.forEach((file: File) => {
      console.log(file);
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImages.push(e.target.result);
        this.selectedImages2.push(file);
      };
      reader.readAsDataURL(file);
    });
  }


  ngOnInit(): void {
    this.urlPhotos =   environment.base_url_image;
    this.cargarPublicaciones();
    this.closeModal();

  }

  cambiarPagina(valor: number) {
    this.desde += valor;

    if (this.desde < 0) {
      this.desde = 0;
    } else if (this.desde >= this.totalPublicaciones) {
      this.desde -= valor;
    }

    this.cargarPublicaciones();
  }

  cargarPublicaciones() {
    this.cargando = true;
    this.publicacionService.cargarPublicaciones(this.desde).subscribe(
      ({ total, publication }) => {
         this.cargando = false;
         this.publicaciones = publication;
         this.publicacionesTemp = publication;
         this.totalPublicaciones = total;
      }
    )
  }

  buscar(termino: string) {
    if (termino.length === 0) {
      this.publicaciones = this.publicacionesTemp;
      return;
    }

    this.busquedasService.buscar('publication', termino).subscribe((resp : Publicacion[]) => {
      this.publicaciones = resp;
    });
  }


  guardarCambios(publicacion: Publicacion, id: string) {
    this.publicacionService.editarPublicacion(id, this.formData)
    .subscribe( resp => {
      Swal.fire('Actualizado', publicacion.title, 'success');
    })
  }



 clickEliminarModal(publicacion: Publicacion){

   var nombre  = publicacion.title;
  console.log(publicacion._id);
  Swal.fire({
    title: "Quiere borrar esta Publicación?",
    text: `Esta a punto de borrar a ${ publicacion.title}`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, eliminar!"
  }).then((result) => {
    if (result.value) {
      this.publicacionService.eliminarPublicacion(publicacion._id)
    .subscribe( resp => {
      console.log(resp);
      this.cargarPublicaciones();

      Swal.fire('Publicación borrada',  `${ nombre} fue eliminado correctamente`, 'success');
    })

    }
  });
 }




  eliminarPublicacion(publicacion: Publicacion) {
    this.publicacionService.eliminarPublicacion(publicacion._id)
    .subscribe( resp => {
      this.cargarPublicaciones();

      Swal.fire('Borrado', publicacion.title, 'success');
    })
  }

  redirectToCrearPublicacion() {
    this.router.navigate(['./dashboard/crearPublicacion']);
  }

  redirectToEditarPublicacion(publication: string) {
    this.router.navigate(['./dashboard/editarPublicacion', publication]);



  }

}
