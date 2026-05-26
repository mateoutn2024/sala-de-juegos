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

    this.preguntadosService.obtenerTrivia().subscribe({
      next: (preguntasFormateadas) => {
        this.listadoPreguntas = preguntasFormateadas;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al traer la trivia:', err);
        this.errorApi = true;
        this.cargando = false;
      }
    });
  }

  get preguntaActual(): Pregunta {
    return this.listadoPreguntas[this.indiceActual];
  }

  responder(opcionSeleccionada: string) {
    if (opcionSeleccionada === this.preguntaActual.respuestaCorrecta) {
      this.aciertos++;
    }

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
      'Preguntados',
      gano,
      `Acertó ${this.aciertos} de ${this.listadoPreguntas.length} preguntas.`
    );
  }
}