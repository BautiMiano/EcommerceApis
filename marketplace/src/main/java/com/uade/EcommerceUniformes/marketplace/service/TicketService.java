package com.uade.EcommerceUniformes.marketplace.service;

import java.util.List;
import java.util.Optional;

import com.uade.EcommerceUniformes.marketplace.entity.Ticket;
import com.uade.EcommerceUniformes.marketplace.entity.dto.RespuestaTicketRequest; 
import com.uade.EcommerceUniformes.marketplace.entity.dto.TicketRequest;

public interface TicketService {
    Ticket crearTicket(TicketRequest request);

    List<Ticket> getMisTickets();

    List<Ticket> getTickets();

    Optional<Ticket> getTicketById(Long ticketId);

    void responderTicket(Long ticketId, RespuestaTicketRequest request);
}
