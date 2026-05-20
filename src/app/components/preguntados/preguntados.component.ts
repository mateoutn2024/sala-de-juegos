import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { JuegosService } from '../../services/juegos.service';
import { timeout } from 'rxjs/operators';

interface Personaje {
  name: string;
  image: string;
  house: string;
}

@Component({
  selector: 'app-preguntados',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './preguntados.component.html',
  styleUrls: ['./preguntados.component.css']
})
export class PreguntadosComponent implements OnInit {
  private poolPersonajes: Personaje[] = [];
  
  personajeActual!: Personaje;
  opciones: string[] = [];
  puntos: number = 0;
  rondaActual: number = 0;
  maxRondas: number = 10;
  juegoTerminado: boolean = false;
  mensaje: string = '';
  respondido: boolean = false;
  cargando: boolean = true;

  private nombresDistractores = [
    'Harry Potter', 'Hermione Granger', 'Ron Weasley', 'Albus Dumbledore',
    'Severus Snape', 'Rubeus Hagrid', 'Lord Voldemort', 'Draco Malfoy',
    'Luna Lovegood', 'Neville Longbottom', 'Ginny Weasley', 'Sirius Black',
    'Remus Lupin', 'Bellatrix Lestrange', 'Minerva McGonagall', 'Cedric Diggory'
  ];

  // Inyectamos PLATFORM_ID para saber si estamos en el servidor o en el navegador
  constructor(
    private http: HttpClient, 
    private juegosService: JuegosService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    // Si se está ejecutando en el servidor (SSR), no hacemos nada para que no se congele
    if (isPlatformBrowser(this.platformId)) {
      this.cargarPersonajes();
    }
  }

  cargarPersonajes() {
    this.cargando = true;
    
    this.http.get<any[]>('https://hp-api.onrender.com/api/characters')
      .pipe(timeout(2000)) // Si tarda más de 2 segundos, corta y va al error
      .subscribe({
        next: (res) => {
          if (res && Array.isArray(res)) {
            this.poolPersonajes = res
              .filter(p => p.name && p.image && p.image.trim() !== '')
              .map(p => ({
                name: p.name,
                image: p.image,
                house: p.house || 'Ninguna'
              }));
          }

          if (this.poolPersonajes.length === 0) {
            this.usarFallbackLocal();
          }
          this.iniciarJuego();
        },
        error: (err) => {
          console.warn('API externa lenta o inaccesible. Activando contingencia local.', err);
          this.usarFallbackLocal();
          this.iniciarJuego();
        }
      });
  }

  usarFallbackLocal() {
    this.poolPersonajes = [
      { name: 'Harry Potter', image: 'https://hp-api.onrender.com/images/harry.jpg', house: 'Gryffindor' },
      { name: 'Hermione Granger', image: 'https://hp-api.onrender.com/images/hermione.jpg', house: 'Gryffindor' },
      { name: 'Ron Weasley', image: 'https://hp-api.onrender.com/images/ron.jpg', house: 'Gryffindor' },
      { name: 'Draco Malfoy', image: 'https://hp-api.onrender.com/images/draco.jpg', house: 'Slytherin' }
    ];
  }

  iniciarJuego() {
    this.puntos = 0;
    this.rondaActual = 0;
    this.juegoTerminado = false;
    this.siguientePregunta();
  }

  siguientePregunta() {
    if (this.rondaActual >= this.maxRondas || this.poolPersonajes.length === 0) {
      this.finalizarJuego();
      return;
    }

    this.cargando = false;
    this.respondido = false;
    this.mensaje = '¿Cómo se llama este personaje?';
    this.rondaActual++;

    const randomIndex = Math.floor(Math.random() * this.poolPersonajes.length);
    this.personajeActual = this.poolPersonajes[randomIndex];
    this.poolPersonajes.splice(randomIndex, 1);

    this.generarOpciones(this.personajeActual.name);
  }

  generarOpciones(respuestaCorrecta: string) {
    const incorrectas = [...this.nombresDistractores]
      .filter(n => n !== respuestaCorrecta)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    this.opciones = [respuestaCorrecta, ...incorrectas].sort(() => 0.5 - Math.random());
  }

  verificarRespuesta(opcionSeleccionada: string) {
    if (this.respondido) return;
    this.respondido = true;

    if (opcionSeleccionada === this.personajeActual.name) {
      this.puntos++;
      this.mensaje = `✅ ¡Excelente! Es ${this.personajeActual.name}.`;
    } else {
      this.mensaje = `❌ Incorrecto. Era: "${this.personajeActual.name}"`;
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