package com.ads.loja.repository;

import com.ads.loja.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PedidoRepository extends JpaRepository <Pedido, Integer> {

    @Query(
            value = "SELECT * FROM pedidos WHERE cliente_id = :clienteId",
            nativeQuery = true
    )
    List<Pedido> buscarPedidosPorCliente(
            @Param("clienteId") Integer clienteId
    );
}
