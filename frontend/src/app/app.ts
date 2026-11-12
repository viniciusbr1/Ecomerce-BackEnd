import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  PLATFORM_ID,
  ViewChild
} from '@angular/core';

import {
  isPlatformBrowser
} from '@angular/common';

import {
  RouterLink,
  RouterOutlet
} from '@angular/router';


@Component({
  selector: 'app-root',

  imports: [
    RouterOutlet,
    RouterLink
  ],

  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements AfterViewInit {

  @ViewChild('matrixGlobal')
  canvas!: ElementRef<HTMLCanvasElement>;


  mouseX: number = -1000;
  mouseY: number = -1000;

  mouseAtivo: boolean = false;

  gotas: any[] = [];


  constructor(
    @Inject(PLATFORM_ID)
    private platformId: Object
  ) {

  }


  ngAfterViewInit() {

    if (
      isPlatformBrowser(
        this.platformId
      )
    ) {

      this.iniciarMatrix();

    }

  }


  moverMouseGlobal(
    event: MouseEvent
  ) {

    if (
      !isPlatformBrowser(
        this.platformId
      )
    ) {

      return;

    }


    const retangulo =
      this.canvas.nativeElement
        .getBoundingClientRect();


    this.mouseX =
      event.clientX
      - retangulo.left;


    this.mouseY =
      event.clientY
      - retangulo.top;


    this.mouseAtivo = true;

  }


  moverTouchGlobal(
    event: TouchEvent
  ) {

    if (
      !isPlatformBrowser(
        this.platformId
      )
    ) {

      return;

    }


    const toque =
      event.touches[0];


    if (!toque) {

      return;

    }


    const retangulo =
      this.canvas.nativeElement
        .getBoundingClientRect();


    this.mouseX =
      toque.clientX
      - retangulo.left;


    this.mouseY =
      toque.clientY
      - retangulo.top;


    this.mouseAtivo = true;

  }


  sairMouseGlobal() {

    this.mouseAtivo = false;

    this.mouseX = -1000;
    this.mouseY = -1000;

  }


  iniciarMatrix() {

    const canvas =
      this.canvas.nativeElement;


    const ctx =
      canvas.getContext('2d');


    if (!ctx) {

      return;

    }


    const ajustarCanvas = () => {

      canvas.width =
        window.innerWidth;


      canvas.height =
        window.innerHeight;


      this.criarGotas();

    };


    ajustarCanvas();


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


      for (
        let gota of this.gotas
      ) {

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

          if (
            distanciaX < 0
          ) {

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
            Math.random()
            * canvas.width;


          gota.velocidadeX = 0;


          gota.velocidadeY =
            gota.velocidadeOriginal;

        }


        if (
          gota.x < 0
        ) {

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


      requestAnimationFrame(
        animar
      );

    };


    animar();

  }


  criarGotas() {

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
        2
        + Math.random() * 4;


      this.gotas.push({

        x:
          Math.random()
          * canvas.width,

        y:
          Math.random()
          * canvas.height,

        velocidadeX:
          0,

        velocidadeY:
          velocidade,

        velocidadeOriginal:
          velocidade,

        caractere:
          this.caractereAleatorio()

      });

    }

  }


  caractereAleatorio() {

    const caracteres =
      '01アイウエオカキクケコサシスセソ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';


    const indice =
      Math.floor(
        Math.random()
        * caracteres.length
      );


    return caracteres[
      indice
    ];

  }

}