import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { EncuestaService } from '../../services/encuestas.service';
import { Encuesta } from '../../interfaces/encuestas.interface';
import { fadeInOut, slideUpDown } from '../../animations/encuestas.animations';

export function noSoloEspacios(control: AbstractControl): ValidationErrors | null {
  const esEspacio = (control.value || '').trim().length === 0;
  return !esEspacio ? null : { soloEspacios: true };
}

@Component({
  selector: 'app-encuesta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './encuesta.component.html',
  styleUrls: ['./encuesta.component.css'],
  animations: [fadeInOut, slideUpDown]
})
export class EncuestaComponent implements OnInit {
  formEncuesta!: FormGroup;
  userId: string = '';
  userEmail: string = '';
  
  procesando: boolean = false;
  estadoEnvio: 'EXITO' | 'ERROR' | null = null;
  mensajeFeedback: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private encuestaService: EncuestaService
  ) {
    this.inicializarFormulario();
  }

  ngOnInit(): void {
    this.authService.usuario$.subscribe(user => {
      if (user) {
        this.userId = user.id;
        this.userEmail = user.email || '';
      }
    });
  }

  private inicializarFormulario(): void {
    this.formEncuesta = this.fb.group({
      nombreApellido: ['', [Validators.required, Validators.minLength(3), noSoloEspacios]],
      edad: ['', [Validators.required, Validators.min(18), Validators.max(99), Validators.pattern('^[0-9]+$')]],
      telefono: ['', [Validators.required, Validators.maxLength(10), Validators.pattern('^[0-9]+$')]],
      juegoFavorito: ['', [Validators.required]],
      recomiendaPlataforma: [false, [Validators.requiredTrue]],
      nivelSatisfaccion: [5, [Validators.required, Validators.min(1), Validators.max(10)]],
      sugerencias: ['', [Validators.required, Validators.minLength(10), noSoloEspacios]]
    });
  }

  esInvalido(campo: string): boolean {
    const control = this.formEncuesta.get(campo);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  obtenerError(campo: string, tipoError: string): boolean {
    const control = this.formEncuesta.get(campo);
    return !!(control && control.hasError(tipoError));
  }

  enviarFormulario(): void {
    if (this.formEncuesta.invalid || !this.userId) {
      this.formEncuesta.markAllAsTouched();
      return;
    }

    this.procesando = true;
    this.estadoEnvio = null;

    const datosForm = this.formEncuesta.value;
    const modeloEncuesta: Encuesta = {
      user_id: this.userId,
      user_email: this.userEmail,
      nombre_apellido: datosForm.nombreApellido,
      edad: parseInt(datosForm.edad, 10),
      telefono: datosForm.telefono,
      juego_favorito: datosForm.juegoFavorito,
      recomienda_plataforma: datosForm.recomiendaPlataforma,
      nivel_satisfaccion: parseInt(datosForm.nivelSatisfaccion, 10),
      sugerencias: datosForm.sugerencias
    };

    this.encuestaService.guardarEncuesta(modeloEncuesta).subscribe({
      next: () => {
        this.estadoEnvio = 'EXITO';
        this.mensajeFeedback = '¡Encuesta registrada correctamente!';
        this.formEncuesta.reset({ nivelSatisfaccion: 5, recomiendaPlataforma: false });
        this.procesando = false;
      },
      error: (err: any) => {
        this.estadoEnvio = 'ERROR';
        this.mensajeFeedback = `Error: ${err.message || err}`;
        this.procesando = false;
      }
    });
  }
}