
import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { PedidoApiService } from '../services/pedido-api';
import { SessaoService } from '../services/sessao';
import { PedidoHistorico } from '../models/pedido-historico.model';

@Component({
  selector: 'app-meus-pedidos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './meus-pedidos.html',
  styleUrl: './meus-pedidos.css'
})
export class MeusPedidos implements OnInit {

  pedidos: PedidoHistorico[] = [];

  carregando: boolean = true;
  mensagemErro: string = '';

  constructor(
    private pedidoApi: PedidoApiService,
    private sessaoService: SessaoService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarPedidos();
  }

  carregarPedidos(): void {

    const clienteId = this.sessaoService.getClienteId();

    if (clienteId === null) {
      this.carregando = false;
      this.mensagemErro = 'Cliente não autenticado.';
      return;
    }

    this.carregando = true;
    this.mensagemErro = '';

    this.pedidoApi.listarPedidosCliente(clienteId).subscribe({

      next: (pedidos) => {

        this.pedidos = [...pedidos].sort(
          (a, b) =>
            new Date(b.dataPedido).getTime() -
            new Date(a.dataPedido).getTime()
        );

        this.carregando = false;
        this.cd.markForCheck();
      },

      error: (erro) => {

        console.error('Erro ao carregar pedidos:', erro);

        this.mensagemErro =
          'Não foi possível carregar seus pedidos.';

        this.carregando = false;
        this.cd.markForCheck();
      }

    });
  }
}
