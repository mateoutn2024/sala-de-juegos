import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  async nuevoUsuario(email: string, pass: string) {
    return await this.supabase.auth.signUp({
      email,
      password: pass,
    });
  }

  async iniciarSesion(email: string, pass: string) {
    return await this.supabase.auth.signInWithPassword({
      email,
      password: pass,
    });
  }

  async cerrarSesion() {
    return await this.supabase.auth.signOut();
  }
}
