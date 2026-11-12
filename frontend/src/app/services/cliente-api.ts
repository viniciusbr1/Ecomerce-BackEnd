
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Cliente } from '../models/cliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteApiService {

  private readonly apiUrl =
    'http://localhost:8080/api/clientes';

  constructor(
    private http: HttpClient
  ) {}

  // CADASTRAR CLIENTE
  cadastrar(dados: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(
      this.apiUrl,
      dados
    );
  }

  // BUSCAR CLIENTE PELO ID
  buscarPorId(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(
      `${this.apiUrl}/${id}`
    );
  }
}
