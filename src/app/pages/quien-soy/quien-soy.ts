import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { GithubService } from '../../services/github.service';

@Component({
  selector: 'app-quien-soy',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './quien-soy.html',
  styleUrls: ['./quien-soy.css']
})

export class QuienSoyComponent implements OnInit {
  miPerfil: any = null;

  constructor(
    private githubService: GithubService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.githubService.getUserData().subscribe({
      next: (data) => {
        this.miPerfil = data;
        this.cdr.detectChanges();
        console.log(this.miPerfil); 
      },
      error: (err) => {
        console.error('Error al conectar con GitHub', err);
      }
    });
  }
}