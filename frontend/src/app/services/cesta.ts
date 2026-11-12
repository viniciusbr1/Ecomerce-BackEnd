
import {
  Injectable,
  Inject,
  PLATFORM_ID,
  inject,
  signal
} from '@angular/core';

import { isPlatformBrowser } from '@angular/common';
import { finalize } from 'rxjs';

import { ItemCesta } from '../models/item-cesta';
import { Produto } from '../models/produto';

import {
  CarrinhoApiService,
  CarrinhoResponse
} from './carrinho-api';

import { SessaoService } from './sessao';

@Injectable({
  providedIn: 'root'
})
export class CestaService {

  itens: ItemCesta[] = [];

  desconto: number = 0;
  frete: number = 0;

  sincronizando: boolean = false;

  // Atualiza a interface quando o carrinho muda
  readonly versaoCarrinho = signal(0);

  private carrinhoApi = inject(CarrinhoApiService);
  private sessaoService = inject(SessaoService);

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) {

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (this.getClienteId() !== null) {
      this.carregarCarrinhoDoBanco();
    }
  }

  // NOTIFICAR ALTERAÇÕES
  private notificarAlteracao(): void {
    this.versaoCarrinho.update(valor => valor + 1);
  }

  // CLIENTE LOGADO
  private getClienteId(): number | null {
    return this.sessaoService.getClienteId();
  }

  // CONVERTER RESPOSTA DO POSTGRESQL
  private atualizarComResposta(
    carrinho: CarrinhoResponse
  ): void {

    const itensConvertidos: ItemCesta[] =
      carrinho.itens.map(item => {

        const produto = new Produto();

        produto.id = item.produtoId;
        produto.nome = item.nome;
        produto.descricao = item.descricao;
        produto.preco = item.preco;
        produto.imagem = item.imagem;
        produto.categoria = item.categoria;
        produto.detalhes = item.detalhes ?? [];

        const itemCesta = new ItemCesta();

        itemCesta.produto = produto;
        itemCesta.quantidade = item.quantidade;

        return itemCesta;
      });

    // Mantém a referência utilizada pelo componente Cesta
    this.itens.splice(
      0,
      this.itens.length,
      ...itensConvertidos
    );

    this.notificarAlteracao();
  }

  // CARREGAR CARRINHO DO POSTGRESQL
  carregarCarrinhoDoBanco(): void {

    const clienteId = this.getClienteId();

    if (clienteId === null || this.sincronizando) {
      return;
    }

    this.sincronizando = true;

    // Limpa itens de uma conta anterior enquanto carrega
    this.limparCesta();

    this.carrinhoApi.buscar(clienteId)
      .pipe(
        finalize(() => {
          this.sincronizando = false;
        })
      )
      .subscribe({

        next: (carrinho) => {

          if (this.getClienteId() !== clienteId) {
            return;
          }

          this.atualizarComResposta(carrinho);

          console.log(
            'Carrinho recuperado do PostgreSQL:',
            this.itens
          );
        },

        error: (erro) => {
          console.error(
            'Erro ao recuperar carrinho:',
            erro
          );
        }
      });
  }

  // ATUALIZAR CARRINHO APÓS OPERAÇÃO
  private atualizarCarrinho(
    clienteId: number
  ): void {

    this.carrinhoApi.buscar(clienteId)
      .pipe(
        finalize(() => {
          this.sincronizando = false;
        })
      )
      .subscribe({

        next: (carrinho) => {

          if (this.getClienteId() !== clienteId) {
            return;
          }

          this.atualizarComResposta(carrinho);
        },

        error: (erro) => {
          console.error(
            'Erro ao atualizar carrinho:',
            erro
          );
        }
      });
  }

  // ADICIONAR PRODUTO
  adicionarProduto(produto: Produto): void {

    const clienteId = this.getClienteId();

    // Visitantes não podem adicionar produtos
    if (clienteId === null) {
      console.warn(
        'É necessário fazer login para adicionar produtos.'
      );
      return;
    }

    if (this.sincronizando) return;

    this.sincronizando = true;

    this.carrinhoApi.adicionar(
      clienteId,
      produto.id,
      1
    ).subscribe({

      next: () => {
        this.atualizarCarrinho(clienteId);
      },

      error: (erro) => {
        console.error(
          'Erro ao adicionar produto:',
          erro
        );

        this.sincronizando = false;
      }
    });
  }

  // LISTAR ITENS
  getItens(): ItemCesta[] {
    return this.itens;
  }

  // AUMENTAR QUANTIDADE
  aumentarQuantidade(item: ItemCesta): void {

    const clienteId = this.getClienteId();

    if (clienteId === null || this.sincronizando) {
      return;
    }

    this.sincronizando = true;

    this.carrinhoApi.alterarQuantidade(
      clienteId,
      item.produto.id,
      item.quantidade + 1
    ).subscribe({

      next: () => {
        this.atualizarCarrinho(clienteId);
      },

      error: (erro) => {
        console.error(
          'Erro ao aumentar quantidade:',
          erro
        );

        this.sincronizando = false;
      }
    });
  }

  // DIMINUIR QUANTIDADE
  diminuirQuantidade(item: ItemCesta): void {

    const clienteId = this.getClienteId();

    if (
      clienteId === null ||
      this.sincronizando ||
      item.quantidade <= 1
    ) {
      return;
    }

    this.sincronizando = true;

    this.carrinhoApi.alterarQuantidade(
      clienteId,
      item.produto.id,
      item.quantidade - 1
    ).subscribe({

      next: () => {
        this.atualizarCarrinho(clienteId);
      },

      error: (erro) => {
        console.error(
          'Erro ao diminuir quantidade:',
          erro
        );

        this.sincronizando = false;
      }
    });
  }

  // REMOVER PRODUTO
  removerItem(item: ItemCesta): void {

    const clienteId = this.getClienteId();

    if (clienteId === null || this.sincronizando) {
      return;
    }

    this.sincronizando = true;

    this.carrinhoApi.remover(
      clienteId,
      item.produto.id
    ).subscribe({

      next: () => {
        this.atualizarCarrinho(clienteId);
      },

      error: (erro) => {
        console.error(
          'Erro ao remover produto:',
          erro
        );

        this.sincronizando = false;
      }
    });
  }

  // TOTAL DOS PRODUTOS
  calcularTotalProdutos(): number {

    let total = 0;

    for (const item of this.itens) {
      total += item.produto.preco * item.quantidade;
    }

    return total;
  }

  // DESCONTO
  salvarDesconto(valor: number): void {
    this.desconto = valor;
  }

  getDesconto(): number {
    return this.desconto;
  }

  // FRETE
  salvarFrete(valor: number): void {
    this.frete = valor;
  }

  getFrete(): number {
    return this.frete;
  }

  // TOTAL FINAL
  calcularTotalFinal(): number {
    return this.calcularTotalProdutos()
      - this.desconto
      + this.frete;
  }

  // LIMPAR SOMENTE O CARRINHO EXIBIDO
  limparCesta(): void {

    this.itens.splice(0, this.itens.length);

    this.desconto = 0;
    this.frete = 0;

    this.notificarAlteracao();
  }
}
