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
  mensaje: string = '¿La siguiente carta será mayor, menor o igual?';

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

  jugar(eleccion: 'mayor' | 'menor' | 'igual') {
    if (this.juegoTerminado) return;

    this.cartaSiguiente = this.generarCarta();
    this.intentos++;

    const nActual = this.cartaActual.numero;
    const nSiguiente = this.cartaSiguiente.numero;

    if (eleccion === 'igual' && nSiguiente === nActual) {
      this.puntos++;
      this.mensaje = `✅ ¡Acertaste! Salió el mismo número: ${nSiguiente} de ${this.cartaSiguiente.palo}.`;
    } else if (eleccion === 'mayor' && nSiguiente > nActual) {
      this.puntos++;
      this.mensaje = `✅ ¡Acertaste! Salió el ${nSiguiente} de ${this.cartaSiguiente.palo}.`;
    } else if (eleccion === 'menor' && nSiguiente < nActual) {
      this.puntos++;
      this.mensaje = `✅ ¡Acertaste! Salió el ${nSiguiente} de ${this.cartaSiguiente.palo}.`;
    } else {
      this.mensaje = `❌ ¡Le erraste! Salió el ${nSiguiente} de ${this.cartaSiguiente.palo}.`;
    }

    this.cartaActual = this.cartaSiguiente;

    if (this.intentos >= this.maxIntentos) {
      this.juegoTerminado = true;
      const ganoJuego = this.puntos >= 5; 
      this.juegosService.guardarResultado(
        'Mayor o Menor', 
        ganoJuego, 
        `Consigió ${this.puntos} aciertos de ${this.maxIntentos} intentos`
      );
    }
  }
}