package com.ads.loja.dto;

import java.util.List;

public record ItemCarrinhoResponseDto(
        Integer produtoId,
        String nome,
        String descricao,
        double preco,
        String imagem,
        String categoria,
        List<String> detalhes,
        Integer quantidade,
        double subtotal
) {}
