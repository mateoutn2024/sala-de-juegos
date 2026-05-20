import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JuegosService } from '../../services/juegos.service';

@Component({
  selector: 'app-juego-propio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './juego-propio.html',
  styleUrls: ['./juego-propio.css']
})
export class JuegoPropioComponent implements AfterViewInit, OnDestroy {
  @ViewChild('gameCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private animationFrameId: number = 0;

  juegoActivo: boolean = false;
  juegoTerminado: boolean = false;
  mensaje: string = '';
  promedioEfectividad: number = 0;

  // Dimensiones fijas de la mesa
  width = 600;
  height = 400;

  // Entidades del juego con velocidades ralentizadas para jugar lento
  player = { x: 20, y: 150, width: 10, height: 80, score: 0, speed: 6, dy: 0 };
  cpu = { x: 570, y: 150, width: 10, height: 80, score: 0, speed: 2.5 }; // CPU lenta y ganable
  ball = { x: 300, y: 200, r: 8, dx: 3, dy: 3, speed: 3.5 }; // Pelota lenta

  constructor(private juegosService: JuegosService) {}

  ngAfterViewInit() {
    this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
    this.dibujar();
  }

  iniciarJuego() {
    this.player.score = 0;
    this.cpu.score = 0;
    this.juegoActivo = true;
    this.juegoTerminado = false;
    this.resetPelota();
    this.gameLoop();
  }

  gameLoop = () => {
    if (!this.juegoActivo) return;
    this.actualizarLogica();
    this.dibujar();
    this.animationFrameId = requestAnimationFrame(this.gameLoop);
  }

  actualizarLogica() {
    // Mover pelota
    this.ball.x += this.ball.dx;
    this.ball.y += this.ball.dy;

    // Rebotes superiores e inferiores
    if (this.ball.y - this.ball.r < 0 || this.ball.y + this.ball.r > this.height) {
      this.ball.dy *= -1;
    }

    // Inteligencia Artificial de la CPU (movimiento lento y fluido)
    if (this.cpu.y + this.cpu.height / 2 < this.ball.y) {
      this.cpu.y += this.cpu.speed;
    } else {
      this.cpu.y -= this.cpu.speed;
    }

    // Mover paleta del jugador
    this.player.y += this.player.dy;

    // Límites de la pantalla para las paletas
    if (this.player.y < 0) this.player.y = 0;
    if (this.player.y + this.player.height > this.height) this.player.y = this.height - this.player.height;
    if (this.cpu.y < 0) this.cpu.y = 0;
    if (this.cpu.y + this.cpu.height > this.height) this.cpu.y = this.height - this.cpu.height;

    // Colisiones Pelota con las Paletas
    let chocaJugador = (this.ball.x - this.ball.r < this.player.x + this.player.width) &&
                       (this.ball.y > this.player.y && this.ball.y < this.player.y + this.player.height);
                       
    let chocaCpu = (this.ball.x + this.ball.r > this.cpu.x) &&
                   (this.ball.y > this.cpu.y && this.ball.y < this.cpu.y + this.cpu.height);

    if (chocaJugador || chocaCpu) {
      this.ball.dx *= -1.01; // Casi no acelera (1%) para mantener el ritmo lento
      if (chocaJugador) this.ball.x = this.player.x + this.player.width + this.ball.r;
      if (chocaCpu) this.ball.x = this.cpu.x - this.ball.r;
    }

    // Sistema de puntos
    if (this.ball.x < 0) {
      this.cpu.score++;
      this.verificarGanador();
    } else if (this.ball.x > this.width) {
      this.player.score++;
      this.verificarGanador();
    }
  }

  dibujar() {
    // Fondo
    this.ctx.fillStyle = '#1e293b';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Línea del centro
    this.ctx.fillStyle = 'rgba(255,255,255,0.2)';
    for (let i = 0; i < this.height; i += 30) {
      this.ctx.fillRect(this.width / 2 - 1, i, 2, 15);
    }

    // Paletas
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
    this.ctx.fillRect(this.cpu.x, this.cpu.y, this.cpu.width, this.cpu.height);

    // Pelota
    this.ctx.beginPath();
    this.ctx.arc(this.ball.x, this.ball.y, this.ball.r, 0, Math.PI * 2);
    this.ctx.fill();

    // Marcador
    this.ctx.font = 'bold 40px monospace';
    this.ctx.fillStyle = 'rgba(255,255,255,0.4)';
    this.ctx.fillText(this.player.score.toString(), this.width / 4, 60);
    this.ctx.fillText(this.cpu.score.toString(), (3 * this.width) / 4, 60);
  }

  resetPelota() {
    this.ball.x = this.width / 2;
    this.ball.y = this.height / 2;
    // Envía la pelota a una velocidad controlada
    this.ball.dx = (Math.random() > 0.5 ? 1 : -1) * this.ball.speed;
    this.ball.dy = (Math.random() > 0.5 ? 1 : -1) * this.ball.speed;
  }

verificarGanador() {
    if (this.player.score >= 5 || this.cpu.score >= 5) {
      this.juegoActivo = false;
      this.juegoTerminado = true;
      
      // 1. Frenamos el bucle de renderizado inmediatamente
      cancelAnimationFrame(this.animationFrameId);
      
      // 2. CLAVE: Forzamos que la paleta del jugador se detenga en el acto
      this.player.dy = 0; 

      const ganoElMatch = this.player.score >= 5;
      this.mensaje = ganoElMatch ? '¡VICTORIA! 🎉' : 'DERROTA 😢';
      
      const puntosTotales = this.player.score + this.cpu.score;
      this.promedioEfectividad = Math.round((this.player.score / puntosTotales) * 100);

      // 3. Dibujamos el estado final en el canvas para que no quede parpadeando
      this.dibujar();

      // 4. Enviamos de fondo el resultado a Supabase sin bloquear la pantalla
      setTimeout(() => {
        this.juegosService.guardarResultado(
          'Juego Propio',
          ganoElMatch,
          `Efectividad: ${this.promedioEfectividad}% (${this.player.score} vs ${this.cpu.score} CPU)`
        );
      }, 50);

      return;
    } else {
      this.resetPelota();
    }
  }
  
  @HostListener('window:keydown', ['$event'])
  teclaPresionada(event: KeyboardEvent) {
    if (!this.juegoActivo) return;
    if (['ArrowUp', 'ArrowDown', ' '].includes(event.key)) {
      event.preventDefault(); // Evita scroll molesto del navegador
    }
    if (event.key === 'ArrowUp' || event.key === 'w' || event.key === 'W') {
      this.player.dy = -this.player.speed;
    } else if (event.key === 'ArrowDown' || event.key === 's' || event.key === 'S') {
      this.player.dy = this.player.speed;
    }
  }

  @HostListener('window:keyup', ['$event'])
  teclaSoltada(event: KeyboardEvent) {
    if (['ArrowUp', 'w', 'W', 'ArrowDown', 's', 'S'].includes(event.key)) {
      this.player.dy = 0;
    }
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animationFrameId);
  }
}