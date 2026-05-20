import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { User } from '@supabase/supabase-js';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);
  private subUsuario!: Subscription;

  // Formulario reactivo con validaciones estrictas
  formLogin = new FormGroup({
    correo: new FormControl('', [Validators.required, Validators.email]),
    clave: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  mensajeError = '';
  usuarioLogueado: User | null = null; // Guardará el usuario con sesión activa para mostrarlo

  ngOnInit() {
    // Escucha de forma reactiva si hay un usuario logueado en Supabase actualmente
    this.subUsuario = this.authService.usuario$.subscribe(user => {
      this.usuarioLogueado = user;
    });
  }

  ngOnDestroy() {
    // Desuscripción limpia al salir del componente para evitar fugas de memoria
    if (this.subUsuario) {
      this.subUsuario.unsubscribe();
    }
  }

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
      const response = await this.authService.iniciarSesion(correo!, clave!);
      
      // Control de errores nativos del objeto de respuesta de Supabase
      if (response.error) {
        this.mensajeError = 'Credenciales inválidas o usuario no encontrado.';
        console.error(response.error.message);
        return;
      }

      this.mensajeError = '';
      this.router.navigate(['/home']);
    } catch (error: any) {
      this.mensajeError = 'Credenciales inválidas o usuario no encontrado.';
      console.error(error);
    }
  }
}