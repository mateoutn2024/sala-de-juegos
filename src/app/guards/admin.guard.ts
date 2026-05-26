import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';

export const adminGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  try {
    const esAdministrador = await firstValueFrom(authService.esAdmin());

    if (esAdministrador) {
      return true; 
    }
    
    return router.parseUrl('/home');
  } catch (error) {
    console.error('Error de verificación en el AdminGuard:', error);
    return router.parseUrl('/home');
  }
};