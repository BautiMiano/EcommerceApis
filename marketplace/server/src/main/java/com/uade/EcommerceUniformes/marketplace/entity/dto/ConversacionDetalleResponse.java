package com.uade.EcommerceUniformes.marketplace.entity.dto;

import java.util.List;

/** Una charla con todos sus mensajes, del más viejo al más nuevo. */
public record ConversacionDetalleResponse(Long id, String titulo, List<MensajeDto> mensajes) {
}