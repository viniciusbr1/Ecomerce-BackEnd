package com.ads.loja.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RecuperacaoSenhaDto(

        @NotBlank
        @Email
        String email,

        @NotBlank
        String codigo,

        @NotBlank
        @Size(min = 8)
        String novaSenha

) {
}