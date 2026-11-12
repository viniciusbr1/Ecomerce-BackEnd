package com.ads.loja.service;


import com.ads.loja.model.Cliente;
import com.ads.loja.repository.ClienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ClienteService {

    private final ClienteRepository clienteRepository;
    private final PasswordEncoder passwordEncoder;


        public Cliente cadastrar(Cliente cliente) {

            String senhaCriptografada = passwordEncoder.encode(cliente.getSenha());
            cliente.setSenha(senhaCriptografada);

            return clienteRepository.save(cliente);
        }
        
        public List<Cliente> listar() {
            return clienteRepository.findAll();
        }

        public Optional<Cliente> buscarPorId(Integer id) {
            return clienteRepository.findById(id);
        }

        public Optional<Cliente> atualizar(Integer id, Cliente dados) {

            Optional<Cliente> clienteEncontrado =
                    clienteRepository.findById(id);

            if (clienteEncontrado.isPresent()) {

                Cliente cliente = clienteEncontrado.get();

                cliente.setNome(dados.getNome());
                cliente.setEmail(dados.getEmail());
                cliente.setTelefone(dados.getTelefone());
                cliente.setCpf(dados.getCpf());
                cliente.setCep(dados.getCep());
                cliente.setEndereco(dados.getEndereco());
                cliente.setNumeroEndereco(dados.getNumeroEndereco());
                cliente.setCidade(dados.getCidade());
                cliente.setEstado(dados.getEstado());

                return Optional.of(clienteRepository.save(cliente));
            }

            return Optional.empty();
        }

        public boolean deletar(Integer id) {

            if (clienteRepository.existsById(id)) {
                clienteRepository.deleteById(id);
                return true;
            }

            return false;
        }
    }


