package com.uade.EcommerceUniformes.marketplace.service.chat.tools;

/**
 * Lo que el bot ve de cada producto: solo lo necesario, no la entidad entera.
 */
public record ProductoResultado(
        Long id,
        String nombre,
        String descripcion,
        String talle,
        String categoria,
        String estado,
        double precio,
        double precioFinal,
        Double descuentoPorcentaje,
        int stockDisponible) {
}