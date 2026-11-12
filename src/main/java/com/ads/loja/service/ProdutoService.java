package com.ads.loja.service;

import com.ads.loja.model.Produto;
import com.ads.loja.repository.ProdutoRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ProdutoService {

    public final ProdutoRepository produtoRepository;

    public Produto cadastrar(Produto produto) {
        return produtoRepository.save(produto);
    }

    public List<Produto> listarProdutos(){
        return produtoRepository.findAll();
    }

    public Optional<Produto> buscarProdutoPorId(int id){
        return produtoRepository.findById(id);
    }

    public Optional<Produto> atualizarProduto(Integer id, Produto dados) {

        Optional<Produto> produtoEncontrado = produtoRepository.findById(id);

        if (produtoEncontrado.isPresent()) {

            Produto produto = produtoEncontrado.get();
            produto.setNome(dados.getNome());
            produto.setDescricao(dados.getDescricao());
            produto.setPreco(dados.getPreco());
            produto.setValorPromo(dados.getValorPromo());
            produto.setQuantidade(dados.getQuantidade());
            produto.setDestaque(dados.getDestaque());

            return Optional.of(produtoRepository.save(produto));
        }

        return Optional.empty();
    }

   public boolean deletar(int id) {

        if (produtoRepository.existsById(id)) {
            produtoRepository.deleteById(id);
            return true;
        }

        return false;
    }
}
