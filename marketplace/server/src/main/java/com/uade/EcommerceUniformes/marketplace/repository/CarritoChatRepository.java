package com.uade.EcommerceUniformes.marketplace.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.uade.EcommerceUniformes.marketplace.entity.Carrito;

/**
 * Consultas del carrito para el chatbot, separadas del repositorio del grupo.
 */
public interface CarritoChatRepository extends JpaRepository<Carrito, Long> {

    Optional<Carrito> findTopByUsuarioIdOrderByIdDesc(Long usuarioId);
}