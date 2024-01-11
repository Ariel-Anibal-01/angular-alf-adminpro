import { Publicacion } from 'src/app/models/publicacion.model';
import { PublicacionService } from './../../../services/publicacion.service';
import { Component, OnInit } from '@angular/core';

import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-crear-publicacion',
  templateUrl: './crear-publicacion.component.html',
  styleUrls: ['./crear-publicacion.component.css']
})
export class CrearPublicacionComponent implements OnInit {
  public publicacionForm: FormGroup;
  public imagenSubir: File;
  public title: string = "";
  public caption: string;
  public category: string;
  public date: Date;
  public bodies: string;
  public selectedImages: File[] = [];
  public selectedImages2: File[] = [];
  public formDataImage2 : File[] = [];
  public imagePortada : File;
  public imagePortada2 : File[]=[] ;
  public formData: FormData = new FormData();
  public slug: string;
  public publicaciones: Publicacion[] = [];
  public cargando: boolean= true;
  public urlPhotos: string;
  public alreadyExistSlug: string;
  modalVisible = false;

  constructor( private fb:FormBuilder,private publicacionService: PublicacionService, private router: Router) {
    this.publicacionForm = this.fb.group({
      title: [null,  Validators.required],
      caption: [ '', Validators.required],
      category: [ '', Validators.required],
      date: [ '', Validators.required],
      slug: [ '',  [Validators.required, Validators.pattern(/^[a-z0-9\-]+$/)]],
      bodies: [ '',  Validators.required],
      myFile: [ '']
    });
  }



  openModal() {
    this.modalVisible = true;
  }


  closeModal() {
    this.router.navigate(['./dashboard/publicaciones']);
  }


  onFileSelectedFront(event: any) {
    const file: File = event.target.files[0];
    this.imagePortada = file;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagePortada2.push(e.target.result);
      this.imagePortada = file;
    };
    reader.readAsDataURL(file);
    console.log(this.imagePortada);
    console.log(this.imagePortada2);
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
        console.log(this.selectedImages2);
      };
      reader.readAsDataURL(file);
    });
  }


  ngOnInit(): void {
    this.urlPhotos =   environment.base_url_image;

  }





  crearPublicacion() {
    // Agregar los otros campos de tu formulario al FormData
    if (this.publicacionForm.invalid) {
      this.publicacionForm.markAllAsTouched();
      return;
    }

    this.formData.append('title', this.title);
    this.formData.append('category', this.category);
    this.formData.append('date', this.date.toString());
    this.formData.append('caption', this.caption);
    this.formData.append('slug', this.slug);
    this.formData.append('bodies', this.bodies);

    this.imagePortada;
    // Agregar las imágenes seleccionadas al FormData
    for (let i = 0; i < this.selectedImages2.length; i++) {
      this.formData.append('myFile', this.selectedImages2[i]);
    }
    this.formData.append('myFile', this.imagePortada);
  //  this.formData.append('myFile', this.imagePortada);
    console.log(this.title);
    console.log(this.caption);
    console.log(this.bodies);
    console.log(this.selectedImages2);

    this.publicacionService.crearPublicacion(this.formData)
    .subscribe( resp => {


      Swal.fire('Publicación creada', this.title, 'success').then(() => {
        this.router.navigate(['./dashboard/publicaciones']);
      });
    })


  }


  public  verificarSlugPublication(slug: string) {
    if(this.publicacionForm.controls['slug'].valid) {
      this.publicacionService.verificarSlug(slug).subscribe((resp: string) => {
        if (resp) {
          console.log(resp);
          this.alreadyExistSlug = resp;
          console.log("valor de slug "+this.alreadyExistSlug);
          if(this.alreadyExistSlug == "Si existe") {
            this.publicacionForm.controls['slug'].setErrors({slugIsInvalid : true});
          }
        }
      });
    }
  }



  redirectToCrearPublicacion() {
    this.router.navigate(['./dashboard/crearPublicacion']);
  }

}
