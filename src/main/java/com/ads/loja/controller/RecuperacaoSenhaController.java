
package com.ads.loja.controller;

import com.ads.loja.dto.RecuperacaoSenhaDto;
import com.ads.loja.dto.SolicitarRecuperacaoDto;
import com.ads.loja.service.RecuperacaoSenhaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/recuperacao-senha")
@RequiredArgsConstructor
public class RecuperacaoSenhaController {

    private final RecuperacaoSenhaService recuperacaoSenhaService;

    @PostMapping("/solicitar")
    public ResponseEntity<String> solicitar(
            @Valid @RequestBody SolicitarRecuperacaoDto dados) {

        recuperacaoSenhaService.solicitarRecuperacao(dados.email());

        return ResponseEntity.ok(
                "Se o e-mail estiver cadastrado, a recuperação foi solicitada."
        );
    }

    @PostMapping("/redefinir")
    public ResponseEntity<String> redefinir(
            @Valid @RequestBody RecuperacaoSenhaDto dados) {

        boolean recuperada = recuperacaoSenhaService.recuperarSenha(
                dados.email(),
                dados.codigo(),
                dados.novaSenha()
        );

        if (!recuperada) {
            return ResponseEntity.badRequest()
                    .body("Código inválido ou expirado.");
        }

        return ResponseEntity.ok("Senha atualizada com sucesso.");
    }
}
