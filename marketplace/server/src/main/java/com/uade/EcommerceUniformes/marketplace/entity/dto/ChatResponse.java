package com.uade.EcommerceUniformes.marketplace.entity.dto;

import java.util.List;

import com.uade.EcommerceUniformes.marketplace.service.chat.tools.ProductoResultado;

public record ChatResponse(Long conversacionId, String respuesta, List<ProductoResultado> productos) {
}