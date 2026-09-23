package com.uade.EcommerceUniformes.marketplace.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.EcommerceUniformes.marketplace.entity.Ticket;
import com.uade.EcommerceUniformes.marketplace.entity.dto.RespuestaTicketRequest;
import com.uade.EcommerceUniformes.marketplace.entity.dto.TicketRequest;
import com.uade.EcommerceUniformes.marketplace.service.TicketService;

@RestController
@RequestMapping("tickets")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @PostMapping
    public ResponseEntity<Ticket> crearTicket(@RequestBody TicketRequest request) {
        return ResponseEntity.ok(ticketService.crearTicket(request));
    }

    @GetMapping("/mis-tickets")
    public ResponseEntity<List<Ticket>> getMisTickets() {
        return ResponseEntity.ok(ticketService.getMisTickets());
    }

    @GetMapping
    public ResponseEntity<List<Ticket>> getTickets() {
        return ResponseEntity.ok(ticketService.getTickets());
    }

    @GetMapping("/{ticketId}")
    public ResponseEntity<Optional<Ticket>> getTicketById(@PathVariable Long ticketId) {
        return ResponseEntity.ok(ticketService.getTicketById(ticketId));
    }

    @PatchMapping("/{ticketId}/responder")
    public ResponseEntity<Void> responderTicket(
            @PathVariable Long ticketId,
            @RequestBody RespuestaTicketRequest request) {
        ticketService.responderTicket(ticketId, request);
        return ResponseEntity.ok().build();
    }
}