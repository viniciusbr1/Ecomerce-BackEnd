
package com.ads.loja.repository;

import com.ads.loja.model.ItemCarrinho;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ItemCarrinhoRepository
        extends JpaRepository<ItemCarrinho, Integer> {

    Optional<ItemCarrinho> findByCarrinhoIdAndProdutoId(
            Integer carrinhoId,
            Integer produtoId
    );

}
