import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { LoginComponent } from './pages/login/login';
import { RegistroComponent } from './pages/registro/registro';
import { QuienSoyComponent } from './pages/quien-soy/quien-soy';
import { AhorcadoComponent } from './components/ahorcado/ahorcado.component';
import { MayorMenorComponent } from './components/mayor-menor/mayor-menor.component';
import { PreguntadosComponent } from './components/preguntados/preguntados';
import { ChatComponent } from './components/chat/chat.component';
import { authGuard } from './guards/auth-guard';
import { ResultadosComponent } from './pages/resultados/resultados';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'quien-soy', component: QuienSoyComponent },
  
  // Rutas del Sprint 3 protegidas por seguridad
  { path: 'components/ahorcado', component: AhorcadoComponent, canActivate: [authGuard] },
  { path: 'components/mayor-menor', component: MayorMenorComponent, canActivate: [authGuard] },
  { path: 'components/preguntados', component: PreguntadosComponent, canActivate: [authGuard] },
  {path: 'components/juego-propio', loadComponent: () => import('./components/juego-propio/juego-propio').then(m => m.JuegoPropioComponent), canActivate: [authGuard] },
  { path: 'resultados', component: ResultadosComponent, canActivate: [authGuard] },
  { path: 'components/chat', component: ChatComponent, canActivate: [authGuard] },
  
  { path: '**', redirectTo: '/home' }
];