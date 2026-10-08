package com.uade.EcommerceUniformes.marketplace.service.chat.tools;

import java.util.List;

/**
 * Lo que el bot ve del carrito.
 */
public record CarritoResultado(
        Long id,
        String estado,
        int cantidadProductos,
        double total,
        List<Item> items) {

    public record Item(String producto, String talle, int cantidad, double precioUnitario, double subtotal) {
    }
}