package com.uade.EcommerceUniformes.marketplace.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.uade.EcommerceUniformes.marketplace.entity.Ticket;

/**
 * Tickets para el chatbot, separados del repositorio del grupo.
 */
public interface TicketChatRepository extends JpaRepository<Ticket, Long> {

    List<Ticket> findByUsuarioIdOrderByIdDesc(Long usuarioId);
}