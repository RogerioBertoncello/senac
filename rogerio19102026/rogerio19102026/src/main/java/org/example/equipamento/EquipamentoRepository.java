package org.example.equipamento;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EquipamentoRepository extends JpaRepository<Equipamento, Long> {

    @Query("""
            SELECT e FROM Equipamento e
            WHERE (:termo IS NULL OR
                LOWER(COALESCE(e.nome, '')) LIKE LOWER(CONCAT('%', :termo, '%')) OR
                LOWER(COALESCE(e.categoria, '')) LIKE LOWER(CONCAT('%', :termo, '%')) OR
                LOWER(COALESCE(e.fabricante, '')) LIKE LOWER(CONCAT('%', :termo, '%')) OR
                LOWER(COALESCE(e.modelo, '')) LIKE LOWER(CONCAT('%', :termo, '%')) OR
                LOWER(COALESCE(e.numeroPatrimonio, '')) LIKE LOWER(CONCAT('%', :termo, '%')) OR
                LOWER(COALESCE(e.localizacao, '')) LIKE LOWER(CONCAT('%', :termo, '%')) OR
                LOWER(COALESCE(e.observacoes, '')) LIKE LOWER(CONCAT('%', :termo, '%')))
                AND (:status IS NULL OR e.status = :status)
            ORDER BY e.nome
            """)
    List<Equipamento> buscar(@Param("termo") String termo,
                             @Param("status") StatusEquipamento status);
}
