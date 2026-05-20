import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-quien-soy',
  standalone: true,
  imports: [CommonModule, HttpClientModule], 
  templateUrl: './quien-soy.html',
  styleUrls: ['./quien-soy.css']
})
export class QuienSoyComponent implements OnInit {
  datosGithub: any = null;
  cargando: boolean = true;
  errorApi: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.obtenerDatosGithub();
  }

  obtenerDatosGithub() {
    this.http.get('https://api.github.com/users/mateoutn2024')
      .subscribe({
        next: (res: any) => {
          this.datosGithub = res;
          this.cargando = false;
        },
        error: (err) => {
          console.error('Error al conectar con GitHub API:', err);
          this.errorApi = true;
          this.cargando = false;
        }
      });
  }
}