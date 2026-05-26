import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../environment/environment';
import { BehaviorSubject, Observable, from, map, switchMap, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: SupabaseClient;
  private usuarioSubject = new BehaviorSubject<User | null>(null);
  usuario$ = this.usuarioSubject.asObservable();

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

    this.supabase.auth.onAuthStateChange((event, session) => {
      this.usuarioSubject.next(session?.user ?? null);
    });
  }

  esAdmin(): Observable<boolean> {
    return this.usuario$.pipe(
      switchMap((user: any) => {
        if (!user) return of(false);
        return from(
          this.supabase
            .from('admins')
            .select('id')
            .eq('id', user.id)
            .maybeSingle()
        ).pipe(
          map((response: any) => !!response.data)
        );
      })
    );
  }

  async registrar(email: string, pass: string, nombre: string, apellido: string, edad: number) {
    const response = await this.supabase.auth.signUp({ email, password: pass });

    if (!response.error && response.data.user) {
      await this.supabase.from('usuarios').insert([{
        id: response.data.user.id, 
        email: email,
        nombre: nombre,
        apellido: apellido,
        edad: edad,
        fecha_registro: new Date().toISOString()
      }]);
    }
    
    return response;
  }

  async iniciarSesion(email: string, pass: string) {
    const response = await this.supabase.auth.signInWithPassword({ email, password: pass });
    if (!response.error && response.data.user) {
      await this.guardarLog(email);
    }
    return response;
  }

  async salir() {
    await this.supabase.auth.signOut();
  }

  async getUsuarioActual() {
    const { data: { user } } = await this.supabase.auth.getUser();
    return user;
  }

  private async guardarLog(email: string) {
    await this.supabase.from('log_usuarios').insert([{ 
      email: email, 
      fecha: new Date().toISOString() 
    }]);
  }
}