package com.ads.loja.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record SolicitarRecuperacaoDto(

        @NotBlank
        @Email
        String email

) {
}
