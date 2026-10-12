package com.uade.EcommerceUniformes.marketplace.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.uade.EcommerceUniformes.marketplace.entity.OrdenDeCompra;

/**
 * Consultas de órdenes para el chatbot, separadas del repositorio del grupo.
 */
public interface OrdenChatRepository extends JpaRepository<OrdenDeCompra, Long> {

    List<OrdenDeCompra> findTop5ByUsuarioIdOrderByIdDesc(Long usuarioId);
}