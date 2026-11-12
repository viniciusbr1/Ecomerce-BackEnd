export interface ItemPedidoHistorico {
  produtoId: number;
  nome: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
}

export interface PedidoHistorico {
  id: number;
  dataPedido: string;
  status: string;
  valorTotal: number;
  itens: ItemPedidoHistorico[];
}