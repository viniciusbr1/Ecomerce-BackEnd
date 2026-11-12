
package com.ads.loja.service;

import com.ads.loja.model.Cliente;
import com.ads.loja.repository.ClienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class RecuperacaoSenhaService {

    private final ClienteRepository clienteRepository;
    private final PasswordEncoder passwordEncoder;

    private final SecureRandom random = new SecureRandom();

    private final Map<String, CodigoRecuperacao> codigos =
            new ConcurrentHashMap<>();

    private record CodigoRecuperacao(
            String codigoHash,
            LocalDateTime expiracao,
            int tentativas
    ) {}

    private String gerarCodigo() {
        int numero = random.nextInt(1_000_000);
        return String.format("%06d", numero);
    }

    public void solicitarRecuperacao(String email) {

        if (clienteRepository.findByEmail(email).isEmpty()) {
            return;
        }

        String codigo = gerarCodigo();

        codigos.put(
                email,
                new CodigoRecuperacao(
                        passwordEncoder.encode(codigo),
                        LocalDateTime.now().plusMinutes(10),
                        0
                )
        );

        // Somente para testes locais
        System.out.println("Código de recuperação: " + codigo);
    }

    public boolean recuperarSenha(
            String email,
            String codigo,
            String novaSenha
    ) {
        System.out.println("=== MÉTODO RECUPERAR SENHA EXECUTADO ===");
        System.out.println("Email recebido: " + email);
        System.out.println("Quantidade de dígitos: " + codigo.length());
        System.out.println("Existe código armazenado: " + codigos.containsKey(email));

        CodigoRecuperacao recuperacao = codigos.get(email);

        if (recuperacao == null) {
            System.out.println("ERRO: Nenhum código encontrado para o e-mail.");
            return false;
        }

        if (LocalDateTime.now().isAfter(recuperacao.expiracao())) {
            System.out.println("ERRO: Código expirado.");
            codigos.remove(email);
            return false;
        }

        if (recuperacao.tentativas() >= 5) {
            codigos.remove(email);
            return false;
        }

        if (!passwordEncoder.matches(codigo, recuperacao.codigoHash())) {

            System.out.println("ERRO: Código informado não corresponde.");

            codigos.put(
                    email,
                    new CodigoRecuperacao(
                            recuperacao.codigoHash(),
                            recuperacao.expiracao(),
                            recuperacao.tentativas() + 1
                    )
            );

            return false;
        }

        Cliente cliente = clienteRepository.findByEmail(email)
                .orElse(null);

        if (cliente == null) {
            return false;
        }

        cliente.setSenha(passwordEncoder.encode(novaSenha));

        clienteRepository.save(cliente);

        codigos.remove(email);

        return true;
    }
}
