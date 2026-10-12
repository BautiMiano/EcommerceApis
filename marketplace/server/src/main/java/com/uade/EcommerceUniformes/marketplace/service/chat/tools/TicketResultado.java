package com.uade.EcommerceUniformes.marketplace.service.chat.tools;

/**
 * Lo que el bot ve de cada ticket.
 */
public record TicketResultado(
        Long id,
        String asunto,
        String mensaje,
        String estado,
        String fechaCreacion,
        boolean respondido,
        String respuesta,
        String fechaRespuesta) {
}