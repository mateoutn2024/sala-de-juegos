import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // <-- Importamos ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { EncuestaService } from '../../services/encuestas.service';
import { Encuesta } from '../../interfaces/encuestas.interface';
import { fadeInOut, listAnimation } from '../../animations/encuestas.animations';

@Component({
  selector: 'app-resultados-encuestas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resultados-encuestas.component.html',
  styleUrls: ['./resultados-encuestas.component.css'],
  animations: [fadeInOut, listAnimation]
})
export class ResultadosEncuestasComponent implements OnInit {
  listadoEncuestas: Encuesta[] = [];
  cargando: boolean = true;
  errorMensaje: string | null = null;

  constructor(
    private encuestaService: EncuestaService,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this.cargarEncuestas();
  }

  cargarEncuestas(): void {
    this.cargando = true;
    this.errorMensaje = null;

    this.encuestaService.obtenerTodas().subscribe({
      next: (datos) => {
        this.listadoEncuestas = datos;
        this.cargando = false;
        this.cdr.detectChanges(); 
      },
      error: (err: any) => {
        console.error(err);
        this.errorMensaje = 'Acceso Restringido: No posees privilegios de administrador del sistema.';
        this.cargando = false;
        this.cdr.detectChanges(); 
      }
    });
  }
}