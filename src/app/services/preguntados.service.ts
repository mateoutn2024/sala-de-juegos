import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';

export interface Pregunta {
  enunciado: string;
  opciones: string[];
  respuestaCorrecta: string;
  image: string;
}

@Injectable({
  providedIn: 'root'
})
export class PreguntadosService {
  private poolNombres: string[] = [
    'Pikachu', 'Charizard', 'Bulbasaur', 'Squirtle', 'Eevee', 'Mewtwo', 'Gengar', 
    'Lucario', 'Snorlax', 'Jigglypuff', 'Gardevoir', 'Greninja', 'Blastoise', 
    'Venusaur', 'Rayquaza', 'Garchomp', 'Mudkip', 'Chikorita', 'Cyndaquil', 'Totodile'
  ];

  constructor(private http: HttpClient) {}

  obtenerTrivia(): Observable<Pregunta[]> {
    const peticiones = [];
    
    for (let i = 0; i < 10; i++) {
      const idAleatorio = Math.floor(Math.random() * 151) + 1;
      peticiones.push(this.http.get<any>(`https://pokeapi.co/api/v2/pokemon/${idAleatorio}`));
    }

    return forkJoin(peticiones).pipe(
      map((resultados: any[]) => {
        return resultados.map(item => {
          const nombreCorrecto = item.name.charAt(0).toUpperCase() + item.name.slice(1);
          const imagenUrl = item.sprites.other['official-artwork'].front_default || item.sprites.front_default;

          const setOpciones = new Set<string>();
          setOpciones.add(nombreCorrecto);

          while (setOpciones.size < 4) {
            const falso = this.poolNombres[Math.floor(Math.random() * this.poolNombres.length)];
            if (falso !== nombreCorrecto) {
              setOpciones.add(falso);
            }
          }

          return {
            enunciado: '¿Quién es este Pokémon?',
            opciones: Array.from(setOpciones).sort(() => Math.random() - 0.5),
            respuestaCorrecta: nombreCorrecto,
            image: imagenUrl
          };
        });
      })
    );
  }
}