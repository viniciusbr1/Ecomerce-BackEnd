
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginDto {
  email: string;
  senha: string;
}

export interface ClienteLogado {
  id: number;
  nome: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginApiService {

  private readonly apiUrl =
    'http://localhost:8080/api/login';

  constructor(
    private http: HttpClient
  ) {}

  login(dados: LoginDto): Observable<ClienteLogado> {

    return this.http.post<ClienteLogado>(
      this.apiUrl,
      dados
    );

  }

}
