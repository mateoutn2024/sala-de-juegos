import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { LoginComponent } from './pages/login/login';
import { RegistroComponent } from './pages/registro/registro';
import { QuienSoyComponent } from './pages/quien-soy/quien-soy';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'quien-soy', component: QuienSoyComponent },
  {path: 'juegos',
    component: HomeComponent, 
    canActivate: [authGuard]
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];