import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


import { HeaderComponent } from '../shared/header/header.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { PagesComponent } from './pages.component';
import { SharedModule } from '../shared/shared.module';
import { AppRoutingModule } from '../app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '../components/components.module';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PerfilComponent } from './perfil/perfil.component';
import { UsuariosComponent } from './mantenimientos/usuarios/usuarios.component';
import { PublicacionesComponent } from './mantenimientos/publicaciones/publicaciones.component';
import { PipesModule } from '../pipes/pipes.module';
import { InformesComponent } from './mantenimientos/informes/informes.component';
import { RecomendacionesComponent } from './mantenimientos/recomendaciones/recomendaciones.component';
import { NormativasComponent } from './mantenimientos/normativas/normativas.component';
import { CrearPublicacionComponent } from './mantenimientos/crear-publicacion/crear-publicacion.component';
import { QuillModule } from 'ngx-quill';
import { EditarPublicacionComponent } from './mantenimientos/editar-publicacion/editar-publicacion.component';


@NgModule({
  declarations: [

    DashboardComponent,
    Grafica1Component,
    PagesComponent,
    AccountSettingsComponent,
    PerfilComponent,
    UsuariosComponent,
    PublicacionesComponent,
    InformesComponent,
    RecomendacionesComponent,
    NormativasComponent,
    CrearPublicacionComponent,
    EditarPublicacionComponent,

  ],
  exports: [
    DashboardComponent,
    Grafica1Component,
    PagesComponent,
    AccountSettingsComponent,

  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
    ComponentsModule,
    PipesModule,
    QuillModule.forRoot()
  ]

})
export class PagesModule { }
