import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  email: string = '';
  pass: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  async onLogin() {
    try {
      const response = await this.authService.iniciarSesion(this.email, this.pass);
      
      if (response.error) {
        alert("Error al iniciar sesión: " + response.error.message);
      } else {
        console.log("Sesión iniciada:", response.data);
        this.router.navigate(['/home']);
      }
    } catch (error) {
      alert("Ocurrió un error inesperado.");
    }
  }

  accesoRapido() {
    this.email = 'admin@admin.com';
    this.pass = '123456';
  }
}