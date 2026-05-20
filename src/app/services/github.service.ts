import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  private apiUrl = 'https://api.github.com/users/mateoutn2024'; 

  constructor(private http: HttpClient) { }

  getUserData(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}