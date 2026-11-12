
import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

import { LoginApiService } from '../services/login-api';
import { SessaoService } from '../services/sessao';
import { RecuperacaoSenhaApiService } from '../services/recuperacao-senha-api';

import { CestaService } from '../services/cesta';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  private cestaService = inject(CestaService);

  constructor(
    private loginApi: LoginApiService,
    private sessaoService: SessaoService,
    private recuperacaoApi: RecuperacaoSenhaApiService,
    private cd: ChangeDetectorRef
  ) {}

  // =========================
  // LOGIN
  // =========================

  email: string = '';
  senha: string = '';
  mensagem: string = '';

  mostrarSenha: boolean = false;

  // =========================
  // RECUPERAÇÃO DE SENHA
  // =========================

  mostrarRecuperacao: boolean = false;
  etapaRecuperacao: number = 1;

  emailRecuperacao: string = '';
  codigoDigitado: string = '';

  novaSenha: string = '';
  confirmarSenha: string = '';

  mostrarNovaSenha: boolean = false;
  mostrarConfirmarSenha: boolean = false;

  mensagemRecuperacao: string = '';
  carregandoRecuperacao: boolean = false;

  // =========================
  // LOGIN NORMAL
  // =========================

  entrar(form: NgForm) {

    if (!form.valid) {
      this.mensagem = 'Verifique os campos.';
      return;
    }

    const dadosLogin = {
      email: this.email,
      senha: this.senha
    };

    this.mensagem = '';

    this.loginApi.login(dadosLogin).subscribe({

      next: (cliente) => {

        this.sessaoService.salvarCliente(cliente);

        this.cestaService.carregarCarrinhoDoBanco();

        this.mensagem = 'Login realizado com sucesso!';

        this.cd.markForCheck();
      },

      error: (erro) => {

        console.error('Erro no login:', erro);

        if (erro.status === 401) {
          this.mensagem = 'E-mail ou senha incorretos.';
        } else {
          this.mensagem = 'Não foi possível realizar o login.';
        }

        this.cd.markForCheck();
      }

    });
  }

  // =========================
  // ABRIR RECUPERAÇÃO
  // =========================

  abrirRecuperacao() {

    this.mostrarRecuperacao = true;
    this.etapaRecuperacao = 1;

    this.emailRecuperacao = '';
    this.codigoDigitado = '';

    this.novaSenha = '';
    this.confirmarSenha = '';

    this.mostrarNovaSenha = false;
    this.mostrarConfirmarSenha = false;

    this.mensagemRecuperacao = '';
    this.carregandoRecuperacao = false;

    this.cd.markForCheck();
  }

  // =========================
  // FECHAR RECUPERAÇÃO
  // =========================

  fecharRecuperacao() {

    if (this.carregandoRecuperacao) {
      return;
    }

    this.mostrarRecuperacao = false;

    this.cd.markForCheck();
  }

  // =========================
  // ETAPA 1 - SOLICITAR CÓDIGO
  // =========================

  gerarCodigo() {

    const email = this.emailRecuperacao.trim();

    const emailValido =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!emailValido) {

      this.mensagemRecuperacao =
        'Digite um e-mail válido.';

      return;
    }

    if (this.carregandoRecuperacao) {
      return;
    }

    this.emailRecuperacao = email;

    this.mensagemRecuperacao = '';
    this.carregandoRecuperacao = true;

    this.cd.markForCheck();

    this.recuperacaoApi.solicitarCodigo(email).subscribe({

      next: (resposta) => {

        console.log(
          'Resposta da recuperação:',
          resposta
        );

        this.carregandoRecuperacao = false;

        this.etapaRecuperacao = 2;

        this.mensagemRecuperacao = '';

        this.cd.markForCheck();
      },

      error: (erro) => {

        console.error(
          'Erro ao solicitar código:',
          erro
        );

        this.carregandoRecuperacao = false;

        this.mensagemRecuperacao =
          'Não foi possível solicitar o código. Tente novamente.';

        this.cd.markForCheck();
      }

    });
  }

  // =========================
  // ETAPA 2 - INFORMAR CÓDIGO
  // =========================

  avancarParaNovaSenha() {

    const codigo = this.codigoDigitado.trim();

    if (!/^\d{6}$/.test(codigo)) {

      this.mensagemRecuperacao =
        'Digite um código de 6 dígitos.';

      return;
    }

    this.codigoDigitado = codigo;

    this.mensagemRecuperacao = '';

    this.etapaRecuperacao = 3;

    this.cd.markForCheck();
  }

  // =========================
  // ETAPA 3 - ALTERAR SENHA
  // =========================

  alterarSenha(form: NgForm) {

    if (!form.valid) {

      this.mensagemRecuperacao =
        'Preencha os campos corretamente.';

      return;
    }

    if (this.novaSenha.length < 8) {

      this.mensagemRecuperacao =
        'A senha deve ter pelo menos 8 caracteres.';

      return;
    }

    if (this.novaSenha !== this.confirmarSenha) {

      this.mensagemRecuperacao =
        'As senhas não são iguais.';

      return;
    }

    if (this.carregandoRecuperacao) {
      return;
    }

    this.carregandoRecuperacao = true;

    this.mensagemRecuperacao = '';

    this.cd.markForCheck();

    this.recuperacaoApi.redefinirSenha(
      this.emailRecuperacao,
      this.codigoDigitado,
      this.novaSenha
    ).subscribe({

      next: (resposta) => {

        console.log(
          'Resposta ao alterar senha:',
          resposta
        );

        this.carregandoRecuperacao = false;

        this.etapaRecuperacao = 4;

        this.mensagemRecuperacao = '';

        this.novaSenha = '';
        this.confirmarSenha = '';
        this.codigoDigitado = '';

        this.cd.markForCheck();
      },

      error: (erro) => {

        console.error(
          'Erro ao alterar senha:',
          erro
        );

        this.carregandoRecuperacao = false;

        if (erro.status === 400) {

          this.mensagemRecuperacao =
            'Código inválido ou expirado. Solicite um novo código se necessário.';

        } else {

          this.mensagemRecuperacao =
            'Não foi possível alterar a senha. Tente novamente.';

        }

        this.cd.markForCheck();
      }

    });

    
  }

  get clienteLogado() {
    return this.sessaoService.getCliente();
  }


  sair(): void {

    // Encerra a sessão local
    this.sessaoService.sair();

    // Limpa apenas os produtos exibidos
    // Não remove nada do PostgreSQL
    this.cestaService.limparCesta();

    this.email = '';
    this.senha = '';
    this.mensagem = '';

    this.mostrarRecuperacao = false;

    this.cd.markForCheck();
  }

  
}
