
package com.ads.loja.controller;

import com.ads.loja.dto.CarrinhoResponseDto;
import com.ads.loja.dto.ItemCarrinhoRequestDto;
import com.ads.loja.dto.ItemCarrinhoResponseDto;

import com.ads.loja.model.Carrinho;
import com.ads.loja.model.ItemCarrinho;

import com.ads.loja.model.Produto;
import com.ads.loja.service.CarrinhoService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/carrinho")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CarrinhoController {

    private final CarrinhoService carrinhoService;

    @GetMapping("/{clienteId}")
    public ResponseEntity<CarrinhoResponseDto> buscar(
            @PathVariable Integer clienteId
    ) {
        Carrinho carrinho = carrinhoService.buscarOuCriar(clienteId);
        return ResponseEntity.ok(converter(carrinho));
    }

    @PostMapping("/{clienteId}/itens")
    public ResponseEntity<Void> adicionar(
            @PathVariable Integer clienteId,
            @RequestBody ItemCarrinhoRequestDto request
    ) {
        carrinhoService.adicionarProduto(
                clienteId,
                request.produtoId(),
                request.quantidade()
        );

        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{clienteId}/itens/{produtoId}")
    public ResponseEntity<Void> alterarQuantidade(
            @PathVariable Integer clienteId,
            @PathVariable Integer produtoId,
            @RequestBody ItemCarrinhoRequestDto request
    ) {
        carrinhoService.alterarQuantidade(
                clienteId,
                produtoId,
                request.quantidade()
        );

        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{clienteId}/itens/{produtoId}")
    public ResponseEntity<Void> remover(
            @PathVariable Integer clienteId,
            @PathVariable Integer produtoId
    ) {
        carrinhoService.removerProduto(clienteId, produtoId);
        return ResponseEntity.noContent().build();
    }

    private CarrinhoResponseDto converter(Carrinho carrinho) {

        List<ItemCarrinhoResponseDto> itens = carrinho.getItens()
                .stream()
                .map(this::converterItem)
                .toList();

        double total = itens.stream()
                .mapToDouble(ItemCarrinhoResponseDto::subtotal)
                .sum();

        return new CarrinhoResponseDto(
                carrinho.getId(),
                itens,
                total
        );
    }


    private ItemCarrinhoResponseDto converterItem(ItemCarrinho item) {

        Produto produto = item.getProduto();

        double preco = produto.getValorPromo() > 0
                ? produto.getValorPromo()
                : produto.getPreco();

        Integer quantidade = item.getQuantidade();

        return new ItemCarrinhoResponseDto(
                produto.getId(),
                produto.getNome(),
                produto.getDescricao(),
                preco,
                produto.getImagem(),
                produto.getCategoria(),
                produto.getDetalhes(),
                quantidade,
                preco * quantidade
        );
    }

}
