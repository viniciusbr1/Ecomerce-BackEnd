import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  carrinhoAberto = false;


  abrirCarrinho() {
    this.carrinhoAberto = true;
  }

  fecharCarrinho() {
    this.carrinhoAberto = false;
  }

  perfilAberto = false;

  abrirPerfil() {
    this.perfilAberto = true;
  }

  fecharPerfil() {
    this.perfilAberto = false;
  }

}
