package org.example.equipamento;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class EquipamentoService {

    private final EquipamentoRepository repository;

    public EquipamentoService(EquipamentoRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<Equipamento> listar(String termo, StatusEquipamento status) {
        String termoNormalizado = termo == null || termo.isBlank() ? null : termo.trim();
        return repository.buscar(termoNormalizado, status);
    }

    @Transactional(readOnly = true)
    public Equipamento buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Equipamento " + id + " não encontrado"));
    }

    public Equipamento criar(Equipamento equipamento) {
        equipamento.setId(null);
        return repository.save(equipamento);
    }

    public Equipamento atualizar(Long id, Equipamento dados) {
        Equipamento equipamento = buscarPorId(id);
        equipamento.setNome(dados.getNome());
        equipamento.setCategoria(dados.getCategoria());
        equipamento.setFabricante(dados.getFabricante());
        equipamento.setModelo(dados.getModelo());
        equipamento.setNumeroPatrimonio(dados.getNumeroPatrimonio());
        equipamento.setLocalizacao(dados.getLocalizacao());
        equipamento.setStatus(dados.getStatus());
        equipamento.setDataAquisicao(dados.getDataAquisicao());
        equipamento.setObservacoes(dados.getObservacoes());
        return repository.save(equipamento);
    }

    public void excluir(Long id) {
        Equipamento equipamento = buscarPorId(id);
        repository.delete(equipamento);
    }
}
