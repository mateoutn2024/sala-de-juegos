import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { JuegosService } from '../../services/juegos.service';
import { forkJoin } from 'rxjs';

interface Pregunta {
  enunciado: string;
  opciones: string[];
  respuestaCorrecta: string;
  image: string;
}

@Component({
  selector: 'app-preguntados',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preguntados.html',
  styleUrls: ['./preguntados.css']
})
export class PreguntadosComponent implements OnInit {
  listadoPreguntas: Pregunta[] = [];
  indiceActual: number = 0;
  aciertos: number = 0;
  
  cargando: boolean = true;
  errorApi: boolean = false;
  juegoTerminado: boolean = false;

  respondido: boolean = false;
  opcionSeleccionada: string = '';
  mensaje: string = '';

  private poolNombres: string[] = [
    'Pikachu', 'Charizard', 'Bulbasaur', 'Squirtle', 'Eevee', 'Mewtwo', 'Gengar', 
    'Lucario', 'Snorlax', 'Jigglypuff', 'Gardevoir', 'Greninja', 'Blastoise', 
    'Venusaur', 'Rayquaza', 'Garchomp', 'Mudkip', 'Chikorita', 'Cyndaquil', 'Totodile'
  ];

  constructor(
    private http: HttpClient,
    private juegosService: JuegosService,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit() {
    this.iniciarNuevaPartida();
  }

  iniciarNuevaPartida() {
    this.cargando = true;
    this.errorApi = false;
    this.juegoTerminado = false;
    this.indiceActual = 0;
    this.aciertos = 0;
    this.respondido = false;
    this.opcionSeleccionada = '';
    this.mensaje = '';

    const peticiones = [];
    for (let i = 0; i < 10; i++) {
      const idAleatorio = Math.floor(Math.random() * 151) + 1;
      peticiones.push(this.http.get<any>(`https://pokeapi.co/api/v2/pokemon/${idAleatorio}`));
    }

    forkJoin(peticiones).subscribe({
      next: (resultados: any[]) => {
        this.listadoPreguntas = resultados.map(item => {
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
        
        this.cargando = false;
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Error cargando la PokeAPI:', err);
        this.errorApi = true;
        this.cargando = false;
        this.cdr.detectChanges(); 
      }
    });
  }

  get preguntaActual(): Pregunta {
    return this.listadoPreguntas[this.indiceActual];
  }

  verificarRespuesta(opcion: string) {
    if (this.respondido) return;

    this.respondido = true;
    this.opcionSeleccionada = opcion;

    if (opcion === this.preguntaActual.respuestaCorrecta) {
      this.aciertos++;
      this.mensaje = `✅ ¡Correcto! Es ${this.preguntaActual.respuestaCorrecta}.`;
    } else {
      this.mensaje = `❌ ¡Incorrecto! Era ${this.preguntaActual.respuestaCorrecta}.`;
    }
    this.cdr.detectChanges(); 
  }

  siguienteRonda() {
    this.respondido = false;
    this.opcionSeleccionada = '';
    this.mensaje = '';

    if (this.indiceActual < this.listadoPreguntas.length - 1) {
      this.indiceActual++;
    } else {
      this.finalizarJuego();
    }
    this.cdr.detectChanges(); 
  }

  finalizarJuego() {
    this.juegoTerminado = true;
    const gano = this.aciertos >= 5; 

    this.juegosService.guardarResultado(
      'Poké-Trivia',
      gano,
      `Acertó ${this.aciertos} de ${this.listadoPreguntas.length} Pokémon.`
    );
    this.cdr.detectChanges(); 
  }
}