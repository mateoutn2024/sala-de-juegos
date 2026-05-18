import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../environment/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: SupabaseClient;
  private usuarioSubject = new BehaviorSubject<User | null>(null);
  usuario$ = this.usuarioSubject.asObservable();

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

    // Escucha cambios de sesión (Login, Logout, Registro)
    this.supabase.auth.onAuthStateChange((event, session) => {
      this.usuarioSubject.next(session?.user ?? null);
    });
  }

  // Registro de nuevos usuarios
  async registrar(email: string, pass: string) {
    return await this.supabase.auth.signUp({ email, password: pass });
  }

  async iniciarSesion(email: string, pass: string) {
    const response = await this.supabase.auth.signInWithPassword({ email, password: pass });
    if (!response.error && response.data.user) {
      await this.guardarLog(email);
    }
    return response;
  }

  // Cerrar sesión
  async salir() {
    await this.supabase.auth.signOut();
  }

  // Para el AuthGuard
  async getUsuarioActual() {
    const { data: { user } } = await this.supabase.auth.getUser();
    return user;
  }

  // Registro de ingresos en la base de datos
  private async guardarLog(email: string) {
    await this.supabase.from('log_usuarios').insert([{ 
      email: email, 
      fecha: new Date().toISOString() 
    }]);
  }
}