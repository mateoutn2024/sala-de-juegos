import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export class RegistroComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Definición del formulario con todos los campos requeridos
  formRegistro = new FormGroup({
    correo: new FormControl('', [Validators.required, Validators.email]),
    contrasena: new FormControl('', [Validators.required, Validators.minLength(6)]),
    nombre: new FormControl('', [Validators.required]),
    apellido: new FormControl('', [Validators.required]),
    edad: new FormControl('', [Validators.required, Validators.min(1)])
  });

  mensajeError = '';

  async registrarse() {
    if (this.formRegistro.invalid) return;

    try {
      const { correo, contrasena, nombre, apellido, edad } = this.formRegistro.value;

      const response = await this.authService.registrar(
        correo!,
        contrasena!,
        nombre!,
        apellido!,
        Number(edad!)
      );

      // Control de errores de Supabase
      if (response.error) {
        // Emito un mensaje claro si el usuario ya existe en el sistema
        if (response.error.message.includes('already') || response.error.status === 422) {
          this.mensajeError = 'El usuario ya se encuentra registrado.';
        } else {
          this.mensajeError = response.error.message;
        }
        console.error(response.error);
        return;
      }

      // Si se registra correctamente, Supabase inicia sesión de forma automática en el cliente local.
      // Limpiamos alertas y navegamos directamente al Home
      this.mensajeError = '';
      this.router.navigate(['/home']);

    } catch (error: any) {
      this.mensajeError = 'Ocurrió un error inesperado durante el registro.';
      console.error(error);
    }
  }
}