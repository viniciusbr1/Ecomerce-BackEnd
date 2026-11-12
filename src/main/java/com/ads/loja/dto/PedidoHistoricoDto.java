
package com.ads.loja.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record PedidoHistoricoDto(
        Integer id,
        LocalDateTime dataPedido,
        String status,
        BigDecimal valorTotal,
        List<ItemPedidoHistoricoDto> itens
) {}
