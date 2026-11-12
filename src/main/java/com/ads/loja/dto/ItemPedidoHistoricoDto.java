
package com.ads.loja.dto;

import java.math.BigDecimal;

public record ItemPedidoHistoricoDto(
        Integer produtoId,
        String nome,
        Integer quantidade,
        BigDecimal precoUnitario,
        BigDecimal subtotal
) {}
