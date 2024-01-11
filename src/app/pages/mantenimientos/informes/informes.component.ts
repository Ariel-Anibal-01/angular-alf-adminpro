import { Informe } from './../../../models/imforme.model';
import { InformeService } from './../../../services/informe.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { Usuario } from 'src/app/models/usuario.model';
import { formatDate } from '@angular/common';



@Component({
  selector: 'app-informes',
  templateUrl: './informes.component.html',
  styleUrls: ['./informes.component.css']
})
export class InformesComponent implements OnInit {

  public formData: FormData = new FormData();
  public informeForm: FormGroup;
  public cargando: boolean= true;
  public editar: boolean= false;
  public idEditarReports: string;
  public informes: Informe[] = [];
  public informesTemp: Informe[] = [];
  public linksEdid: string[];
  modalVisible = false;
  modalVisibleEditar = false;
  public urlFiles: string;
  public title: string;
  public date: Date;
  public date1: string;
  public description: string;
  public category: string;
  public selectedFileInforme: File[] = [];
  public totalInformes: number = 0;


  public desde: number = 0;

  constructor(private fb:FormBuilder,private informeService: InformeService,private busquedasService: BusquedasService, private router: Router) {
    this.informeForm = this.fb.group({
      title: ['',  Validators.required],
      date: [ '', Validators.required],
      category: [ '', Validators.required],
      description: [ '',  Validators.required],
      myFile: [ '']
    });
   }



  openModal() {
    this.modalVisible = true;
  }

  closeModal() {
    this.limpiarCampos();
    this.modalVisible = false;


  }
  ngOnInit(): void {
    this.urlFiles =   environment.base_url_image;
    this.cargarInformes();
    this.closeModal();

  }
  closeModalEditar() {
    this.limpiarCampos();
    this.modalVisibleEditar = false;


  }
  formatDate(date: string): string {
    return formatDate(date, 'yyyy-MM-dd', 'en-US');
  }
  openModalEditar(informe: Informe) {
    this.modalVisibleEditar = true;



    this.title = informe.title;
    this.category = informe.category;

    const fechaFormateada = formatDate(informe.date, 'dd/MM/yyyy', 'en-US');
this.date1 = fechaFormateada;
this.date = informe.date;

    this.description = informe.description;
   this.linksEdid = informe.links;
   this.idEditarReports = informe._id;

    console.log(this.title);
    console.log(this.category);
    console.log(this.description);
    console.log(this.date1);
  }

  openExternalUrl(category?: string, informe?:string) {
    const url =  this.urlFiles +'/' +category+ '/' + informe;
    window.open(url, '_blank');
  }
  openExternalResolutionUrl(resolution:string) {
    const url =  this.urlFiles +'/resoluciones/' + resolution;
    window.open(url, '_blank');
  }

  cambiarPagina(valor: number) {
    this.desde += valor;

    if (this.desde < 0) {
      this.desde = 0;
    } else if (this.desde >= this.totalInformes) {
      this.desde -= valor;
    }

    this.cargarInformes();
  }

  cargarInformes() {
    this.cargando = true;
    this.informeService.cargarInformes(this.desde).subscribe(
      ({ total, reports }) => {
         this.cargando = false;
         this.informes = reports;
         this.informesTemp = reports;
         this.totalInformes = total;
      }
    )
  }

  buscar(termino: string) {
    if (termino.length === 0) {
      this.informes = this.informesTemp;
      return;
    }

    this.busquedasService.buscar('reports', termino).subscribe((resp : Informe[]) => {
      this.informes = resp;
    });
  }



  onFileSelectedInforme(event: any) {

    const files: File[] = Array.from(event.target.files);
    // this.selectedFileInforme = event.target.files;
    files.forEach((file: File) => {
      console.log(file);
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedFileInforme.push(file);
        console.log(this.selectedFileInforme);
      };
      reader.readAsDataURL(file);
    });
    console.log(this.selectedFileInforme);

  }



  crearReports() {


    if (this.informeForm.invalid) {
      this.informeForm.markAllAsTouched();
      return;
    }

    this.formData.append('title', this.title);
    this.formData.append('category', this.category);
    this.formData.append('date', this.date.toString());
    this.formData.append('description', this.description);


    // Agregar las imágenes seleccionadas al FormData
    for (let i = 0; i < this.selectedFileInforme.length; i++) {
      this.formData.append('myFile', this.selectedFileInforme[i]);
    }
  //  this.formData.append('myFile', this.imagePortada);
    console.log(this.title);
    console.log(this.category);
    console.log(this.description);
    console.log(this.selectedFileInforme);

    this.informeService.crearInforme(this.formData)
    .subscribe( resp => {
      console.log(resp);
       this.cargarInformes();
       this.closeModal();

       this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['./dashboard/informes']);
      });


       Swal.fire('Informe creado',  this.title, 'success').then(() => {
        this.router.navigate(['./dashboard/informes']);
      });


    })

  }

  editarReports() {


    if (this.informeForm.invalid) {
      this.informeForm.markAllAsTouched();
      return;
    }


    this.formData.append('title', this.title);
    this.formData.append('category', this.category);
    this.formData.append('date', this.date.toString());
    this.formData.append('description', this.description);
    for (let i = 0; i < this.linksEdid.length; i++) {
      this.formData.append('links', this.linksEdid[i]);
    }


    // Agregar las imágenes seleccionadas al FormData
    for (let i = 0; i < this.selectedFileInforme.length; i++) {
      this.formData.append('myFile', this.selectedFileInforme[i]);
    }


    this.informeService.editarInforme(this.formData, this.idEditarReports)
    .subscribe( resp => {
      console.log(resp);
       this.cargarInformes();
       this.closeModalEditar();

       this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['./dashboard/informes']);
      });


       Swal.fire('Informe editado',  this.title, 'success').then(() => {
        this.router.navigate(['./dashboard/informes']);
      });


    })

  }

  limpiarCampos() {
    this.description = '';
    this.idEditarReports = '';
    this.title= '';
    this.category = '';
    this.date = null;
     // Limpiar imágenes seleccionadas
  const inputElement: HTMLInputElement = document.getElementById('myFileInput') as HTMLInputElement;
  inputElement.value = '';
  }

  clickEliminarModal(informe: Informe){
    var nombre  = informe.title;
   console.log(informe._id);
   Swal.fire({
     title: "Quiere borrar este Informe?",
     text: `Esta a punto de borrar a ${ informe.title}`,
     icon: "warning",
     showCancelButton: true,
     confirmButtonColor: "#3085d6",
     cancelButtonColor: "#d33",
     confirmButtonText: "Si, eliminar!"
   }).then((result) => {
     if (result.value) {
       this.informeService.eliminarInforme(informe._id)
     .subscribe( resp => {
       console.log(resp);

       this.cargarInformes();

       Swal.fire('Informe borrado',  `${ nombre} fue eliminado correctamente`, 'success');
     })

     }
   });
  }


}


