import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JuegosService } from '../../services/juegos.service';

interface Carta {
  numero: number;
  palo: string;
}

@Component({
  selector: 'app-mayor-menor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mayor-menor.component.html',
  styleUrls: ['./mayor-menor.component.css']
})
export class MayorMenorComponent implements OnInit {
  palos: string[] = ['Espada', 'Basto', 'Oro', 'Copa'];
  cartaActual!: Carta;
  cartaSiguiente!: Carta;
  puntos: number = 0;
  intentos: number = 0;
  maxIntentos: number = 10;
  juegoTerminado: boolean = false;
  mensaje: string = '¿La siguiente carta será mayor o menor?';

  constructor(private juegosService: JuegosService) {}

  ngOnInit() {
    this.reiniciarJuego();
  }

  generarCarta(): Carta {
    return {
      numero: Math.floor(Math.random() * 12) + 1,
      palo: this.palos[Math.floor(Math.random() * this.palos.length)]
    };
  }

  reiniciarJuego() {
    this.cartaActual = this.generarCarta();
    this.puntos = 0;
    this.intentos = 0;
    this.juegoTerminado = false;
    this.mensaje = '¡Comienza el juego!';
  }

  jugar(eleccion: 'mayor' | 'menor') {
    if (this.juegoTerminado) return;

    this.cartaSiguiente = this.generarCarta();
    this.intentos++;

    if (this.cartaSiguiente.numero === this.cartaActual.numero) {
      this.mensaje = `🃏 Salió el mismo número (${this.cartaSiguiente.numero} de ${this.cartaSiguiente.palo}). No sumás puntos.`;
    } else if (
      (eleccion === 'mayor' && this.cartaSiguiente.numero > this.cartaActual.numero) ||
      (eleccion === 'menor' && this.cartaSiguiente.numero < this.cartaActual.numero)
    ) {
      this.puntos++;
      this.mensaje = `✅ ¡Acertaste! Salió el ${this.cartaSiguiente.numero} de ${this.cartaSiguiente.palo}.`;
    } else {
      this.mensaje = `❌ ¡Le erraste! Salió el ${this.cartaSiguiente.numero} de ${this.cartaSiguiente.palo}.`;
    }

    this.cartaActual = this.cartaSiguiente;

    if (this.intentos >= this.maxIntentos) {
      this.juegoTerminado = true;
      const ganoJuego = this.puntos >= 5; // Gana si acierta el 50% o más
      this.juegosService.guardarResultado('Mayor o Menor', ganoJuego, `Consiguió ${this.puntos} aciertos de ${this.maxIntentos} intentos`);
    }
  }
}