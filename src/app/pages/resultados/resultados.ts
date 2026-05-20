import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JuegosService } from '../../services/juegos.service';

interface RecordResultado {
  usuario: string;
  juego: string;
  gano: boolean;
  detalles: string;
  fecha?: string;
  puntaje?: number; 
}

@Component({
  selector: 'app-resultados',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resultados.html', 
  styleUrls: ['./resultados.css']
})
export class ResultadosComponent implements OnInit {
  listaAhorcado: RecordResultado[] = [];
  listaMayorMenor: RecordResultado[] = [];
  listaPokeTrivia: RecordResultado[] = [];
  listaJuegoPropio: RecordResultado[] = [];

  cargando: boolean = true;

  constructor(private juegosService: JuegosService, private cdr: ChangeDetectorRef) {}

  async ngOnInit() {
    await this.obtenerHistorialGlobal();
  }

  async obtenerHistorialGlobal() {
    this.cargando = true;
    
    const data = await this.juegosService.obtenerResultados();
    
    if (data && Array.isArray(data)) {
      const procesados = data.map(item => {
        const numeroExtraido = item.detalles ? parseInt(item.detalles.match(/\d+/)?.[0] || '0', 10) : 0;
        
        return {
          usuario: item.usuario || 'Anónimo',
          juego: item.juego,
          gano: item.resultado === 'Ganado', 
          detalles: item.detalles,
          fecha: item.fecha_hora ? new Date(item.fecha_hora).toLocaleDateString() : '-',
          puntaje: numeroExtraido
        };
      });

      // Filtros
      this.listaAhorcado = procesados.filter(r => r.juego === 'Ahorcado').sort((a, b) => b.puntaje - a.puntaje);
      this.listaMayorMenor = procesados.filter(r => r.juego === 'Mayor o Menor').sort((a, b) => b.puntaje - a.puntaje);
      this.listaPokeTrivia = procesados.filter(r => r.juego === 'Poké-Trivia' || r.juego === 'Preguntados').sort((a, b) => b.puntaje - a.puntaje);
      this.listaJuegoPropio = procesados.filter(r => r.juego === 'Juego Propio').sort((a, b) => b.puntaje - a.puntaje);
    }

    this.cargando = false;
    this.cdr.detectChanges();
  }
}