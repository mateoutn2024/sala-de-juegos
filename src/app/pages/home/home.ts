import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {
  esAdministrador: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.esAdmin().subscribe({
      next: (isAdmin: boolean) => {
        this.esAdministrador = isAdmin;
      },
      error: (err: any) => {
        console.error('Error al evaluar el rol de admin:', err);
        this.esAdministrador = false;
      }
    });
  }

  irAJuego(ruta: string) {
    this.router.navigate([`/components/${ruta}`]);
  }
}