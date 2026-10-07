package com.uade.EcommerceUniformes.marketplace.service.chat.tools;

/**
 * Lo que el bot ve de cada producto del vendedor.
 */
public record MiProductoResultado(
        Long id,
        String nombre,
        String talle,
        String categoria,
        String estado,
        double precio,
        int stock,
        int stockReservado,
        int stockDisponible,
        boolean activo) {
}