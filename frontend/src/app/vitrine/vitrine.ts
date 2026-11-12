
import {
  Component,
  ChangeDetectorRef,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Produto } from '../models/produto';
import { CestaService } from '../services/cesta';
import { SessaoService } from '../services/sessao';
import { ProdutoApiService } from '../services/produto-api';

@Component({
  selector: 'app-vitrine',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './vitrine.html',
  styleUrl: './vitrine.css'
})
export class Vitrine implements OnInit {

  produtoSelecionado: Produto | null = null;

  categoriaSelecionada: string = 'Todos';
  pesquisa: string = '';

  mensagemCarrinho: string = '';

  produtos: Produto[] = [];

  // Controle do aviso de autenticação
  mostrarAvisoLogin: boolean = false;

  constructor(
    private cestaService: CestaService,
    private sessaoService: SessaoService,
    private produtoApi: ProdutoApiService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.produtoApi.listarProdutos().subscribe({

      next: (dados) => {
        this.produtos = dados;
        this.cd.markForCheck();
      },

      error: (erro) => {
        console.error(
          'Erro ao carregar produtos:',
          erro
        );
        this.cd.markForCheck();
      }
    });
  }

  // FILTRAR CATEGORIA
  filtrarCategoria(categoria: string): void {
    this.categoriaSelecionada = categoria;
  }

  // FILTRAR PRODUTOS
  get produtosFiltrados(): Produto[] {

    let lista = this.produtos;

    if (this.categoriaSelecionada !== 'Todos') {
      lista = lista.filter(
        produto =>
          produto.categoria === this.categoriaSelecionada
      );
    }

    if (this.pesquisa.trim() !== '') {
      lista = lista.filter(
        produto =>
          produto.nome
            .toLowerCase()
            .includes(this.pesquisa.toLowerCase())
      );
    }

    return lista;
  }

  // FORMATAR PREÇO
  formatarPreco(valor: number): string {

    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  // COMPRAR PRODUTO
  comprar(produto: Produto): void {

    const clienteId = this.sessaoService.getClienteId();

    // VISITANTE: EXIBIR AVISO
    if (clienteId === null) {

      this.produtoSelecionado = null;
      this.mostrarAvisoLogin = true;

      this.cd.markForCheck();
      return;
    }

    // CLIENTE LOGADO: ADICIONAR AO CARRINHO
    if (this.cestaService.sincronizando) {
      return;
    }

    this.cestaService.adicionarProduto(produto);

    this.produtoSelecionado = null;

    this.mensagemCarrinho =
      produto.nome + ' - adicionando ao carrinho...';

    this.cd.markForCheck();
  }

  // FECHAR AVISO
  fecharAvisoLogin(): void {
    this.mostrarAvisoLogin = false;
    this.cd.markForCheck();
  }

  // IR PARA LOGIN
  irParaLogin(): void {

    this.fecharAvisoLogin();

    this.router.navigate(['/login']);
  }

  // IR PARA CADASTRO
  irParaCadastro(): void {

    this.fecharAvisoLogin();

    this.router.navigate(['/cadastro']);
  }

  // ABRIR DETALHES
  abrirDetalhes(produto: Produto): void {
    this.produtoSelecionado = produto;
  }

  // FECHAR DETALHES
  fecharDetalhes(): void {
    this.produtoSelecionado = null;
  }
}
