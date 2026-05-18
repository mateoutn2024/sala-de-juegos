import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JuegosService } from '../../services/juegos.service';

@Component({
  selector: 'app-ahorcado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ahorcado.component.html',
  styleUrls: ['./ahorcado.component.css']
})
export class AhorcadoComponent implements OnInit {
  palabras: string[] = ['ANGULAR', 'SUPABASE', 'PROGRAMACION', 'VERCEL', 'GITHUB', 'AVELLANEDA'];
  palabraSecreta: string = '';
  palabraOculta: string[] = [];
  intentosRestantes: number = 6;
  letrasDisponibles: string[] = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');
  letrasUsadas: string[] = [];
  juegoTerminado: boolean = false;
  gano: boolean = false;

  constructor(private juegosService: JuegosService) {}

  ngOnInit() {
    this.reiniciarJuego();
  }

  reiniciarJuego() {
    this.palabraSecreta = this.palabras[Math.floor(Math.random() * this.palabras.length)];
    this.palabraOculta = Array(this.palabraSecreta.length).fill('_');
    this.intentosRestantes = 6;
    this.letrasUsadas = [];
    this.juegoTerminado = false;
    this.gano = false;
  }

  intentarLetra(letra: string) {
    if (this.juegoTerminado || this.letrasUsadas.includes(letra)) return;

    this.letrasUsadas.push(letra);

    if (this.palabraSecreta.includes(letra)) {
      for (let i = 0; i < this.palabraSecreta.length; i++) {
        if (this.palabraSecreta[i] === letra) {
          this.palabraOculta[i] = letra;
        }
      }
      if (!this.palabraOculta.includes('_')) {
        this.juegoTerminado = true;
        this.gano = true;
        this.juegosService.guardarResultado('Ahorcado', true, `Adivinó la palabra: ${this.palabraSecreta}`);
      }
    } else {
      this.intentosRestantes--;
      if (this.intentosRestantes === 0) {
        this.juegoTerminado = true;
        this.gano = false;
        this.juegosService.guardarResultado('Ahorcado', false, `Se quedó sin intentos. La palabra era: ${this.palabraSecreta}`);
      }
    }
  }
}