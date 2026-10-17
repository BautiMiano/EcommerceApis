package com.uade.EcommerceUniformes.marketplace.repository;

import java.util.Optional;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.uade.EcommerceUniformes.marketplace.entity.Conversacion;

public interface ConversacionRepository extends JpaRepository<Conversacion, Long> {

    Optional<Conversacion> findByIdAndUsuarioId(Long id, Long usuarioId);
    List<Conversacion> findByUsuarioIdOrderByActualizadaEnDesc(Long usuarioId);
}