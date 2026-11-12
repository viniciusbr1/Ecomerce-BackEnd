package com.ads.loja.service;

import com.ads.loja.dto.LoginDto;
import com.ads.loja.model.Cliente;
import com.ads.loja.repository.ClienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LoginService {

    private final ClienteRepository clienteRepository;
    private final PasswordEncoder passwordEncoder;

    public Optional<Cliente> login(LoginDto dados){
        Optional<Cliente> clienteEncontrado = clienteRepository.findByEmail(dados.email());

        if(clienteEncontrado.isEmpty()){
            return Optional.empty();
        }

        Cliente cliente = clienteEncontrado.get();

        boolean senhaValida = passwordEncoder.matches(
                dados.senha(),
                cliente.getSenha()
        );

        if (senhaValida) {
            return Optional.of(cliente);
        }

        return Optional.empty();
    }
}
