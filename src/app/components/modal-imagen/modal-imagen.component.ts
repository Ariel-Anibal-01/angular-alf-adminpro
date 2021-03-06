import  Swal  from 'sweetalert2';
import { FileUploadService } from './../../services/file-upload.service';
import { ModalImagenService } from './../../services/modal-imagen.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: [
  ]
})
export class ModalImagenComponent implements OnInit {

  public imagenSubir: File;
  public imgTemp: any = '';

  constructor(public modalImagenService: ModalImagenService,
              public fileUploadService : FileUploadService) { }

  ngOnInit(): void {
  }

  cerrarModal() {
    this.imgTemp = null;
     this.modalImagenService.cerrarModal();
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

    const id = this.modalImagenService.id;
    const tipo = this.modalImagenService.tipo;

    this.fileUploadService
       .actualizarFoto( this.imagenSubir, tipo , id)
       .then( img =>  {
         
         Swal.fire('Guardado', 'Imagen actualizada', 'success');

         this.modalImagenService.nuevaImagen.emit(img);
         this.cerrarModal();
       })
       .catch((err) => {
        console.log(err);
        Swal.fire('Error','No se pudo subir la imagen', 'error')  
       })
  }

}
