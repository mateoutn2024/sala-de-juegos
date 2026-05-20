import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Formulario reactivo con validaciones estrictas
  formLogin = new FormGroup({
    correo: new FormControl('', [Validators.required, Validators.email]),
    clave: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  mensajeError = '';

  // Función para los 3 botones de prueba
  accesoRapido(correo: string, clave: string) {
    this.formLogin.patchValue({ correo, clave });
    this.ingresar();
  }

  // Lógica principal de inicio de sesión
  async ingresar() {
    if (this.formLogin.invalid) return;

    try {
      const { correo, clave } = this.formLogin.value;
      await this.authService.iniciarSesion(correo!, clave!);
      this.mensajeError = '';
      this.router.navigate(['/home']);
    } catch (error: any) {
      this.mensajeError = 'Credenciales inválidas o usuario no encontrado.';
      console.error(error);
    }
  }
}