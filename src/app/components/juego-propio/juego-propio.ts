import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JuegosService } from '../../services/juegos.service';

@Component({
  selector: 'app-juego-propio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './juego-propio.html',
  styleUrls: ['./juego-propio.css']
})
export class JuegoPropioComponent {
  opciones: string[] = ['Piedra', 'Papel', 'Tijera'];
  emojis: { [key: string]: string } = { 'Piedra': '🪨', 'Papel': '📄', 'Tijera': '✂️' };
  
  eleccionJugador: string | null = null;
  eleccionCPU: string | null = null;
  resultadoTexto: string = '¡Elegí tu jugada para empezar!';
  alertClass: string = 'alert-dark';

  // Métricas locales para calcular el promedio
  partidasTotales: number = 0;
  partidasGanadas: number = 0;
  promedioEfectividad: number = 0;
  progresoGuardado: boolean = false;

  constructor(private juegosService: JuegosService) {}

  jugar(opcion: string) {
    this.eleccionJugador = opcion;
    this.progresoGuardado = false; // Si vuelve a jugar, habilitamos otra vez el guardado
    
    const indiceAleatorio = Math.floor(Math.random() * 3);
    this.eleccionCPU = this.opciones[indiceAleatorio];

    this.partidasTotales++; // Suma una partida jugada

    // Lógica de juego
    if (this.eleccionJugador === this.eleccionCPU) {
      this.resultadoTexto = '¡Empate! 🤝';
      this.alertClass = 'alert-warning';
    } else if (
      (this.eleccionJugador === 'Piedra' && this.eleccionCPU === 'Tijera') ||
      (this.eleccionJugador === 'Papel' && this.eleccionCPU === 'Piedra') ||
      (this.eleccionJugador === 'Tijera' && this.eleccionCPU === 'Papel')
    ) {
      this.resultadoTexto = '¡Ganaste! 🎉';
      this.alertClass = 'alert-success';
      this.partidasGanadas++; // Suma una victoria
    } else {
      this.resultadoTexto = 'Perdiste 😢';
      this.alertClass = 'alert-danger';
    }

    // Calcula el promedio/porcentaje de efectividad actual en tiempo real
    this.promedioEfectividad = Math.round((this.partidasGanadas / this.partidasTotales) * 100);
  }

  // Esta función se encarga de mandar UN SOLO registro con el desempeño general
  guardarPartida() {
    if (this.partidasTotales === 0) return;

    // Se considera "victoria" en el registro general si ganó el 50% o más de las rondas
    const ganoElMatch = this.promedioEfectividad >= 50; 
    const detalleDesempeño = `Efectividad: ${this.promedioEfectividad}% (${this.partidasGanadas}/${this.partidasTotales} rondas ganadas)`;

    this.juegosService.guardarResultado('Juego Propio', ganoElMatch, detalleDesempeño);
    
    this.progresoGuardado = true;
    
    // Opcional: Reiniciar contadores locales tras guardar
    this.partidasTotales = 0;
    this.partidasGanadas = 0;
    this.promedioEfectividad = 0;
    this.resultadoTexto = '¡Progreso enviado! Iniciá una nueva tanda cuando quieras.';
    this.alertClass = 'alert-info';
  }
}