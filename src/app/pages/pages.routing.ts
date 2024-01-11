import { UsuariosComponent } from './mantenimientos/usuarios/usuarios.component';
import { PerfilComponent } from './perfil/perfil.component';
import { AuthGuard } from './../guards/auth.guard';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PublicacionesComponent } from './mantenimientos/publicaciones/publicaciones.component';
import { InformesComponent } from './mantenimientos/informes/informes.component';
import { RecomendacionesComponent } from './mantenimientos/recomendaciones/recomendaciones.component';
import { NormativasComponent } from './mantenimientos/normativas/normativas.component';
import { CrearPublicacionComponent } from './mantenimientos/crear-publicacion/crear-publicacion.component';
import { EditarPublicacionComponent } from './mantenimientos/editar-publicacion/editar-publicacion.component';

const routes: Routes = [
    { path: 'dashboard',
    component: PagesComponent,

    children: [
      { path: '', component: AccountSettingsComponent, data: { titulo: 'Dashboard'}},

      { path: 'perfil', component: PerfilComponent,  data: { titulo: 'Perfil de usuario'}},

      // Mantenimientos
      { path: 'usuarios', component: UsuariosComponent,  data: { titulo: 'Usuario de aplicación'}},
      { path: 'publicaciones', component: PublicacionesComponent,  data: { titulo: 'Publicación de aplicación'}},
      { path: 'informes', component: InformesComponent,  data: { titulo: 'Informes de aplicación'}},
      { path: 'recomendaciones', component: RecomendacionesComponent,  data: { titulo: 'Recomendaciones de aplicación'}},
      { path: 'normativas', component: NormativasComponent,  data: { titulo: 'Normativas de aplicación'}},
      { path: 'crearPublicacion', component: CrearPublicacionComponent,  data: { titulo: 'Crear publicación'}},
      { path: 'editarPublicacion/:publication', component: EditarPublicacionComponent,  data: { titulo: 'Editar publicación'}},
     // { path: '', redirectTo: '/dashboard', pathMatch: 'full'},
    ],
  },
];

@NgModule({
    imports: [ RouterModule.forChild(routes)],
    exports: [ RouterModule]

})
export class PagesRoutingModule {}
