
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { ClienteLogado } from './login-api';

@Injectable({
  providedIn: 'root'
})
export class SessaoService {

  private cliente: ClienteLogado | null = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const clienteSalvo = sessionStorage.getItem('matrix_cliente');

      if (clienteSalvo) {
        try {
          this.cliente = JSON.parse(clienteSalvo);
        } catch {
          sessionStorage.removeItem('matrix_cliente');
        }
      }
    }
  }

  salvarCliente(cliente: ClienteLogado): void {

    this.cliente = cliente;

    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem(
        'matrix_cliente',
        JSON.stringify(cliente)
      );
    }
  }

  getCliente(): ClienteLogado | null {
    return this.cliente;
  }

  getClienteId(): number | null {
    return this.cliente?.id ?? null;
  }

  sair(): void {

    this.cliente = null;

    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.removeItem('matrix_cliente');
    }
  }
}
