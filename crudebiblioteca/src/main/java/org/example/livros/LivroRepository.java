package org.example.livros;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface LivroRepository extends JpaRepository<Livro, Long> {
    @Query("""
            SELECT l FROM Livro l
            WHERE (:titulo IS NULL OR LOWER(l.titulo) LIKE LOWER(CONCAT('%', :titulo, '%')))
              AND (:autor IS NULL OR LOWER(l.autor) LIKE LOWER(CONCAT('%', :autor, '%')))
              AND (:isbn IS NULL OR LOWER(l.isbn) LIKE LOWER(CONCAT('%', :isbn, '%')))
            ORDER BY l.titulo
            """)
    List<Livro> buscar(
            @Param("titulo") String titulo,
            @Param("autor") String autor,
            @Param("isbn") String isbn);
}
