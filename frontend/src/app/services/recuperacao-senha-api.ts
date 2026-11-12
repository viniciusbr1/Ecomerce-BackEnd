
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecuperacaoSenhaApiService {

  private readonly apiUrl =
    'http://localhost:8080/api/recuperacao-senha';

  constructor(private http: HttpClient) {}

  solicitarCodigo(email: string): Observable<string> {
  return this.http.post(
    `${this.apiUrl}/solicitar`,
    { email },
    { responseType: 'text' }
  );
}

  redefinirSenha(
    email: string,
    codigo: string,
    novaSenha: string
  ): Observable<string> {
    return this.http.post(
      `${this.apiUrl}/redefinir`,
      { email, codigo, novaSenha },
      { responseType: 'text' }
    );
  }
}
