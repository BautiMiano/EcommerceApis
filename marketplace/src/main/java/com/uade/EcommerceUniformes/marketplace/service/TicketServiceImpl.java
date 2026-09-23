package com.uade.EcommerceUniformes.marketplace.service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.uade.EcommerceUniformes.marketplace.entity.EstadoTicket;
import com.uade.EcommerceUniformes.marketplace.entity.Ticket;
import com.uade.EcommerceUniformes.marketplace.entity.Usuario;
import com.uade.EcommerceUniformes.marketplace.entity.dto.RespuestaTicketRequest;
import com.uade.EcommerceUniformes.marketplace.entity.dto.TicketRequest;
import com.uade.EcommerceUniformes.marketplace.repository.TicketRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TicketServiceImpl implements TicketService {

    private final TicketRepository ticketRepository;
    private final UsuarioLogueadoService usuarioLogueadoService;
    private final EmailService emailService;

    @Override
    public Ticket crearTicket(TicketRequest request) {

        Usuario usuarioLogueado =
                usuarioLogueadoService.obtenerUsuarioLogueado();

        Ticket ticket = new Ticket();

        ticket.setAsunto(request.getAsunto());
        ticket.setMensaje(request.getMensaje());
        ticket.setFechaCreacion(new Date());
        ticket.setEstado(EstadoTicket.ABIERTO);
        ticket.setUsuario(usuarioLogueado);

        return ticketRepository.save(ticket);
    }

    @Override
    public List<Ticket> getMisTickets() {

        Usuario usuarioLogueado =
                usuarioLogueadoService.obtenerUsuarioLogueado();

        return ticketRepository.findByUsuarioId(
                usuarioLogueado.getId());
    }

    @Override
    public List<Ticket> getTickets() {

        return ticketRepository.findAll();
    }

    @Override
    public Optional<Ticket> getTicketById(Long ticketId) {

        return ticketRepository.findById(ticketId);
    }

    @Override
    public void responderTicket(
            Long ticketId,
            RespuestaTicketRequest request) {

        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Ticket no encontrado con id: " + ticketId));

        ticket.setRespuesta(request.getRespuesta());
        ticket.setFechaRespuesta(new Date());
        ticket.setEstado(EstadoTicket.RESPONDIDO);

        ticketRepository.save(ticket);

        emailService.enviarRespuestaTicket(
                ticket.getUsuario().getMail(),
                ticket.getAsunto(),
                request.getRespuesta());
    }
}