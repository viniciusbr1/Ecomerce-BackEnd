
package com.ads.loja.dto;

import java.util.List;

public record CarrinhoResponseDto(
        Integer id,
        List<ItemCarrinhoResponseDto> itens,
        double total
) {
}
