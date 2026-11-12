
import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  OnDestroy,
  inject,
  PLATFORM_ID
} from '@angular/core';

import { RouterLink } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-inicio',
  imports: [
    RouterLink
  ],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css'
})
export class Inicio implements AfterViewInit, OnDestroy {

  @ViewChild('matrixCanvas')
  canvas!: ElementRef<HTMLCanvasElement>;

  private platformId = inject(PLATFORM_ID);

  private animationId: number | null = null;

  private ajustarCanvasListener?: () => void;

  mouseX: number = -1000;
  mouseY: number = -1000;

  mouseAtivo: boolean = false;

  gotas: any[] = [];

  // ============================================
  // CICLO DE VIDA DO COMPONENTE
  // ============================================

  ngAfterViewInit(): void {

    // Executa a animação somente no navegador
    if (isPlatformBrowser(this.platformId)) {
      this.iniciarMatrix();
    }

  }

  ngOnDestroy(): void {

    // Evita executar APIs do navegador durante SSR
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Cancela a animação ao sair da página
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    // Remove o evento de redimensionamento
    if (this.ajustarCanvasListener) {
      window.removeEventListener(
        'resize',
        this.ajustarCanvasListener
      );
    }

  }

  // ============================================
  // INTERAÇÃO COM O MOUSE
  // ============================================

  moverMouse(event: MouseEvent): void {

    const retangulo =
      this.canvas.nativeElement.getBoundingClientRect();

    this.mouseX =
      event.clientX - retangulo.left;

    this.mouseY =
      event.clientY - retangulo.top;

    this.mouseAtivo = true;

  }

  sairMouse(): void {

    this.mouseAtivo = false;

    this.mouseX = -1000;
    this.mouseY = -1000;

  }

  // ============================================
  // ANIMAÇÃO MATRIX
  // ============================================

  iniciarMatrix(): void {

    const canvas =
      this.canvas.nativeElement;

    const ctx =
      canvas.getContext('2d');

    if (!ctx) {
      return;
    }

    const ajustarCanvas = () => {

      canvas.width =
        canvas.offsetWidth;

      canvas.height =
        canvas.offsetHeight;

      this.criarGotas();

    };

    ajustarCanvas();

    this.ajustarCanvasListener = ajustarCanvas;

    window.addEventListener(
      'resize',
      ajustarCanvas
    );

    const animar = () => {

      ctx.fillStyle =
        'rgba(0, 0, 0, 0.14)';

      ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      ctx.font =
        '18px monospace';

      for (let gota of this.gotas) {

        const distanciaX =
          gota.x - this.mouseX;

        const distanciaY =
          gota.y - this.mouseY;

        const distancia =
          Math.sqrt(
            distanciaX * distanciaX +
            distanciaY * distanciaY
          );

        if (
          this.mouseAtivo &&
          distancia < 140
        ) {

          if (distanciaX < 0) {

            gota.velocidadeX -= 0.70;

          } else {

            gota.velocidadeX += 0.70;

          }

          gota.velocidadeY *= 0.82;

        } else {

          gota.velocidadeX *= 0.94;

          gota.velocidadeY += 0.05;

          if (
            gota.velocidadeY >
            gota.velocidadeOriginal
          ) {

            gota.velocidadeY =
              gota.velocidadeOriginal;

          }

        }

        gota.x +=
          gota.velocidadeX;

        gota.y +=
          gota.velocidadeY;

        if (
          Math.random() > 0.90
        ) {

          gota.caractere =
            this.caractereAleatorio();

        }

        ctx.fillStyle =
          '#00ff41';

        ctx.fillText(
          gota.caractere,
          gota.x,
          gota.y
        );

        if (
          gota.y >
          canvas.height + 30
        ) {

          gota.y =
            -Math.random() * 200;

          gota.x =
            Math.random() * canvas.width;

          gota.velocidadeX = 0;

          gota.velocidadeY =
            gota.velocidadeOriginal;

        }

        if (gota.x < 0) {

          gota.x =
            canvas.width;

        }

        if (
          gota.x >
          canvas.width
        ) {

          gota.x = 0;

        }

      }

      this.animationId =
        requestAnimationFrame(animar);

    };

    animar();

  }

  // ============================================
  // CRIAÇÃO DAS GOTAS
  // ============================================

  criarGotas(): void {

    const canvas =
      this.canvas.nativeElement;

    this.gotas = [];

    const quantidade =
      Math.floor(
        canvas.width / 8
      );

    for (
      let i = 0;
      i < quantidade;
      i++
    ) {

      const velocidade =
        2 + Math.random() * 4;

      this.gotas.push({

        x:
          Math.random() *
          canvas.width,

        y:
          Math.random() *
          canvas.height,

        velocidadeX: 0,

        velocidadeY:
          velocidade,

        velocidadeOriginal:
          velocidade,

        caractere:
          this.caractereAleatorio()

      });

    }

  }

  // ============================================
  // CARACTERES ALEATÓRIOS
  // ============================================

  caractereAleatorio(): string {

    const caracteres =
      '01アイウエオカキクケコサシスセソ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    const indice =
      Math.floor(
        Math.random() *
        caracteres.length
      );

    return caracteres[indice];

  }

}
