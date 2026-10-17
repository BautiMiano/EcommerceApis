package com.uade.EcommerceUniformes.marketplace.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uade.EcommerceUniformes.marketplace.entity.Favorito;

@Repository
public interface FavoritoRepository extends JpaRepository<Favorito, Long> {

    List<Favorito> findByUsuarioIdAndActivo(Long usuarioId, boolean activo);

    Optional<Favorito> findByUsuarioIdAndProductoId(Long usuarioId, Long productoId);
}
