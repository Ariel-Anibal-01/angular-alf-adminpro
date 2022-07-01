import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../services/settings.service';

// llama una funcion que esta de manera global/ se encuentra en el archivo custom.js en assets/js/custom.js
declare function customInitFunctions(): any; 

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: [
  ]
})
export class PagesComponent implements OnInit {
  
  
  constructor(private settingsService:SettingsService) { }

  ngOnInit(): void {

    // antes de cargar la pagina recargamos todos los plugins necesarios
    // para que se vea bien la pagina  
    customInitFunctions(); 
   
 
  
  }

}
