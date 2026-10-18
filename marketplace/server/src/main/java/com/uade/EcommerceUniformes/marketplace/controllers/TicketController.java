package com.uade.EcommerceUniformes.marketplace.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.EcommerceUniformes.marketplace.entity.Ticket;
import com.uade.EcommerceUniformes.marketplace.entity.dto.RespuestaTicketRequest;
import com.uade.EcommerceUniformes.marketplace.entity.dto.TicketResponse;
import com.uade.EcommerceUniformes.marketplace.entity.dto.TicketRequest;
import com.uade.EcommerceUniformes.marketplace.service.TicketService;

@RestController
@RequestMapping("tickets")
@CrossOrigin ("http://localhost:5173")

public class TicketController {

    @Autowired
    private TicketService ticketService;

    @PostMapping
    public ResponseEntity<TicketResponse> crearTicket(@RequestBody TicketRequest request) {
        return ResponseEntity.ok(TicketResponse.desde(ticketService.crearTicket(request)));
    }

    @GetMapping("/mis-tickets")
    public ResponseEntity<List<TicketResponse>> getMisTickets() {
        return ResponseEntity.ok(ticketService.getMisTickets().stream()
                .map(TicketResponse::desde)
                .toList());
    }

    @GetMapping
    public ResponseEntity<List<TicketResponse>> getTickets() {
        return ResponseEntity.ok(ticketService.getTickets().stream()
                .map(TicketResponse::desde)
                .toList());
    }

    @GetMapping("/{ticketId}")
    public ResponseEntity<TicketResponse> getTicketById(@PathVariable Long ticketId) {
        return ticketService.getTicketById(ticketId)
                .map(TicketResponse::desde)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}