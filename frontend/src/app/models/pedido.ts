export class Pedido {
  nomeCliente: string = '';
  formaPagamento: string = '';

  cep: string = '';
  endereco: string = '';
  numero: string = '';
  cidade: string = '';
  estado: string = '';

  valorProdutos: number = 0;
  desconto: number = 0;
  frete: number = 0;
  valorTotal: number = 0;
}