package com.ads.loja.repository;

import com.ads.loja.model.Carrinho;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CarrinhoRepository extends JpaRepository <Carrinho, Integer> {

    Optional<Carrinho> findByClienteId(Integer clienteId);
}
