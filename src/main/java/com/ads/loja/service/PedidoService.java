
package com.ads.loja.service;

import com.ads.loja.dto.CriarPedidoDto;
import com.ads.loja.dto.ItemPedidoDto;
import com.ads.loja.dto.ItemPedidoHistoricoDto;
import com.ads.loja.dto.PedidoHistoricoDto;
import com.ads.loja.model.Cliente;
import com.ads.loja.model.Pedido;
import com.ads.loja.model.Produto;
import com.ads.loja.model.ItemPedido;
import com.ads.loja.repository.ClienteRepository;
import com.ads.loja.repository.PedidoRepository;
import com.ads.loja.repository.ProdutoRepository;
import com.ads.loja.model.Carrinho;
import com.ads.loja.repository.CarrinhoRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

@Service
@RequiredArgsConstructor
public class PedidoService {

    private final PedidoRepository pedidosRepository;
    private final ClienteRepository clienteRepository;
    private final ProdutoRepository produtoRepository;
    private final CarrinhoRepository carrinhoRepository;


    @Transactional(readOnly = true)
    public List<PedidoHistoricoDto> buscarPedidosPorCliente(
            Integer clienteId
    ) {

        return pedidosRepository
                .buscarPedidosPorCliente(clienteId)
                .stream()
                .map(pedido -> {

                    List<ItemPedidoHistoricoDto> itens =
                            pedido.getItens()
                                    .stream()
                                    .map(item -> {

                                        BigDecimal subtotal =
                                                item.getPrecoUnitario()
                                                        .multiply(
                                                                BigDecimal.valueOf(
                                                                        item.getQuantidade()
                                                                )
                                                        );

                                        return new ItemPedidoHistoricoDto(
                                                item.getProduto().getId(),
                                                item.getProduto().getNome(),
                                                item.getQuantidade(),
                                                item.getPrecoUnitario(),
                                                subtotal
                                        );
                                    })
                                    .toList();

                    return new PedidoHistoricoDto(
                            pedido.getId(),
                            pedido.getDataPedido(),
                            pedido.getStatus(),
                            pedido.getValorTotal(),
                            itens
                    );
                })
                .toList();
    }


    public BigDecimal calcularValorTotal(Pedido pedido) {
        return pedido.getItens().stream()
                .map(item -> item.getPrecoUnitario()
                        .multiply(BigDecimal.valueOf(item.getQuantidade())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    @Transactional
    public Pedido criarPedido(CriarPedidoDto dados) {

        // 1. Verifica se o pedido possui itens

        if (dados.itens() == null || dados.itens().isEmpty()) {
            throw new IllegalArgumentException(
                    "O pedido deve possuir pelo menos um item"
            );
        }

        // 2. Busca o cliente

        Cliente cliente = clienteRepository.findById(dados.clienteId())
                .orElseThrow(() ->
                        new IllegalArgumentException("Cliente não encontrado"));

        // 3. Agrupa quantidades por produto

        Map<Integer, Integer> quantidades = new TreeMap<>();

        for (ItemPedidoDto dadosItem : dados.itens()) {

            if (dadosItem.produtoId() == null) {
                throw new IllegalArgumentException(
                        "O produto deve ser informado"
                );
            }

            if (dadosItem.quantidade() == null ||
                    dadosItem.quantidade() <= 0) {
                throw new IllegalArgumentException(
                        "A quantidade deve ser maior que zero"
                );
            }

            quantidades.merge(
                    dadosItem.produtoId(),
                    dadosItem.quantidade(),
                    Math::addExact
            );
        }

        // 4. Cria o pedido

        Pedido pedido = new Pedido();

        pedido.setCliente(cliente);
        pedido.setDataPedido(LocalDateTime.now());
        pedido.setStatus("PENDENTE");

        // 5. Verifica e desconta o estoque

        for (Map.Entry<Integer, Integer> entrada : quantidades.entrySet()) {

            Integer produtoId = entrada.getKey();
            Integer quantidadeComprada = entrada.getValue();

            Produto produto = produtoRepository
                    .buscarProdutoParaCompra(produtoId)
                    .orElseThrow(() ->
                            new IllegalArgumentException(
                                    "Produto não encontrado: " + produtoId
                            ));

            Integer estoqueAtual = produto.getQuantidade();

            if (estoqueAtual == null || estoqueAtual < quantidadeComprada) {
                throw new IllegalArgumentException(
                        "Estoque insuficiente para o produto: "
                                + produto.getNome()
                );
            }

            // Desconta a quantidade comprada

            produto.setQuantidade(
                    estoqueAtual - quantidadeComprada
            );

            // 6. Cria o item do pedido

            ItemPedido item = new ItemPedido();

            item.setPedido(pedido);
            item.setProduto(produto);
            item.setQuantidade(quantidadeComprada);

            // Usa o preço do banco de dados

            double valor = obterPrecoEfetivo(produto);

            BigDecimal preco = BigDecimal.valueOf(valor)
                    .setScale(2, RoundingMode.HALF_UP);

            item.setPrecoUnitario(preco);

            pedido.getItens().add(item);
        }

        // 7. Calcula o total dos produtos, desconto e frete

        BigDecimal valorProdutos = calcularValorTotal(pedido)
                .setScale(2, RoundingMode.HALF_UP);

        BigDecimal desconto = normalizarValor(dados.desconto());
        BigDecimal frete = normalizarValor(dados.frete());

        if (desconto.compareTo(valorProdutos) > 0) {
            throw new IllegalArgumentException(
                    "O desconto não pode ser maior que o valor dos produtos"
            );
        }

        BigDecimal valorTotal = valorProdutos
                .subtract(desconto)
                .add(frete)
                .setScale(2, RoundingMode.HALF_UP);

        pedido.setValorTotal(valorTotal);


        // 8. Salva o pedido
        Pedido pedidoSalvo = pedidosRepository.save(pedido);

        // 9. Busca o carrinho do cliente
        Carrinho carrinho = carrinhoRepository
                .findByClienteId(cliente.getId())
                .orElse(null);

        // 10. Limpa os itens do carrinho
        if (carrinho != null) {
            carrinho.getItens().clear();
        }

        // 11. Retorna o pedido criado
        return pedidoSalvo;

    }

    private double obterPrecoEfetivo(Produto produto) {
        return produto.getValorPromo() > 0
                ? produto.getValorPromo()
                : produto.getPreco();
    }

    private BigDecimal normalizarValor(BigDecimal valor) {

        if (valor == null) {
            return BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
        }

        if (valor.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException(
                    "Desconto e frete não podem possuir valores negativos"
            );
        }

        return valor.setScale(2, RoundingMode.HALF_UP);
    }
}