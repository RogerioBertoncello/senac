package org.example.livros;

public class LivroNaoEncontradoException extends RuntimeException {
    public LivroNaoEncontradoException(Long id) {
        super("Livro com id " + id + " nao encontrado.");
    }
}
