import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environment/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class JuegosService {
  private supabase: SupabaseClient;

  constructor(private authService: AuthService) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  async guardarResultado(juego: string, gano: boolean, detalles: string) {
    const user = await this.authService.getUsuarioActual();
    if (!user) return;

    const { error } = await this.supabase
      .from('resultados_juegos')
      .insert([
        {
          usuario: user.email,
          juego: juego,
          resultado: gano ? 'Ganado' : 'Perdido',
          detalles: detalles,
          fecha_hora: new Date().toISOString()
        }
      ]);

    if (error) {
      console.error('Error al guardar el resultado:', error.message);
    }
  }
}