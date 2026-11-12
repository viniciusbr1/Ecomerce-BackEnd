package com.ads.loja.dto;

import java.math.BigDecimal;
import java.util.List;

public record CriarPedidoDto(
        Integer clienteId,
        List<ItemPedidoDto> itens,
        BigDecimal desconto,
        BigDecimal frete
) {}
