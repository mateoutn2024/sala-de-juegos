import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreguntadosService, Pregunta } from '../../services/preguntados.service';
import { JuegosService } from '../../services/juegos.service';

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

  constructor(
    private preguntadosService: PreguntadosService,
    private juegosService: JuegosService
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

    this.preguntadosService.obtenerTrivia().subscribe({
      next: (preguntasFormateadas) => {
        this.listadoPreguntas = preguntasFormateadas;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al conectar con la PokeAPI:', err);
        this.errorApi = true;
        this.cargando = false;
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
  }

  finalizarJuego() {
    this.juegoTerminado = true;
    const gano = this.aciertos >= 5; 

    this.juegosService.guardarResultado(
      'Poké-Trivia',
      gano,
      `Acertó ${this.aciertos} de ${this.listadoPreguntas.length} Pokémon.`
    );
  }
}