import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { LoginComponent } from './pages/login/login';
import { RegistroComponent } from './pages/registro/registro';
import { QuienSoyComponent } from './pages/quien-soy/quien-soy';
import { authGuard } from './guards/auth-guard';
import { adminGuard } from './guards/admin.guard'; 

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'quien-soy', component: QuienSoyComponent },
  
  { 
    path: 'components/ahorcado', 
    loadComponent: () => import('./components/ahorcado/ahorcado.component').then(m => m.AhorcadoComponent), 
    canActivate: [authGuard] 
  },
  { 
    path: 'components/mayor-menor', 
    loadComponent: () => import('./components/mayor-menor/mayor-menor.component').then(m => m.MayorMenorComponent), 
    canActivate: [authGuard] 
  },
  { 
    path: 'components/preguntados', 
    loadComponent: () => import('./components/preguntados/preguntados').then(m => m.PreguntadosComponent), 
    canActivate: [authGuard] 
  },
  { 
    path: 'components/juego-propio', 
    loadComponent: () => import('./components/juego-propio/juego-propio').then(m => m.JuegoPropioComponent), 
    canActivate: [authGuard] 
  },
  { 
    path: 'components/chat', 
    loadComponent: () => import('./components/chat/chat.component').then(m => m.ChatComponent), 
    canActivate: [authGuard] 
  },
  { 
    path: 'resultados', 
    loadComponent: () => import('./pages/resultados/resultados').then(m => m.ResultadosComponent), 
    canActivate: [authGuard] 
  },

  {
    path: 'encuesta',
    loadComponent: () => import('./components/encuesta/encuesta.component').then(m => m.EncuestaComponent),
    canActivate: [authGuard]
  },

  {
    path: 'admin/resultados-encuestas',
    loadComponent: () => import('./components/resultados-encuestas/resultados-encuestas.component').then(m => m.ResultadosEncuestasComponent),
    canActivate: [authGuard, adminGuard] 
  },
  
  { path: '**', redirectTo: '/home' }
];