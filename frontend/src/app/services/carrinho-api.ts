
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// PRODUTOS DO CARRINHO

export interface ItemCarrinhoResponse {
  produtoId: number;
  nome: string;
  descricao: string;
  preco: number;
  imagem: string;
  categoria: string;
  detalhes: string[];
  quantidade: number;
  subtotal: number;
}

// CARRINHO COMPLETO

export interface CarrinhoResponse {
  id: number;
  itens: ItemCarrinhoResponse[];
  total: number;
}

// REQUISIÇÃO PARA ADICIONAR OU ALTERAR PRODUTO

export interface ItemCarrinhoRequest {
  produtoId: number;
  quantidade: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarrinhoApiService {

  private readonly apiUrl =
    'http://localhost:8080/api/carrinho';

  constructor(private http: HttpClient) {}

  // BUSCAR CARRINHO DO CLIENTE

  buscar(clienteId: number): Observable<CarrinhoResponse> {
    return this.http.get<CarrinhoResponse>(
      `${this.apiUrl}/${clienteId}`
    );
  }

  // ADICIONAR PRODUTO

  adicionar(
    clienteId: number,
    produtoId: number,
    quantidade: number
  ): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/${clienteId}/itens`,
      { produtoId, quantidade }
    );
  }

  // ALTERAR QUANTIDADE

  alterarQuantidade(
    clienteId: number,
    produtoId: number,
    quantidade: number
  ): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/${clienteId}/itens/${produtoId}`,
      { produtoId, quantidade }
    );
  }

  // REMOVER PRODUTO

  remover(
    clienteId: number,
    produtoId: number
  ): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${clienteId}/itens/${produtoId}`
    );
  }
}
