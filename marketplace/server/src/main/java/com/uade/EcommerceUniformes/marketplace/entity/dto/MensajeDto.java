package com.uade.EcommerceUniformes.marketplace.entity.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.uade.EcommerceUniformes.marketplace.service.chat.tools.ProductoResultado;

public record MensajeDto(String autor, String texto, LocalDateTime fecha, List <ProductoResultado> productos) {
}