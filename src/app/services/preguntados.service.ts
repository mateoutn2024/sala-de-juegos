import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Pregunta {
  enunciado: string;
  opciones: string[];
  respuestaCorrecta: string;
}

@Injectable({
  providedIn: 'root'
})
export class PreguntadosService {
  private apiUrl = 'https://opentdb.com/api.php?amount=10&type=multiple';

  constructor(private http: HttpClient) {}

  obtenerTrivia(): Observable<Pregunta[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => {
        return response.results.map((item: any) => {
          const todasLasOpciones = [...item.incorrect_answers, item.correct_answer];
          const opcionesMezcladas = todasLasOpciones.sort(() => Math.random() - 0.5);

          return {
            enunciado: item.question,
            opciones: opcionesMezcladas,
            respuestaCorrecta: item.correct_answer
          };
        });
      })
    );
  }
}