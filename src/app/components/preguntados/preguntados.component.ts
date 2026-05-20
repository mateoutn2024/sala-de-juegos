import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { JuegosService } from '../../services/juegos.service';
import { timeout } from 'rxjs/operators';

interface Digimon {
  name: string;
  image: string;
}

@Component({
  selector: 'app-preguntados',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './preguntados.component.html',
  styleUrls: ['./preguntados.component.css']
})
export class PreguntadosComponent implements OnInit {
  private poolDigimon: Digimon[] = [];
  
  digimonActual!: Digimon;
  opciones: string[] = [];
  puntos: number = 0;
  rondaActual: number = 0;
  maxRondas: number = 10;
  juegoTerminado: boolean = false;
  mensaje: string = '';
  respondido: boolean = false;
  cargando: boolean = true;

  // Distractores fijos de emergencia
  private nombresDistractores = [
    'Agumon', 'Gabumon', 'Patamon', 'Gatomon', 'Tentomon', 'Biyomon',
    'Palmon', 'Gomamon', 'Greymon', 'Garurumon', 'Angemon', 'Appliedmon',
    'Devimon', 'Leomon', 'Ogunamon', 'Veemon', 'Guilmon', 'Renamon'
  ];

  constructor(private http: HttpClient, private juegosService: JuegosService) {}

  ngOnInit() {
    this.cargarDigimonAPI();
  }

  cargarDigimonAPI() {
    this.cargando = true;
    
    // Le pegamos a la API pública trayendo la primera página de criaturas (contiene los más conocidos)
    this.http.get<any>('https://digimon-api.com/api/v1/digimon?pageSize=40')
      .pipe(timeout(3000))
      .subscribe({
        next: (res) => {
          if (res && res.content && Array.isArray(res.content)) {
            this.poolDigimon = res.content
              .filter((d: any) => d.name && d.image)
              .map((d: any) => ({
                name: d.name,
                image: d.image
              }));
          }

          if (this.poolDigimon.length === 0) {
            this.usarFallbackLocal();
          }
          this.iniciarJuego();
        },
        error: (err) => {
          console.warn('API lenta o caída. Activando respaldo local:', err);
          this.usarFallbackLocal();
          this.iniciarJuego();
        }
      });
  }

  usarFallbackLocal() {
    this.poolDigimon = [
      { name: 'Agumon', image: 'https://digimon-api.com/images/digimon/w/Agumon.png' },
      { name: 'Gabumon', image: 'https://digimon-api.com/images/digimon/w/Gabumon.png' },
      { name: 'Patamon', image: 'https://digimon-api.com/images/digimon/w/Patamon.png' },
      { name: 'Gatomon', image: 'https://digimon-api.com/images/digimon/w/Gatomon.png' }
    ];
  }

  iniciarJuego() {
    this.puntos = 0;
    this.rondaActual = 0;
    this.juegoTerminado = false;
    this.siguientePregunta();
  }

  siguientePregunta() {
    if (this.rondaActual >= this.maxRondas || this.poolDigimon.length === 0) {
      this.finalizarJuego();
      return;
    }

    this.cargando = false;
    this.respondido = false;
    this.mensaje = '¿Cómo se llama este Digimon?';
    this.rondaActual++;

    const randomIndex = Math.floor(Math.random() * this.poolDigimon.length);
    this.digimonActual = this.poolDigimon[randomIndex];
    this.poolDigimon.splice(randomIndex, 1); // Evitamos repetidos

    this.generarOpciones(this.digimonActual.name);
  }

  generarOpciones(respuestaCorrecta: string) {
    let listaNombres = this.poolDigimon.map(d => d.name).filter(n => n !== respuestaCorrecta);
    
    if (listaNombres.length < 3) {
      listaNombres = [...listaNombres, ...this.nombresDistractores];
    }

    const incorrectas = listaNombres
      .filter((value, index, self) => self.indexOf(value) === index && value !== respuestaCorrecta)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    this.opciones = [respuestaCorrecta, ...incorrectas].sort(() => 0.5 - Math.random());
  }

  verificarRespuesta(opcionSeleccionada: string) {
    if (this.respondido) return;
    this.respondido = true;

    if (opcionSeleccionada === this.digimonActual.name) {
      this.puntos++;
      this.mensaje = `✅ ¡Excelente! Es ${this.digimonActual.name}.`;
    } else {
      this.mensaje = `❌ Incorrecto. Era: "${this.digimonActual.name}"`;
    }
  }

  finalizarJuego() {
    this.juegoTerminado = true;
    this.cargando = false;
    const ganoJuego = this.puntos >= 5;

    this.juegosService.guardarResultado(
      'Preguntados',
      ganoJuego,
      `Consiguió ${this.puntos} aciertos de ${this.maxRondas} preguntas.`
    );
  }
}