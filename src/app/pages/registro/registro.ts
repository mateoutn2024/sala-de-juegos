import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Para usar ngModel
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class RegistroComponent {
  nuevoEmail: string = '';
  nuevoPass: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  async onRegistrar() {
    try {
      const response = await this.authService.nuevoUsuario(this.nuevoEmail, this.nuevoPass);
      
      if (response.error) {
        alert("Error: " + response.error.message);
      } else {
        alert("¡Usuario creado con éxito!");
        this.router.navigate(['/home']); // Te manda al home tras registrarte
      }
    } catch (error) {
      console.error("Error inesperado:", error);
    }
  }
}