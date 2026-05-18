import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.html', 
  styleUrl: './app.css'      
})
export class AppComponent implements OnInit {
  usuarioLogueado: any = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.usuario$.subscribe(user => {
      this.usuarioLogueado = user;
    });
  }

  async logout() {
    await this.authService.salir();
    this.router.navigate(['/login']);
  }
}