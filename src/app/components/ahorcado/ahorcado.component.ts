import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JuegosService } from '../../services/juegos.service';

@Component({
  selector: 'app-ahorcado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ahorcado.component.html',
  styleUrls: ['./ahorcado.component.css']
})
export class AhorcadoComponent implements OnInit, OnDestroy {
  palabras: string[] = ['ANGULAR', 'SUPABASE', 'PROGRAMACION', 'VERCEL', 'GITHUB', 'AVELLANEDA'];
  palabraSecreta: string = '';
  palabraOculta: string[] = [];
  intentosRestantes: number = 6;
  letrasDisponibles: string[] = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');
  letrasUsadas: string[] = [];
  juegoTerminado: boolean = false;
  gano: boolean = false;

  imagenUrl: string = 'assets/ahorcado/6.png'; // Ruta base de la imagen
  cantidadLetrasTocadas: number = 0;
  tiempoSegundos: number = 0;
  cronometro: any;

  constructor(private juegosService: JuegosService) {}

  ngOnInit() {
    this.reiniciarJuego();
  }

  ngOnDestroy() {
    this.detenerCronometro();
  }

  reiniciarJuego() {
    this.palabraSecreta = this.palabras[Math.floor(Math.random() * this.palabras.length)];
    this.palabraOculta = Array(this.palabraSecreta.length).fill('_');
    this.intentosRestantes = 6;
    this.letrasUsadas = [];
    this.juegoTerminado = false;
    this.gano = false;
    
    // Reset de métricas obligatorias
    this.cantidadLetrasTocadas = 0;
    this.tiempoSegundos = 0;
    this.actualizarImagen();
    this.iniciarCronometro();
  }

  iniciarCronometro() {
    this.detenerCronometro();
    this.cronometro = setInterval(() => {
      this.tiempoSegundos++;
    }, 1000);
  }

  detenerCronometro() {
    if (this.cronometro) {
      clearInterval(this.cronometro);
    }
  }

  actualizarImagen() {
    this.imagenUrl = `assets/ahorcado/${this.intentosRestantes}.png`;
  }

  intentarLetra(letra: string) {
    if (this.juegoTerminado || this.letrasUsadas.includes(letra)) return;

    this.letrasUsadas.push(letra);
    this.cantidadLetrasTocadas++; // Suma al total de letras seleccionadas

    if (this.palabraSecreta.includes(letra)) {
      for (let i = 0; i < this.palabraSecreta.length; i++) {
        if (this.palabraSecreta[i] === letra) {
          this.palabraOculta[i] = letra;
        }
      }
      if (!this.palabraOculta.includes('_')) {
        this.juegoTerminado = true;
        this.gano = true;
        this.detenerCronometro();
        
        this.juegosService.guardarResultado(
          'Ahorcado', 
          true, 
          `Adivinó: ${this.palabraSecreta} | Letras: ${this.cantidadLetrasTocadas} | Tiempo: ${this.tiempoSegundos}s`
        );
      }
    } else {
      this.intentosRestantes--;
      this.actualizarImagen(); // Cambia el monigote

      if (this.intentosRestantes === 0) {
        this.juegoTerminado = true;
        this.gano = false;
        this.detenerCronometro();
        
        // Enviamos los datos completos en la derrota
        this.juegosService.guardarResultado(
          'Ahorcado', 
          false, 
          `Perdió palabra: ${this.palabraSecreta} | Letras: ${this.cantidadLetrasTocadas} | Tiempo: ${this.tiempoSegundos}s`
        );
      }
    }
  }
}