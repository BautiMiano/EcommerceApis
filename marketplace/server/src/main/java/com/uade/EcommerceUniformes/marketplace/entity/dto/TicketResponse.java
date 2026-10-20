package com.uade.EcommerceUniformes.marketplace.entity.dto;

import java.util.Date;
import java.util.Objects;

import com.uade.EcommerceUniformes.marketplace.entity.Ticket;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TicketResponse {

    private Long id;
    private String asunto;
    private String mensaje;
    private String respuesta;
    private Date fechaCreacion;
    private Date fechaRespuesta;
    private String estado;
    private String vendedor;

    /** Arma la respuesta a partir del ticket, sin exponer al usuario completo. */
        public static TicketResponse desde(Ticket ticket) {
        String nombre = Objects.toString(ticket.getUsuario().getNombre(), "");
        String apellido = Objects.toString(ticket.getUsuario().getApellido(), "");

        return new TicketResponse(
                ticket.getId(),
                ticket.getAsunto(),
                ticket.getMensaje(),
                ticket.getRespuesta(),
                ticket.getFechaCreacion(),
                ticket.getFechaRespuesta(),
                ticket.getEstado() != null ? ticket.getEstado().name() : null,
                (nombre + " " + apellido).trim());
    }
}