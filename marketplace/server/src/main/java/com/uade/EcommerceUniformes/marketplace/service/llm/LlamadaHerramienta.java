package com.uade.EcommerceUniformes.marketplace.service.llm;

import java.util.Map;

/**
 * Un pedido de Gemini para usar una herramienta. Ej: buscarProductos con {talle: "12"}.
 */
public record LlamadaHerramienta(String id, String nombre, Map<String, Object> args) {
}