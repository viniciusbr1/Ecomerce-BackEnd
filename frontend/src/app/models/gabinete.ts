import { Produto } from './produto';

export class Gabinete extends Produto {

  tamanho: string = '';

  cor: string = '';

  quantidadeFans: number = 0;

  vidroLateral: boolean = false;

}