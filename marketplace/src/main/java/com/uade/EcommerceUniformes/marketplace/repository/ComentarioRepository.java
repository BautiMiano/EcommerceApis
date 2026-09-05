package com.uade.EcommerceUniformes.marketplace.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uade.EcommerceUniformes.marketplace.entity.Comentario;

@Repository

public interface ComentarioRepository extends JpaRepository<Comentario, Long> {
    List<Comentario> findByProductoId(Long productoId);

    boolean existsByUsuario_IdAndProducto_Id(Long usuarioId, Long productoId);

   
}