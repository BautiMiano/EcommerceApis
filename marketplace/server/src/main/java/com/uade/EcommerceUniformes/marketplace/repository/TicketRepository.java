package com.uade.EcommerceUniformes.marketplace.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.uade.EcommerceUniformes.marketplace.entity.Ticket;
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByUsuarioId(Long usuarioId);    
}
