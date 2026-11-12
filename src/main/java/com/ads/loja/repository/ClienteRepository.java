package com.ads.loja.repository;

import com.ads.loja.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ClienteRepository extends JpaRepository<Cliente, Integer> {

    @Query(value = "SELECT * FROM clientes WHERE email= :email", nativeQuery = true)
    Optional<Cliente> findByEmail(@Param("email") String email);
}
