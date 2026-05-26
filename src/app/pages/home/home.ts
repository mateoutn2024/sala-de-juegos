import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {
  esAdministrador$!: Observable<boolean>;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.esAdministrador$ = this.authService.usuario$.pipe(
      switchMap(user => {
        if (user) {
          return this.authService.esAdmin();
        }
        return of(false);
      })
    );
  }

  irAJuego(ruta: string) {
    this.router.navigate([`/components/${ruta}`]);
  }
}