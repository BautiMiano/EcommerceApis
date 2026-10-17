package com.uade.EcommerceUniformes.marketplace.entity.dto;

import java.time.LocalDateTime;

public record MensajeDto(String autor, String texto, LocalDateTime fecha) {
}