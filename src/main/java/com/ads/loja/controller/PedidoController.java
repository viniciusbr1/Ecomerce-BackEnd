
package com.ads.loja.controller;

import com.ads.loja.dto.CriarPedidoDto;
import com.ads.loja.dto.PedidoHistoricoDto;
import com.ads.loja.model.Pedido;
import com.ads.loja.service.PedidoService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/pedidos")
@RequiredArgsConstructor
public class PedidoController {

    private final PedidoService pedidoService;

    // BUSCAR HISTÓRICO DE PEDIDOS DO CLIENTE
    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<PedidoHistoricoDto>>
    buscarPedidosPorCliente(@PathVariable Integer clienteId) {

        List<PedidoHistoricoDto> pedidos =
                pedidoService.buscarPedidosPorCliente(clienteId);

        return ResponseEntity.ok(pedidos);
    }

    // CRIAR PEDIDO
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Pedido criarPedido(@RequestBody CriarPedidoDto dados) {

        return pedidoService.criarPedido(dados);
    }
}
