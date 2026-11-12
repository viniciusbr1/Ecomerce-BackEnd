package com.ads.loja.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;


@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String nome;

    private String descricao;

    private double preco;

    private double valorPromo;

    private Integer quantidade;

    private Integer destaque;

    private String categoria;

    private String imagem;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "produto_detalhes",
            joinColumns = @JoinColumn(name = "produto_id")
    )
    @OrderColumn(name = "ordem")
    @Column(name = "detalhe")
    private List<String> detalhes = new ArrayList<>();
    
}
