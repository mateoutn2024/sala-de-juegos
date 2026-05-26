import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environment/environment';
import { Encuesta } from '../interfaces/encuestas.interface';
import { Observable, from, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EncuestaService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  guardarEncuesta(encuesta: Encuesta): Observable<any> {
    return from(this.supabase.from('encuestas').insert([encuesta])).pipe(
      map((response: any) => {
        if (response.error) throw new Error(response.error.message);
        return response.data;
      })
    );
  }

  obtenerTodas(): Observable<Encuesta[]> {
    return from(
      this.supabase
        .from('encuestas')
        .select('*')
        .order('created_at', { ascending: false })
    ).pipe(
      map((response: any) => {
        if (response.error) throw new Error(response.error.message);
        return response.data as Encuesta[];
      })
    );
  }
}