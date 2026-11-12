
package com.ads.loja.service;

import com.ads.loja.model.Carrinho;
import com.ads.loja.model.Cliente;
import com.ads.loja.model.ItemCarrinho;
import com.ads.loja.model.Produto;

import com.ads.loja.repository.CarrinhoRepository;
import com.ads.loja.repository.ClienteRepository;
import com.ads.loja.repository.ItemCarrinhoRepository;
import com.ads.loja.repository.ProdutoRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CarrinhoService {

    private final CarrinhoRepository carrinhoRepository;
    private final ItemCarrinhoRepository itemCarrinhoRepository;
    private final ClienteRepository clienteRepository;
    private final ProdutoRepository produtoRepository;

    @Transactional
    public Carrinho buscarOuCriar(Integer clienteId) {

        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Cliente não encontrado."
                        )
                );

        return carrinhoRepository.findByClienteId(clienteId)
                .orElseGet(() -> {
                    Carrinho carrinho = new Carrinho();
                    carrinho.setCliente(cliente);
                    return carrinhoRepository.save(carrinho);
                });
    }

    @Transactional
    public void adicionarProduto(
            Integer clienteId,
            Integer produtoId,
            Integer quantidade
    ) {

        validarQuantidade(quantidade);

        Carrinho carrinho = buscarOuCriar(clienteId);

        Produto produto = produtoRepository.findById(produtoId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Produto não encontrado."
                        )
                );

        ItemCarrinho item = itemCarrinhoRepository
                .findByCarrinhoIdAndProdutoId(
                        carrinho.getId(),
                        produtoId
                )
                .orElse(null);

        int quantidadeFinal = quantidade;

        if (item != null) {
            quantidadeFinal += item.getQuantidade();
        } else {
            item = new ItemCarrinho();
            item.setCarrinho(carrinho);
            item.setProduto(produto);
        }

        validarEstoque(produto, quantidadeFinal);

        item.setQuantidade(quantidadeFinal);
        itemCarrinhoRepository.save(item);
    }

    @Transactional
    public void alterarQuantidade(
            Integer clienteId,
            Integer produtoId,
            Integer quantidade
    ) {

        validarQuantidade(quantidade);

        Carrinho carrinho = carrinhoRepository
                .findByClienteId(clienteId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Carrinho não encontrado."
                        )
                );

        ItemCarrinho item = itemCarrinhoRepository
                .findByCarrinhoIdAndProdutoId(
                        carrinho.getId(),
                        produtoId
                )
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Produto não encontrado no carrinho."
                        )
                );

        validarEstoque(item.getProduto(), quantidade);

        item.setQuantidade(quantidade);
        itemCarrinhoRepository.save(item);
    }

    @Transactional
    public void removerProduto(
            Integer clienteId,
            Integer produtoId
    ) {

        Carrinho carrinho = carrinhoRepository
                .findByClienteId(clienteId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Carrinho não encontrado."
                        )
                );

        ItemCarrinho item = itemCarrinhoRepository
                .findByCarrinhoIdAndProdutoId(
                        carrinho.getId(),
                        produtoId
                )
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Produto não encontrado no carrinho."
                        )
                );

        itemCarrinhoRepository.delete(item);
    }

    private void validarQuantidade(Integer quantidade) {

        if (quantidade == null || quantidade <= 0) {
            throw new IllegalArgumentException(
                    "A quantidade deve ser maior que zero."
            );
        }
    }

    private void validarEstoque(
            Produto produto,
            Integer quantidade
    ) {

        if (produto.getQuantidade() == null ||
                quantidade > produto.getQuantidade()) {

            throw new IllegalArgumentException(
                    "Estoque insuficiente para o produto: "
                            + produto.getNome()
            );
        }
    }
}
