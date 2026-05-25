import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { timeout } from 'rxjs/operators';
import { JuegosService } from '../../services/juegos.service';

interface Pokemon {
  name: string;
  image: string;
}

@Component({
  selector: 'app-preguntados',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  styleUrls: ['./preguntados.css'],
  templateUrl: './preguntados.html'
})
export class PreguntadosComponent implements OnInit {
  private originalPool: Pokemon[] = []; 
  poolPokemon: Pokemon[] = [];
  pokemonActual!: Pokemon;
  opciones: string[] = [];
  opcionSeleccionada: string = ''; 
  puntos: number = 0;
  rondaActual: number = 0;
  maxRondas: number = 10;
  
  juegoTerminado: boolean = false;
  cargando: boolean = true;
  errorApi: boolean = false;
  respondido: boolean = false;
  mensaje: string = '¿Quién es este Pokémon?';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private juegosService: JuegosService) {}

  ngOnInit() {
    this.cargarPokemonAPI();
  }

  cargarPokemonAPI() {
    this.cargando = true;
    this.errorApi = false;
    this.cdr.detectChanges();

    this.http.get<any>('https://pokeapi.co/api/v2/pokemon?limit=151')
      .pipe(timeout(5000))
      .subscribe({
        next: (res) => {
          if (res && res.results && Array.isArray(res.results)) {
            this.originalPool = res.results.map((p: any) => {
              const urlParts = p.url.split('/');
              const id = urlParts[urlParts.length - 2];
              
              return {
                name: p.name,
                image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
              };
            });
            this.iniciarJuego();
          } else {
            this.activarError();
          }
        },
        error: () => {
          this.activarError();
        }
      });
  }

  activarError() {
    this.errorApi = true;
    this.cargando = false;
    this.cdr.detectChanges();
  }

  iniciarJuego() {
    this.puntos = 0;
    this.rondaActual = 0;
    this.juegoTerminado = false;
    this.errorApi = false;
    this.poolPokemon = [...this.originalPool]; 
    this.siguientePregunta();
  }

  siguientePregunta() {
    if (this.rondaActual >= this.maxRondas || this.poolPokemon.length === 0) {
      this.finalizarJuego();
      return;
    }

    this.cargando = false;
    this.respondido = false;
    this.opcionSeleccionada = '';
    this.mensaje = '¿Quién es este Pokémon?';
    this.rondaActual++;

    const randomIndex = Math.floor(Math.random() * this.poolPokemon.length);
    this.pokemonActual = this.poolPokemon[randomIndex];
    this.poolPokemon.splice(randomIndex, 1);

    this.generarOpciones(this.pokemonActual.name);
    this.cdr.detectChanges();
  }

  generarOpciones(respuestaCorrecta: string) {
    const incorrectas = this.originalPool
      .map(p => p.name)
      .filter(name => name !== respuestaCorrecta)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    this.opciones = [respuestaCorrecta, ...incorrectas].sort(() => 0.5 - Math.random());
  }

  verificarRespuesta(opcionSeleccionada: string) {
    if (this.respondido) return;
    this.respondido = true;
    this.opcionSeleccionada = opcionSeleccionada; 
    
    const nombreFormateado = this.pokemonActual.name.charAt(0).toUpperCase() + this.pokemonActual.name.slice(1);

    if (opcionSeleccionada === this.pokemonActual.name) {
      this.puntos++;
      this.mensaje = `✅ ¡Excelente! Es ${nombreFormateado}.`;
    } else {
      this.mensaje = `❌ Incorrecto. Era: "${nombreFormateado}"`;
    }
    this.cdr.detectChanges();
  }

finalizarJuego() {
    this.juegoTerminado = true;
    this.cargando = false;
    this.cdr.detectChanges();
    
    setTimeout(() => {
      this.juegosService.guardarResultado(
        'Preguntados', 
        this.puntos >= 5, 
        `Puntos: ${this.puntos} en ${this.rondaActual} rondas`
      );
    }, 50);
  }
}