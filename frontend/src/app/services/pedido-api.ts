import { Injectable } from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';

import {
  PedidoHistorico
} from '../models/pedido-historico.model';

export interface ItemCriarPedido {

  produtoId: number;

  quantidade: number;

}

export interface CriarPedido {

  clienteId: number;

  itens: ItemCriarPedido[];

  desconto: number;

  frete: number;

}

@Injectable({
  providedIn: 'root'
})
export class PedidoApiService {

  private readonly apiUrl =
    'http://localhost:8080/api/pedidos';

  constructor(
    private http: HttpClient
  ) {}

  criarPedido(
    dados: CriarPedido
  ): Observable<any> {

    return this.http.post<any>(
      this.apiUrl,
      dados
    );

  }

  listarPedidosCliente(
    clienteId: number
  ): Observable<PedidoHistorico[]> {

    return this.http.get<PedidoHistorico[]>(
      `${this.apiUrl}/cliente/${clienteId}`
    );

  }
}